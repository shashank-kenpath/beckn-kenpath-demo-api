-- PostgreSQL initialization script for Beckn Agriculture API
-- This script will run automatically when the PostgreSQL container starts for the first time

-- Create the database if it doesn't exist (though it should be created by POSTGRES_DB)
-- SELECT 'CREATE DATABASE beckn_agriculture' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'beckn_agriculture')\gexec

-- Connect to the beckn_agriculture database
\c beckn_agriculture;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables (same as setup-database.js but in SQL format)

-- Farmers/Providers table
CREATE TABLE IF NOT EXISTS farmers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    farm_size_acres DECIMAL(10, 2),
    specialization TEXT,
    certification VARCHAR(255),
    established_year INTEGER,
    description TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    -- New farmer fields
    aadhaar VARCHAR(20),
    dob VARCHAR(20),
    gender VARCHAR(10),
    farmer_category TEXT,
    caste_category VARCHAR(20),
    total_land_area VARCHAR(20),
    location_info JSONB,
    farm_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table (crops, seeds, tools, etc.)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    farmer_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    unit VARCHAR(50) NOT NULL,
    quantity_available INTEGER,
    harvest_date DATE,
    expiry_date DATE,
    organic BOOLEAN DEFAULT FALSE,
    images TEXT,
    specifications JSONB,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers (id)
);

-- Services table (farming services, consultation, equipment rental)
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    provider_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    unit VARCHAR(50) NOT NULL,
    duration_hours INTEGER,
    coverage_area TEXT,
    equipment_included TEXT,
    requirements TEXT,
    availability_schedule TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES farmers (id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    transaction_id VARCHAR(100),
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    customer_address TEXT,
    farmer_id VARCHAR(50),
    items JSONB, -- JSON data for items
    total_amount DECIMAL(12, 2),
    currency VARCHAR(10) DEFAULT 'INR',
    payment_status VARCHAR(20) DEFAULT 'pending',
    fulfillment_status VARCHAR(20) DEFAULT 'pending',
    delivery_type VARCHAR(50),
    delivery_address TEXT,
    delivery_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers (id)
);

-- Categories table for better organization
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'product' or 'service'
    parent_id VARCHAR(50),
    description TEXT,
    icon VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    FOREIGN KEY (parent_id) REFERENCES categories (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_farmers_city ON farmers (city);
CREATE INDEX IF NOT EXISTS idx_farmers_state ON farmers (state);
CREATE INDEX IF NOT EXISTS idx_farmers_rating ON farmers (rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_farmer_id ON products (farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status);
CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services (provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services (category);
CREATE INDEX IF NOT EXISTS idx_services_status ON services (status);
CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders (farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories (type);

-- Insert sample categories
INSERT INTO categories (id, name, type, parent_id, description, sort_order) VALUES
-- Product categories
('CROPS', 'Crops & Produce', 'product', null, 'Fresh agricultural produce', 0),
('GRAINS', 'Grains & Cereals', 'product', 'CROPS', 'Rice, wheat, barley, etc.', 1),
('VEGETABLES', 'Vegetables', 'product', 'CROPS', 'Fresh vegetables', 2),
('FRUITS', 'Fruits', 'product', 'CROPS', 'Fresh fruits', 3),
('SEEDS', 'Seeds & Seedlings', 'product', null, 'Seeds for planting', 4),
('TOOLS', 'Farm Tools', 'product', null, 'Agricultural tools and equipment', 5),

-- Service categories
('CONSULTATION', 'Consultation Services', 'service', null, 'Expert agricultural advice', 6),
('EQUIPMENT_RENTAL', 'Equipment Rental', 'service', null, 'Rent farming equipment', 7),
('FIELD_SERVICES', 'Field Services', 'service', null, 'On-field agricultural services', 8),
('PROCESSING', 'Processing Services', 'service', null, 'Crop processing and packaging', 9)
ON CONFLICT (id) DO NOTHING;

-- Insert sample farmers
INSERT INTO farmers (
    id, name, phone, email, address, location_lat, location_lng,
    city, state, postal_code, farm_size_acres, specialization,
    certification, established_year, description, rating, total_ratings,
    aadhaar, dob, gender, farmer_category, caste_category, total_land_area,
    location_info, farm_details
) VALUES
('FARMER001', 'Birabal Kumar', '+91-9876543210', 'birabal.kumar@agri.com', 'mu po titamba', 21.1466, 79.0889, 'City', 'State', '000000', 10.00, 'Mixed Farming', 'Standard Certified', 2015, 'Farmer specializing in Big Farmer(Farmer having land >=2 Hectare)', 4.5, 50, 'XXXXXXXX5569', '01-01-1986', 'Male', 'Big Farmer(Farmer having land >=2 Hectare)', 'ST', '10.00', '{"latitude": "21.1466", "longitude": "79.0889", "address": "mu po titamba", "village_lgd_code": "531465", "district_lgd_code": "468", "sub_district_lgd_code": "4001", "state_lgd_code": "27"}', '[{"farm_id": "FARM001398", "location_info": {"latitude": "21.1466", "longitude": "79.0889", "address": "mu po titamba", "village_lgd_code": "531465", "district_lgd_code": "468", "sub_district_lgd_code": "4001", "state_lgd_code": "27"}, "joint_owners": [{"owner_number": "309", "main_owner_number": "246", "owner_name_ror": "पार्वती राजकुमार कास्देकर", "owner_identifier_name": "राजकुमार कास्देकर", "owner_identifier_relationship": null}], "survey_number": "106", "plot_area": "0.63", "area_unit": "Hectare"}, {"farm_id": "FARM001399", "location_info": {"latitude": "21.1466", "longitude": "79.0889", "address": "mu po titamba", "village_lgd_code": "531465", "district_lgd_code": "468", "sub_district_lgd_code": "4001", "state_lgd_code": "27"}, "joint_owners": [{"owner_number": "391", "main_owner_number": "246", "owner_name_ror": "बिरबल काशीराम", "owner_identifier_name": "काशीराम", "owner_identifier_relationship": null}], "survey_number": "107", "plot_area": "0.75", "area_unit": "Hectare"}]'),
('FARMER002', 'Sunita Devi', '+91-9876543210', 'sunita.devi@agri.com', 'Village Keshavpura', 26.9124, 75.7873, 'City', 'State', '000000', 1.50, 'Mixed Farming', 'Standard Certified', 2015, 'Farmer specializing in Medium Farmer(Farmer having land 1-2 Hectare)', 4.5, 50, 'XXXXXXXX7891', '15-03-1978', 'Female', 'Medium Farmer(Farmer having land 1-2 Hectare)', 'OBC', '1.50', '{"latitude": "26.9124", "longitude": "75.7873", "address": "Village Keshavpura", "village_lgd_code": "531466", "district_lgd_code": "469", "sub_district_lgd_code": "4002", "state_lgd_code": "08"}', '[{"farm_id": "FARM002001", "location_info": {"latitude": "26.9124", "longitude": "75.7873", "address": "Village Keshavpura", "village_lgd_code": "531466", "district_lgd_code": "469", "sub_district_lgd_code": "4002", "state_lgd_code": "08"}, "joint_owners": [{"owner_number": "201", "main_owner_number": "200", "owner_name_ror": "सुनीता देवी", "owner_identifier_name": "राम लाल", "owner_identifier_relationship": "पति"}], "survey_number": "45", "plot_area": "1.50", "area_unit": "Hectare"}]'),
('FARMER003', 'Manjunath Reddy', '+91-9876543210', 'manjunath.reddy@agri.com', 'Village Doddaballapur', 13.2257, 77.5545, 'City', 'State', '000000', 5.25, 'Mixed Farming', 'Standard Certified', 2015, 'Farmer specializing in Big Farmer(Farmer having land >=2 Hectare)', 4.5, 50, 'XXXXXXXX2345', '22-07-1975', 'Male', 'Big Farmer(Farmer having land >=2 Hectare)', 'General', '5.25', '{"latitude": "13.2257", "longitude": "77.5545", "address": "Village Doddaballapur", "village_lgd_code": "531467", "district_lgd_code": "470", "sub_district_lgd_code": "4003", "state_lgd_code": "29"}', '[{"farm_id": "FARM003001", "location_info": {"latitude": "13.2257", "longitude": "77.5545", "address": "Village Doddaballapur", "village_lgd_code": "531467", "district_lgd_code": "470", "sub_district_lgd_code": "4003", "state_lgd_code": "29"}, "joint_owners": [{"owner_number": "501", "main_owner_number": "500", "owner_name_ror": "मंजुनाथ रेड्डी", "owner_identifier_name": "वेंकट रेड्डी", "owner_identifier_relationship": "पिता"}], "survey_number": "78", "plot_area": "2.50", "area_unit": "Hectare"}, {"farm_id": "FARM003002", "location_info": {"latitude": "13.2257", "longitude": "77.5545", "address": "Village Doddaballapur", "village_lgd_code": "531467", "district_lgd_code": "470", "sub_district_lgd_code": "4003", "state_lgd_code": "29"}, "joint_owners": [{"owner_number": "502", "main_owner_number": "500", "owner_name_ror": "लक्ष्मी रेड्डी", "owner_identifier_name": "मंजुनाथ रेड्डी", "owner_identifier_relationship": "पत्नी"}], "survey_number": "79", "plot_area": "2.75", "area_unit": "Hectare"}]')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (
    id, farmer_id, name, category, subcategory, description,
    price, unit, quantity_available, harvest_date, expiry_date,
    organic, images, specifications
) VALUES
('PROD_001', 'FARMER001', 'Organic Tomatoes', 'VEGETABLES', 'Nightshades', 'Fresh organic tomatoes, pesticide-free, grown using traditional methods', 45.00, 'kg', 500, '2024-02-15', '2024-02-25', true, 'https://example.com/images/tomatoes.jpg', '{"variety": "Hybrid", "color": "Red", "size": "Medium"}'),
('PROD_002', 'FARMER002', 'Basmati Rice', 'GRAINS', 'Rice', 'Premium quality Basmati rice, aged for 2 years', 120.00, 'kg', 1000, '2024-01-10', '2025-01-10', false, 'https://example.com/images/basmati.jpg', '{"variety": "Pusa Basmati 1121", "aging": "2 years", "purity": "99%"}'),
('PROD_003', 'FARMER003', 'Fresh Mangoes', 'FRUITS', 'Tropical', 'Sweet Alphonso mangoes, naturally ripened', 200.00, 'kg', 300, '2024-02-20', '2024-03-05', true, 'https://example.com/images/mangoes.jpg', '{"variety": "Alphonso", "ripeness": "Tree-ripened", "sweetness": "High"}'),
('PROD_004', 'FARMER001', 'Tomato Seeds', 'SEEDS', 'Vegetable Seeds', 'Hybrid tomato seeds with high yield potential', 250.00, '100g packet', 50, null, '2025-02-20', false, 'https://example.com/images/tomato-seeds.jpg', '{"germination_rate": "95%", "variety": "Hybrid", "yield_per_plant": "4-5kg"}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample services
INSERT INTO services (
    id, provider_id, name, category, subcategory, description,
    price, unit, duration_hours, coverage_area, equipment_included,
    requirements, availability_schedule, rating, total_ratings
) VALUES
('SERV_001', 'FARMER001', 'Organic Farming Consultation', 'CONSULTATION', 'Crop Advisory', 'Expert advice on organic farming practices, pest management, and soil health', 500.00, 'per hour', 2, '50km radius from Titamba', 'Soil testing kit, pH meter', 'Farm visit access, historical crop data', '{"days": ["Mon", "Wed", "Fri"], "hours": "09:00-17:00"}', 4.6, 34),
('SERV_002', 'FARMER002', 'Tractor with Plowing Equipment', 'EQUIPMENT_RENTAL', 'Tractors', 'Modern tractor with plowing and tilling equipment for field preparation', 800.00, 'per day', 8, 'Keshavpura district', 'Tractor, Plow, Tiller, Operator', 'Fuel to be provided by customer', '{"advance_booking": "2 days", "seasons": ["Kharif", "Rabi"]}', 4.4, 67),
('SERV_003', 'FARMER003', 'Fruit Processing & Packaging', 'PROCESSING', 'Post-Harvest', 'Professional fruit cleaning, sorting, and packaging services', 15.00, 'per kg processed', 4, 'Doddaballapur district', 'Washing equipment, Sorting tables, Packaging materials', 'Minimum 100kg batch, advance booking required', '{"capacity": "500kg per day", "booking_lead": "1 day"}', 4.7, 89)
ON CONFLICT (id) DO NOTHING;

-- Print completion message
\echo 'Database initialization completed successfully!'