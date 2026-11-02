-- ==========================================================
-- Countries
-- ==========================================================

INSERT INTO countries (countryCode, countryName)
VALUES
('AU', 'Australia'),
('US', 'United States'),
('CA', 'Canada'),
('MX', 'Mexico'),
('UK', 'United Kingdom'),
('FR', 'France'),
('DE', 'Germany'),
('IT', 'Italy'),
('ES', 'Spain'),
('CN', 'China');

-- ==========================================================
-- Products
-- ==========================================================

INSERT INTO products (productCode, name, version, releaseDate)
VALUES
('DRAFT10', 'Draft Manager', 1.0, '2019-01-01'),
('LEAG10', 'League Scheduler', 1.0, '2019-03-20'),
('ERROR20', 'Error Manager', 2.0, '2020-02-10'),
('SFX10', 'Sound Effects Composer', 1.0, '2022-12-05'),
('GAME20', 'Game Manager', 2.0, '2024-06-29');

-- ==========================================================
-- Technicians
-- ==========================================================

INSERT INTO technicians (firstName, lastName, email, phone, password)
VALUES
('David', 'Blackburn', 'david.blackburn@sportspro.com', '0412345678', '$2b$10$Z7HSMKhlnKNL47MHWLmzWeHV/0SMpMNFL7dBspzinh7s.dPgF4ZTG'),
('Lachlan', 'Baker', 'lachlan.baker@sportspro.com', '0412345679', '$2b$10$Z7HSMKhlnKNL47MHWLmzWeHV/0SMpMNFL7dBspzinh7s.dPgF4ZTG'),
('Patrick', 'Chalmers', 'patrick.chalmers@sportspro.com', '0412345680', '$2b$10$Z7HSMKhlnKNL47MHWLmzWeHV/0SMpMNFL7dBspzinh7s.dPgF4ZTG');

-- ==========================================================
-- Customers
-- ==========================================================

INSERT INTO customers
(firstName, lastName, address, city, state, postalCode, countryCode, phone, email, password)
VALUES
('Michael', 'Jackson', '23 James Street', 'Toowoomba', 'QLD', '4350', 'AU', '0400000000', 'michael.jackson@email.com', '$2b$10$ANaGkPj7Ib.dktKo13q37ON3P7C6BARXiMAHJV3xnkcIVxh7.s99O'),

('Archie', 'Bald', '11 Cay Street', 'Brisbane', 'QLD', '4000', 'AU', '0400000001', 'archie.bald@email.com', '$2b$10$ANaGkPj7Ib.dktKo13q37ON3P7C6BARXiMAHJV3xnkcIVxh7.s99O'),

('Michael', 'Clark', '80 Cat Street', 'Melbourne', 'VIC', '2000', 'AU', '0400000002', 'michael.clark@email.com', '$2b$10$ANaGkPj7Ib.dktKo13q37ON3P7C6BARXiMAHJV3xnkcIVxh7.s99O'),

('Olivia', 'Martin', '10 Vatican Road', 'Rome', 'Lazio', '00186', 'IT', '0400000003', 'olivia.martin@email.com', '$2b$10$ANaGkPj7Ib.dktKo13q37ON3P7C6BARXiMAHJV3xnkcIVxh7.s99O'),

('Emily', 'Henry', '250 First Street', 'Los Angeles', 'CA', '90001', 'US', '0400000004', 'emily.henry@email.com', '$2b$10$ANaGkPj7Ib.dktKo13q37ON3P7C6BARXiMAHJV3xnkcIVxh7.s99O');


-- ==========================================================
-- Registrations
-- ==========================================================

INSERT INTO registrations (customerID, productCode)
VALUES
(1, 'DRAFT10'),
(1, 'GAME20'),
(2, 'ERROR20'),
(3, 'DRAFT10'),
(3, 'SFX10'),
(4, 'GAME20'),
(5, 'LEAG10'),
(5, 'ERROR20');


-- ==========================================================
-- Incidents
-- ==========================================================

INSERT INTO incidents (customerID, productCode, techID, title, description, dateClosed)
VALUES
(1, 'DRAFT10', 1, 'Drafts not opening', 'Previously saved drafts fail to open.', NULL),
(2, 'GAME20', 2, 'Login issue', 'Customer cannot log into Game Manager.', NULL),
(3, 'ERROR20', 3, 'Unexpected application error', 'Error Manager is displaying unexpected errors.', NULL),
(4, 'SFX10', NULL, 'Installation problem', 'Sound Effects Composer installation fails on Windows 11.', NULL),
(5, 'LEAG10', NULL, 'Fixture generation failed', 'League Scheduler is not generating fixtures correctly.', NULL),
(1, 'GAME20', 1, 'Statistics export failure', 'Season statistics export was failing when exporting reports.', CURRENT_TIMESTAMP),
(2, 'ERROR20', 2, 'Licence activation problem', 'Licence activation issue resolved after resetting the activation key.', CURRENT_TIMESTAMP),
(3, 'SFX10', 3, 'Audio playback issue', 'Sound playback issue has been resolved.', CURRENT_TIMESTAMP);

-- ==========================================================
-- Users
-- ==========================================================

INSERT INTO users (
    email,
    password,
    role,
    customerID,
    techID
)
VALUES
(
    'admin@sportspro.com',
    '$2b$10$nqtS7O6fFAHWk5ZS6flXL.jFay76.HCeIhbl0c1eMsFdPbFZ7M43S',
    'admin',
    NULL,
    NULL
),
(
    'michael.jackson@email.com',
    '$2b$10$ANaGkPj7Ib.dktKo13q37ON3P7C6BARXiMAHJV3xnkcIVxh7.s99O',
    'customer',
    1,
    NULL
),
(
    'archie.bald@email.com',
    '$2b$10$ANaGkPj7Ib.dktKo13q37ON3P7C6BARXiMAHJV3xnkcIVxh7.s99O',
    'customer',
    2,
    NULL
),
(
    'michael.clark@email.com',
    '$2b$10$ANaGkPj7Ib.dktKo13q37ON3P7C6BARXiMAHJV3xnkcIVxh7.s99O',
    'customer',
    3,
    NULL
),
(
    'olivia.martin@email.com',
    '$2b$10$ANaGkPj7Ib.dktKo13q37ON3P7C6BARXiMAHJV3xnkcIVxh7.s99O',
    'customer',
    4,
    NULL
),
(
    'emily.henry@email.com',
    '$2b$10$ANaGkPj7Ib.dktKo13q37ON3P7C6BARXiMAHJV3xnkcIVxh7.s99O',
    'customer',
    5,
    NULL
),
(
    'david.blackburn@sportspro.com',
    '$2b$10$Z7HSMKhlnKNL47MHWLmzWeHV/0SMpMNFL7dBspzinh7s.dPgF4ZTG',
    'technician',
    NULL,
    1
),
(
    'lachlan.baker@sportspro.com',
    '$2b$10$Z7HSMKhlnKNL47MHWLmzWeHV/0SMpMNFL7dBspzinh7s.dPgF4ZTG',
    'technician',
    NULL,
    2
),
(
    'patrick.chalmers@sportspro.com',
    '$2b$10$Z7HSMKhlnKNL47MHWLmzWeHV/0SMpMNFL7dBspzinh7s.dPgF4ZTG',
    'technician',
    NULL,
    3
);

-- NOTE:
-- Passwords have been hashed using bcrypt using the script `hash-password.js` located in the 'scripts' directory.
-- Original passwords:
-- Admin: admin123
-- Customers: customer123
-- Technicians: technician123