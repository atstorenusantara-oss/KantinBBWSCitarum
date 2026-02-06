-- Create Database
CREATE DATABASE IF NOT EXISTS gcoffee_pos;
USE gcoffee_pos;

-- Products Table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Raw Materials Table
CREATE TABLE raw_materials (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL, -- gram, ml, pcs
    stock DECIMAL(10, 2) DEFAULT 0,
    min_stock DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Recipes Table
CREATE TABLE recipes (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Recipe Details Table
CREATE TABLE recipe_details (
    id VARCHAR(36) PRIMARY KEY,
    recipe_id VARCHAR(36),
    raw_material_id VARCHAR(36),
    qty DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Sales Table
CREATE TABLE sales (
    id VARCHAR(36) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Sales Items Table
CREATE TABLE sales_items (
    id VARCHAR(36) PRIMARY KEY,
    sales_id VARCHAR(36),
    product_id VARCHAR(36),
    qty INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sales_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- Stock Movements Table
CREATE TABLE stock_movements (
    id VARCHAR(36) PRIMARY KEY,
    raw_material_id VARCHAR(36),
    type ENUM('IN', 'OUT', 'ADJUST') NOT NULL,
    qty DECIMAL(10, 2) NOT NULL,
    reference_id VARCHAR(36), -- Could be sales_id or opname_id
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Stock Opnames Table
CREATE TABLE stock_opnames (
    id VARCHAR(36) PRIMARY KEY,
    raw_material_id VARCHAR(36),
    system_stock DECIMAL(10, 2) NOT NULL,
    physical_stock DECIMAL(10, 2) NOT NULL,
    difference DECIMAL(10, 2) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (raw_material_id) REFERENCES raw_materials(id) ON DELETE CASCADE
) ENGINE=InnoDB;
