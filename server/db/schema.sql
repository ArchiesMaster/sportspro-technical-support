-- ==========================================================
-- Countries
-- ==========================================================

CREATE TABLE countries (
    countryCode CHAR(2) PRIMARY KEY,
    countryName VARCHAR(50) NOT NULL
);

-- ==========================================================
-- Products
-- ==========================================================

CREATE TABLE products (
    productCode VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    version DECIMAL(18,1) NOT NULL,
    releaseDate DATE NOT NULL
);

-- ==========================================================
-- Technicians
-- ==========================================================

CREATE TABLE technicians (
    techID SERIAL PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- ==========================================================
-- Customers
-- ==========================================================

CREATE TABLE customers (
    customerID SERIAL PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    address VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postalCode VARCHAR(20) NOT NULL,
    countryCode CHAR(2) NOT NULL REFERENCES countries(countryCode),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- ==========================================================
-- Users (used for authentication)
-- ==========================================================

CREATE TABLE users (
    userID SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer', 'technician')),
    customerID INTEGER,
    techID INTEGER,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerID) REFERENCES customers(customerID),
    FOREIGN KEY (techID) REFERENCES technicians(techID)
);


-- ==========================================================
-- Incidents
-- ==========================================================

CREATE TABLE incidents (
    incidentID SERIAL PRIMARY KEY,
    customerID INTEGER NOT NULL REFERENCES customers(customerID),
    productCode VARCHAR(10) NOT NULL REFERENCES products(productCode) ON DELETE CASCADE,
    techID INTEGER REFERENCES technicians(techID) ON DELETE CASCADE,
    dateOpened TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dateClosed TIMESTAMP,
    title VARCHAR(50) NOT NULL,
    description TEXT NOT NULL
);

-- ==========================================================
-- Registrations
-- ==========================================================

CREATE TABLE registrations (
    customerID INTEGER NOT NULL REFERENCES customers(customerID),
    productCode VARCHAR(10) NOT NULL REFERENCES products(productCode) ON DELETE CASCADE,
    registrationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customerID, productCode)
);

