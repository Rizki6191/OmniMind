package importer

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
	"gorm.io/gorm"

	"omnimind/models"
	"omnimind/services"
)

type YAMLTool struct {
	Name        string      `yaml:"name"`
	Category    string      `yaml:"category"`
	Function    string      `yaml:"function"`
	Description string      `yaml:"description"`
	Usages      []YAMLUsage `yaml:"usages"`
}

type YAMLUsage struct {
	Name        string `yaml:"name"`
	Command     string `yaml:"command"`
	Explanation string `yaml:"explanation"`
}

func ImportYAML(db *gorm.DB, path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("gagal membaca file YAML: %w", err)
	}

	var input YAMLTool

	if err := yaml.Unmarshal(data, &input); err != nil {
		return fmt.Errorf("gagal parse YAML: %w", err)
	}

	if input.Name == "" {
		return fmt.Errorf("field 'name' wajib diisi")
	}

	if input.Category == "" {
		return fmt.Errorf("field 'category' wajib diisi")
	}

	if input.Function == "" {
		return fmt.Errorf("field 'function' wajib diisi")
	}

	if input.Description == "" {
		return fmt.Errorf("field 'description' wajib diisi")
	}

	if err := db.Transaction(func(tx *gorm.DB) error {
		tool := models.Tool{
			Name:        input.Name,
			Category:    input.Category,
			Function:    input.Function,
			Description: input.Description,
		}

		if err := tx.Create(&tool).Error; err != nil {
			return fmt.Errorf("gagal menyimpan tool: %w", err)
		}

		for i, usage := range input.Usages {
			if usage.Name == "" {
				return fmt.Errorf(
					"usage #%d: field 'name' wajib diisi",
					i+1,
				)
			}

			if usage.Command == "" {
				return fmt.Errorf(
					"usage #%d: field 'command' wajib diisi",
					i+1,
				)
			}

			if usage.Explanation == "" {
				return fmt.Errorf(
					"usage #%d: field 'explanation' wajib diisi",
					i+1,
				)
			}

			toolUsage := models.ToolUsage{
				ToolID:      tool.ID,
				Name:        usage.Name,
				Command:     usage.Command,
				Explanation: usage.Explanation,
				SortOrder:   i + 1,
			}

			if err := tx.Create(&toolUsage).Error; err != nil {
				return fmt.Errorf(
					"gagal menyimpan usage #%d: %w",
					i+1,
					err,
				)
			}
		}

		// Catalog berubah.
		if err := services.BumpCatalogVersion(tx); err != nil {
			return fmt.Errorf(
				"gagal menaikkan versi katalog: %w",
				err,
			)
		}

		return nil
	}); err != nil {
		return err
	}

	return nil
}