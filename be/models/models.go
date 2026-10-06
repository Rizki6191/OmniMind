package models

import "time"

type Tool struct {
	ID          uint        `json:"id" gorm:"primaryKey"`
	Name        string      `json:"name" gorm:"not null;index"`
	Category    string      `json:"category" gorm:"not null;index"`
	Function    string      `json:"function" gorm:"not null"`
	Description string      `json:"description" gorm:"not null"`

	Usages []ToolUsage `json:"usages" gorm:"foreignKey:ToolID;constraint:OnDelete:CASCADE"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ToolUsage struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	ToolID      uint   `json:"tool_id" gorm:"not null;index"`
	Name        string `json:"name" gorm:"not null"`
	Command     string `json:"command" gorm:"not null"`
	Explanation string `json:"explanation" gorm:"not null"`
	SortOrder   int    `json:"sort_order" gorm:"not null;default:0"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CatalogMeta struct {
	ID      uint `json:"id" gorm:"primaryKey"`
	Version uint `json:"version" gorm:"not null"`
}