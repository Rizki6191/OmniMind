package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"

	"gorm.io/gorm"

	"omnimind/importer"
	"omnimind/models"
	"omnimind/services"
)

func runCLI(db *gorm.DB, args []string) {
	if len(args) == 0 {
		return
	}

	switch args[0] {
	case "import":
		if len(args) < 2 {
			log.Fatal("Usage: go run . import <file.yaml>")
		}

		runImportFile(db, args[1])

	case "list":
		runListTools(db)

	case "show":
		if len(args) < 2 {
			log.Fatal("Usage: go run . show <tool-name|id>")
		}

		runShowTool(db, args[1])

	case "delete":
		if len(args) < 2 {
			log.Fatal("Usage: go run . delete <tool-name|id>")
		}

		runDeleteTool(db, args[1])

	case "update":
		if len(args) < 2 {
			log.Fatal("Usage: go run . update <tool-name|id>")
		}

		runUpdateTool(db, args[1])

	default:
		log.Fatalf("Command tidak dikenal: %s", args[0])
	}
}

func runImportFile(db *gorm.DB, path string) {
	log.Printf("Import YAML: %s", path)

	if err := importer.ImportYAML(db, path); err != nil {
		log.Fatalf("Import gagal: %v", err)
	}

	log.Println("Import berhasil!")
}

func runListTools(db *gorm.DB) {
	var tools []models.Tool

	if err := db.
		Select("id", "name", "category").
		Order("name ASC").
		Find(&tools).Error; err != nil {
		log.Fatalf("Gagal mengambil tools: %v", err)
	}

	if len(tools) == 0 {
		fmt.Println("Belum ada tool.")
		return
	}

	fmt.Println("Tools:")
	fmt.Println()

	for _, tool := range tools {
		fmt.Printf(
			"[%d] %-25s %s\n",
			tool.ID,
			tool.Name,
			tool.Category,
		)
	}

	fmt.Printf("\nTotal: %d tool\n", len(tools))
}

func runShowTool(db *gorm.DB, identifier string) {
	var tool models.Tool

	query := db.Preload("Usages")

	if id, err := strconv.ParseUint(identifier, 10, 64); err == nil {
		err = query.First(&tool, id).Error
		if err != nil {
			handleToolNotFound(err)
		}
	} else {
		err = query.
			Where("LOWER(name) = LOWER(?)", identifier).
			First(&tool).Error

		if err != nil {
			handleToolNotFound(err)
		}
	}

	fmt.Println()
	fmt.Println("Name:", tool.Name)
	fmt.Println("Category:", tool.Category)
	fmt.Println("Function:", tool.Function)
	fmt.Println("Description:", strings.TrimSpace(tool.Description))

	fmt.Println()
	fmt.Println("Usages:")

	for _, usage := range tool.Usages {
		fmt.Printf("\n%d. %s\n", usage.SortOrder, usage.Name)
		fmt.Printf("   $ %s\n", usage.Command)
		fmt.Printf("   %s\n", strings.TrimSpace(usage.Explanation))
	}
}

func runDeleteTool(db *gorm.DB, identifier string) {
	var tool models.Tool

	query := db

	if id, err := strconv.ParseUint(identifier, 10, 64); err == nil {
		if err := query.First(&tool, id).Error; err != nil {
			handleToolNotFound(err)
		}
	} else {
		if err := query.
			Where("LOWER(name) = LOWER(?)", identifier).
			First(&tool).Error; err != nil {
			handleToolNotFound(err)
		}
	}

	fmt.Printf(
		`Delete tool "%s" and all usages? [y/N]: `,
		tool.Name,
	)

	var answer string
	fmt.Scanln(&answer)

	if strings.ToLower(answer) != "y" {
		fmt.Println("Dibatalkan.")
		return
	}

	if err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&tool).Error; err != nil {
			return err
		}

		if err := services.BumpCatalogVersion(tx); err != nil {
			return err
		}

		return nil
	}); err != nil {
		log.Fatalf("Gagal menghapus tool: %v", err)
	}

	fmt.Printf("Tool %q berhasil dihapus.\n", tool.Name)
}

func handleToolNotFound(err error) {
	if err == gorm.ErrRecordNotFound {
		log.Fatal("Tool tidak ditemukan.")
	}

	log.Fatalf("Database error: %v", err)
}

func runUpdateTool(db *gorm.DB, identifier string) {
	var tool models.Tool

	query := db.Preload("Usages")

	if id, err := strconv.ParseUint(identifier, 10, 64); err == nil {
		if err := query.First(&tool, id).Error; err != nil {
			handleToolNotFound(err)
		}
	} else {
		if err := query.
			Where("LOWER(name) = LOWER(?)", identifier).
			First(&tool).Error; err != nil {
			handleToolNotFound(err)
		}
	}

	fmt.Println("Update Tool")
	fmt.Println("-------------")

	fmt.Printf("Name [%s]: ", tool.Name)

	var name string
	fmt.Scanln(&name)

	if strings.TrimSpace(name) != "" {
		tool.Name = strings.TrimSpace(name)
	}

	fmt.Printf("Category [%s]: ", tool.Category)

	var category string
	fmt.Scanln(&category)

	if strings.TrimSpace(category) != "" {
		tool.Category = strings.TrimSpace(category)
	}

	fmt.Printf("Function [%s]: ", tool.Function)

	var function string
	fmt.Scanln(&function)

	if strings.TrimSpace(function) != "" {
		tool.Function = strings.TrimSpace(function)
	}

	fmt.Printf("Description [%s]: ", tool.Description)

	var description string
	fmt.Scanln(&description)

	if strings.TrimSpace(description) != "" {
		tool.Description = strings.TrimSpace(description)
	}

	if err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(&tool).Error; err != nil {
			return err
		}

		if err := services.BumpCatalogVersion(tx); err != nil {
			return err
		}

		return nil
	}); err != nil {
		log.Fatalf("Gagal update tool: %v", err)
	}

	fmt.Printf("\nTool %q berhasil diupdate.\n", tool.Name)
}
