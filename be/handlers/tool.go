package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"omnimind/models"
	"omnimind/services"
)

type ToolHandler struct {
	DB *gorm.DB
}

func NewToolHandler(db *gorm.DB) *ToolHandler {
	return &ToolHandler{
		DB: db,
	}
}

// GET /api/tools
func (h *ToolHandler) GetTools(c *gin.Context) {
	version, err := services.GetCatalogVersion(h.DB)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mengambil versi katalog",
		})
		return
	}

	// ETag tetap digunakan sebagai penanda versi katalog.
	etag := fmt.Sprintf(`"catalog-%d"`, version)

	c.Header("ETag", etag)
	c.Header(
		"Cache-Control",
		"private, max-age=0, must-revalidate",
	)

	var tools []models.Tool

	query := h.DB.
		Preload("Usages", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		Order("name ASC")

	// Optional filter berdasarkan category.
	category := c.Query("category")

	if category != "" {
		query = query.Where("category = ?", category)
	}

	if err := query.Find(&tools).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mengambil tools",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": tools,
	})
}

// GET /api/tools/:id
func (h *ToolHandler) GetTool(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "ID tool tidak valid",
		})
		return
	}

	var tool models.Tool

	err = h.DB.
		Preload("Usages", func(db *gorm.DB) *gorm.DB {
			return db.Order("sort_order ASC")
		}).
		First(&tool, id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "tool tidak ditemukan",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mengambil tool",
		})
		return
	}

	c.JSON(http.StatusOK, tool)
}

// GET /api/categories
func (h *ToolHandler) GetCategories(c *gin.Context) {
	version, err := services.GetCatalogVersion(h.DB)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mengambil versi katalog",
		})
		return
	}

	// ETag tetap digunakan sebagai penanda versi categories.
	etag := fmt.Sprintf(`"catalog-categories-%d"`, version)

	c.Header("ETag", etag)
	c.Header(
		"Cache-Control",
		"private, max-age=0, must-revalidate",
	)

	var categories []string

	err = h.DB.
		Model(&models.Tool{}).
		Distinct("category").
		Order("category ASC").
		Pluck("category", &categories).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "gagal mengambil categories",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": categories,
	})
}
