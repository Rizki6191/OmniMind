package services

import (
	"gorm.io/gorm"

	"omnimind/models"
)

const catalogMetaID uint = 1

// EnsureCatalogMeta memastikan metadata katalog tersedia.
func EnsureCatalogMeta(db *gorm.DB) error {
	var meta models.CatalogMeta

	err := db.First(&meta, catalogMetaID).Error

	if err == nil {
		return nil
	}

	if err != gorm.ErrRecordNotFound {
		return err
	}

	meta = models.CatalogMeta{
		ID:      catalogMetaID,
		Version: 1,
	}

	return db.Create(&meta).Error
}

// BumpCatalogVersion menaikkan version katalog.
//
// Function ini harus dipanggil menggunakan transaction
// yang sama dengan perubahan Tool/ToolUsage.
func BumpCatalogVersion(tx *gorm.DB) error {
	return tx.
		Model(&models.CatalogMeta{}).
		Where("id = ?", catalogMetaID).
		UpdateColumn(
			"version",
			gorm.Expr("version + 1"),
		).Error
}

// GetCatalogVersion mengambil version katalog saat ini.
func GetCatalogVersion(db *gorm.DB) (uint, error) {
	var meta models.CatalogMeta

	if err := db.First(&meta, catalogMetaID).Error; err != nil {
		return 0, err
	}

	return meta.Version, nil
}