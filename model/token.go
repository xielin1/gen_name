package model

// UserToken 代表用户Token余额表
type UserToken struct {
	UserID    int64 `gorm:"primaryKey"`
	Balance   int64 `gorm:"default:0"`
	Version   int64 `gorm:"default:1"` // 乐观锁版本号
	CreatedAt int64
	UpdatedAt int64
}

func (UserToken) TableName() string {
	return "user_tokens"
}

// TokenTransaction 代表Token交易流水表
type TokenTransaction struct {
	ID                int64  `gorm:"primaryKey;autoIncrement"`
	TransactionUUID   string `gorm:"type:varchar(36);uniqueIndex;not null"` // 用于幂等性检查
	UserID            int64  `gorm:"index;not null"`
	Amount            int64  // 正数为增加，负数为减少
	BalanceBefore     int64
	BalanceAfter      int64
	Type              string `gorm:"type:varchar(50);not null"` // "ai_generation_debit", "referral_credit"
	RelatedEntityType string `gorm:"type:varchar(50)"`          // "project", "order"
	RelatedEntityID   string `gorm:"type:varchar(100)"`         // 关联实体的ID
	Description       string `gorm:"type:text"`
	Status            string `gorm:"type:varchar(20);default:'completed'"` // "completed", "pending", "failed"
	CreatedAt         int64
}

func (TokenTransaction) TableName() string {
	return "token_transactions"
}
