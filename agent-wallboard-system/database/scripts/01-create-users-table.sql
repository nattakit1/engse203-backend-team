-- ========================================
-- Task#1: User Management - Users Table
-- Version: 1.1 (Updated with FK pragma)
-- ========================================

-- 🆕 IMPORTANT: เปิดใช้งาน Foreign Key constraints
PRAGMA foreign_keys = ON;

-- ลบตารางเดิมถ้ามี (สำหรับ development)
DROP TABLE IF EXISTS Users;

-- สร้างตาราง Users
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    fullName TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Agent', 'Supervisor', 'Admin')),
    teamId INTEGER,
    status TEXT NOT NULL DEFAULT 'Active' CHECK(status IN ('Active', 'Inactive')),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastLoginAt DATETIME,
    deletedAt DATETIME,
    FOREIGN KEY (teamId) REFERENCES Teams(team_id)
);

-- สร้าง indexes เพื่อ performance
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_users_status ON Users(status);
CREATE INDEX idx_users_teamId ON Users(teamId);
CREATE INDEX idx_users_deletedAt ON Users(deletedAt);

-- สร้าง trigger สำหรับ updatedAt
CREATE TRIGGER update_users_timestamp 
AFTER UPDATE ON Users
FOR EACH ROW
BEGIN
    UPDATE Users SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;