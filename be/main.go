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

	// CORS Middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, OPTIONS",
		)
		c.Writer.Header().Set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization",
		)

		// Handle preflight request.
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	routes.Setup(router, db)

	// Vercel menyediakan PORT.
	// Local development menggunakan APP_PORT.
	port := os.Getenv("PORT")
	if port == "" {
		port = cfg.AppPort
	}

	addr := fmt.Sprintf(":%s", port)

	log.Printf(
		"Tool Catalog API berjalan di port %s",
		port,
	)

	if err := router.Run(addr); err != nil {
		log.Fatal(err)
	}
}