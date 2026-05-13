/*
  KontaFlash Schema (SQLite version)
*/

CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    lastname TEXT,
    username TEXT UNIQUE,
    password TEXT,
    status INTEGER DEFAULT 1, /* 1: active, 0: inactive */
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS person (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind INTEGER DEFAULT 1, /* 1: cliente, 2: proveedor, 3: contacto */
    name TEXT,
    lastname TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS account (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS operation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT,
    amount REAL,
    type_id INTEGER, /* 1: income (ingreso), 2: expense (egreso) */
    status INTEGER DEFAULT 1, /* 1: aplicada, 0: pendiente */
    category_id INTEGER,
    person_id INTEGER,
    account_id INTEGER,
    user_id INTEGER,
    operation_at DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (person_id) REFERENCES person(id),
    FOREIGN KEY (account_id) REFERENCES account(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

/* Default admin user - Password: sha1(md5("admin")) */
/* Note: SQLite doesn't have sha1/md5 functions built-in by default, 
   we will handle hashing in JavaScript or insert the precomputed hash */
INSERT OR IGNORE INTO user (name, username, password, status, is_admin) 
VALUES ('Admin', 'admin', '90b9aa7e25f80cf4f64e999096bc414b2091231b', 1, 1);

/* Basic Categories */
INSERT OR IGNORE INTO category (name, color) VALUES 
('General', '#64748b'), 
('Alimentación', '#ef4444'), 
('Transporte', '#3b82f6'), 
('Servicios', '#f59e0b'), 
('Salud', '#10b981'), 
('Entretenimiento', '#8b5cf6');

/* Basic Accounts */
INSERT OR IGNORE INTO account (name, color) VALUES 
('Efectivo', '#10b981'), 
('Banco', '#3b82f6');
