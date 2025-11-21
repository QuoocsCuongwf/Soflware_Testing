-- ==============================================
-- FloginFE_BE Database Schema
-- Kiểm Thử Phần Mềm - 2024-2025
-- ==============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS flogin_db;
USE flogin_db;

-- ==============================================
-- Table: users (Bảng người dùng)
-- ==============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================================
-- Table: products (Bảng sản phẩm)
-- ==============================================
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    category VARCHAR(50),
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================================
-- Sample Data for Testing
-- ==============================================

-- Insert sample users (password: "password123" - hashed)
INSERT INTO users (username, password, email, full_name, role) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@flogin.com', 'Administrator', 'ADMIN'),
('user1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user1@flogin.com', 'Nguyễn Văn A', 'USER'),
('user2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user2@flogin.com', 'Trần Thị B', 'USER');

-- Insert sample products
INSERT INTO products (name, description, price, quantity, category, image_url, created_by) VALUES
('Laptop Dell XPS 13', 'Laptop cao cấp với màn hình 13 inch, CPU Intel Core i7', 25000000.00, 10, 'Electronics', 'https://example.com/laptop1.jpg', 1),
('iPhone 15 Pro', 'Điện thoại thông minh cao cấp của Apple', 30000000.00, 15, 'Electronics', 'https://example.com/iphone15.jpg', 1),
('Samsung Galaxy S24', 'Điện thoại Android flagship', 22000000.00, 20, 'Electronics', 'https://example.com/samsung.jpg', 1),
('Tai nghe Sony WH-1000XM5', 'Tai nghe chống ồn cao cấp', 8000000.00, 30, 'Audio', 'https://example.com/headphone.jpg', 2),
('Bàn phím Logitech MX Keys', 'Bàn phím cơ cao cấp cho lập trình viên', 2500000.00, 25, 'Accessories', 'https://example.com/keyboard.jpg', 2),
('Chuột Logitech MX Master 3', 'Chuột không dây cao cấp', 1800000.00, 35, 'Accessories', 'https://example.com/mouse.jpg', 2),
('Màn hình LG 27 inch 4K', 'Màn hình 4K UHD cho designers', 12000000.00, 8, 'Electronics', 'https://example.com/monitor.jpg', 1),
('MacBook Pro 16 inch', 'Laptop cao cấp của Apple với chip M3', 55000000.00, 5, 'Electronics', 'https://example.com/macbook.jpg', 1);

-- ==============================================
-- Additional Tables (Optional - for future features)
-- ==============================================

-- Table: refresh_tokens (Quản lý refresh tokens cho JWT)
CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: product_reviews (Đánh giá sản phẩm)
CREATE TABLE product_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==============================================
-- Useful Queries for Testing
-- ==============================================

-- Check all users
-- SELECT * FROM users;

-- Check all products
-- SELECT * FROM products;

-- Check products with user info
-- SELECT p.*, u.username as created_by_username 
-- FROM products p 
-- LEFT JOIN users u ON p.created_by = u.id;

-- Products by category
-- SELECT category, COUNT(*) as total, AVG(price) as avg_price 
-- FROM products 
-- GROUP BY category;
