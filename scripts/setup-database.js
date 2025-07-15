/**
 * Database Setup Script for Agriculture Domain (PostgreSQL)
 * Creates tables for farmers, products, services, and orders
 */

const { Pool } = require('pg');
require('dotenv').config();

function createPool() {
  return new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'beckn_agriculture',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

async function createTables(pool) {
  const client = await pool.connect();
  try {
    const queries = [
      // Farmers/Providers table
      `CREATE TABLE IF NOT EXISTS farmers (
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
      )`,

      // Products table (crops, seeds, tools, etc.)
      `CREATE TABLE IF NOT EXISTS products (
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
      )`,

      // Services table (farming services, consultation, equipment rental)
      `CREATE TABLE IF NOT EXISTS services (
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
      )`,

      // Orders table
      `CREATE TABLE IF NOT EXISTS orders (
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
      )`,

      // Categories table for better organization
      `CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL, -- 'product' or 'service'
        parent_id VARCHAR(50),
        description TEXT,
        icon VARCHAR(255),
        sort_order INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        FOREIGN KEY (parent_id) REFERENCES categories (id)
      )`
    ];

    // Create indexes for better performance
    const indexes = [
      `CREATE INDEX IF NOT EXISTS idx_farmers_city ON farmers (city)`,
      `CREATE INDEX IF NOT EXISTS idx_farmers_state ON farmers (state)`,
      `CREATE INDEX IF NOT EXISTS idx_farmers_rating ON farmers (rating DESC)`,
      `CREATE INDEX IF NOT EXISTS idx_products_farmer_id ON products (farmer_id)`,
      `CREATE INDEX IF NOT EXISTS idx_products_category ON products (category)`,
      `CREATE INDEX IF NOT EXISTS idx_products_status ON products (status)`,
      `CREATE INDEX IF NOT EXISTS idx_products_name ON products (name)`,
      `CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services (provider_id)`,
      `CREATE INDEX IF NOT EXISTS idx_services_category ON services (category)`,
      `CREATE INDEX IF NOT EXISTS idx_services_status ON services (status)`,
      `CREATE INDEX IF NOT EXISTS idx_orders_farmer_id ON orders (farmer_id)`,
      `CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders (payment_status)`,
      `CREATE INDEX IF NOT EXISTS idx_categories_type ON categories (type)`
    ];

    console.log('Creating tables...');
    for (const query of queries) {
      await client.query(query);
    }
    console.log('All tables created successfully');

    console.log('Creating indexes...');
    for (const index of indexes) {
      await client.query(index);
    }
    console.log('All indexes created successfully');

  } finally {
    client.release();
  }
}

async function setupDatabase() {
  const pool = createPool();
  
  try {
    // Test connection
    console.log('Testing PostgreSQL connection...');
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('PostgreSQL connection successful');

    await createTables(pool);
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 