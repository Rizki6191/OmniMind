package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"omnimind/handlers"
)

func Setup(router *gin.Engine, db *gorm.DB) {
	toolHandler := handlers.NewToolHandler(db)

	api := router.Group("/api")
	{
		api.GET("/tools", toolHandler.GetTools)
		api.GET("/tools/:id", toolHandler.GetTool)
		api.GET("/categories", toolHandler.GetCategories)
	}
}