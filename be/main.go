package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"omnimind/config"
	"omnimind/database"
	"omnimind/routes"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("File .env tidak ditemukan, menggunakan environment variables")
	}

	cfg := config.Load()

	// Jika ada argument, jalankan CLI.
	if len(os.Args) > 1 {
		runCommand(cfg, os.Args[1:])
		return
	}

	// Tanpa argument = API server.
	runServer(cfg)
}

func runCommand(cfg *config.Config, args []string) {
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal(err)
	}

	runCLI(db, args)
}

func runServer(cfg *config.Config) {
	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatal(err)
	}

	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	routes.Setup(router, db)

	addr := fmt.Sprintf(":%s", cfg.AppPort)

	log.Printf(
		"Tool Catalog API berjalan di http://localhost%s",
		addr,
	)

	if err := router.Run(addr); err != nil {
		log.Fatal(err)
	}
}