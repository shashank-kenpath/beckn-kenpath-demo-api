/**
 * Data Seeding Script for Agriculture Domain (PostgreSQL)
 * Populates database with sample farmers, products, and services
 */

const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const sampleData = {
  categories: [
    // Product categories
    { id: 'CROPS', name: 'Crops & Produce', type: 'product', parent_id: null, description: 'Fresh agricultural produce' },
    { id: 'GRAINS', name: 'Grains & Cereals', type: 'product', parent_id: 'CROPS', description: 'Rice, wheat, barley, etc.' },
    { id: 'VEGETABLES', name: 'Vegetables', type: 'product', parent_id: 'CROPS', description: 'Fresh vegetables' },
    { id: 'FRUITS', name: 'Fruits', type: 'product', parent_id: 'CROPS', description: 'Fresh fruits' },
    { id: 'SEEDS', name: 'Seeds & Seedlings', type: 'product', parent_id: null, description: 'Seeds for planting' },
    { id: 'TOOLS', name: 'Farm Tools', type: 'product', parent_id: null, description: 'Agricultural tools and equipment' },
    
    // Service categories
    { id: 'CONSULTATION', name: 'Consultation Services', type: 'service', parent_id: null, description: 'Expert agricultural advice' },
    { id: 'EQUIPMENT_RENTAL', name: 'Equipment Rental', type: 'service', parent_id: null, description: 'Rent farming equipment' },
    { id: 'FIELD_SERVICES', name: 'Field Services', type: 'service', parent_id: null, description: 'On-field agricultural services' },
    { id: 'PROCESSING', name: 'Processing Services', type: 'service', parent_id: null, description: 'Crop processing and packaging' }
  ],

  farmers: [
    {
      id: 'FARMER_001',
      name: 'Ramesh Kumar',
      phone: '+91-9876543210',
      email: 'ramesh.kumar@agri.com',
      address: 'Village Gandhipuram, Dist. Bharuch',
      location_lat: 21.7051,
      location_lng: 72.9958,
      city: 'Bharuch',
      state: 'Gujarat',
      postal_code: '392001',
      farm_size_acres: 25.5,
      specialization: 'Organic Vegetables',
      certification: 'Organic India Certified',
      established_year: 2010,
      description: 'Experienced organic farmer specializing in vegetables and traditional crops',
      rating: 4.7,
      total_ratings: 156
    },
    {
      id: 'FARMER_002',
      name: 'Sunita Devi',
      phone: '+91-9876543211',
      email: 'sunita.devi@agri.com',
      address: 'Village Keshavpura, Dist. Jaipur',
      location_lat: 26.9124,
      location_lng: 75.7873,
      city: 'Jaipur',
      state: 'Rajasthan',
      postal_code: '302012',
      farm_size_acres: 15.0,
      specialization: 'Grains and Pulses',
      certification: 'GAP Certified',
      established_year: 2015,
      description: 'Sustainable farming practitioner with focus on water conservation',
      rating: 4.5,
      total_ratings: 89
    },
    {
      id: 'FARMER_003',
      name: 'Manjunath Reddy',
      phone: '+91-9876543212',
      email: 'manjunath.reddy@agri.com',
      address: 'Village Doddaballapur, Dist. Bangalore Rural',
      location_lat: 13.2257,
      location_lng: 77.5545,
      city: 'Bangalore Rural',
      state: 'Karnataka',
      postal_code: '561203',
      farm_size_acres: 40.0,
      specialization: 'Fruit Orchards',
      certification: 'APEDA Certified',
      established_year: 2008,
      description: 'Multi-fruit orchard owner with modern irrigation systems',
      rating: 4.8,
      total_ratings: 203
    }
  ],

  products: [
    {
      id: 'PROD_001',
      farmer_id: 'FARMER_001',
      name: 'Organic Tomatoes',
      category: 'VEGETABLES',
      subcategory: 'Nightshades',
      description: 'Fresh organic tomatoes, pesticide-free, grown using traditional methods',
      price: 45.00,
      unit: 'kg',
      quantity_available: 500,
      harvest_date: '2024-02-15',
      expiry_date: '2024-02-25',
      organic: true,
      images: 'https://example.com/images/tomatoes.jpg',
      specifications: { "variety": "Hybrid", "color": "Red", "size": "Medium" }
    },
    {
      id: 'PROD_002',
      farmer_id: 'FARMER_002',
      name: 'Basmati Rice',
      category: 'GRAINS',
      subcategory: 'Rice',
      description: 'Premium quality Basmati rice, aged for 2 years',
      price: 120.00,
      unit: 'kg',
      quantity_available: 1000,
      harvest_date: '2024-01-10',
      expiry_date: '2025-01-10',
      organic: false,
      images: 'https://example.com/images/basmati.jpg',
      specifications: { "variety": "Pusa Basmati 1121", "aging": "2 years", "purity": "99%" }
    },
    {
      id: 'PROD_003',
      farmer_id: 'FARMER_003',
      name: 'Fresh Mangoes',
      category: 'FRUITS',
      subcategory: 'Tropical',
      description: 'Sweet Alphonso mangoes, naturally ripened',
      price: 200.00,
      unit: 'kg',
      quantity_available: 300,
      harvest_date: '2024-02-20',
      expiry_date: '2024-03-05',
      organic: true,
      images: 'https://example.com/images/mangoes.jpg',
      specifications: { "variety": "Alphonso", "ripeness": "Tree-ripened", "sweetness": "High" }
    },
    {
      id: 'PROD_004',
      farmer_id: 'FARMER_001',
      name: 'Tomato Seeds',
      category: 'SEEDS',
      subcategory: 'Vegetable Seeds',
      description: 'Hybrid tomato seeds with high yield potential',
      price: 250.00,
      unit: '100g packet',
      quantity_available: 50,
      harvest_date: null,
      expiry_date: '2025-02-20',
      organic: false,
      images: 'https://example.com/images/tomato-seeds.jpg',
      specifications: { "germination_rate": "95%", "variety": "Hybrid", "yield_per_plant": "4-5kg" }
    }
  ],

  services: [
    {
      id: 'SERV_001',
      provider_id: 'FARMER_001',
      name: 'Organic Farming Consultation',
      category: 'CONSULTATION',
      subcategory: 'Crop Advisory',
      description: 'Expert advice on organic farming practices, pest management, and soil health',
      price: 500.00,
      unit: 'per hour',
      duration_hours: 2,
      coverage_area: '50km radius from Bharuch',
      equipment_included: 'Soil testing kit, pH meter',
      requirements: 'Farm visit access, historical crop data',
      availability_schedule: '{"days": ["Mon", "Wed", "Fri"], "hours": "09:00-17:00"}',
      rating: 4.6,
      total_ratings: 34
    },
    {
      id: 'SERV_002',
      provider_id: 'FARMER_002',
      name: 'Tractor with Plowing Equipment',
      category: 'EQUIPMENT_RENTAL',
      subcategory: 'Tractors',
      description: 'Modern tractor with plowing and tilling equipment for field preparation',
      price: 800.00,
      unit: 'per day',
      duration_hours: 8,
      coverage_area: 'Jaipur district',
      equipment_included: 'Tractor, Plow, Tiller, Operator',
      requirements: 'Fuel to be provided by customer',
      availability_schedule: '{"advance_booking": "2 days", "seasons": ["Kharif", "Rabi"]}',
      rating: 4.4,
      total_ratings: 67
    },
    {
      id: 'SERV_003',
      provider_id: 'FARMER_003',
      name: 'Fruit Processing & Packaging',
      category: 'PROCESSING',
      subcategory: 'Post-Harvest',
      description: 'Professional fruit cleaning, sorting, and packaging services',
      price: 15.00,
      unit: 'per kg processed',
      duration_hours: 4,
      coverage_area: 'Bangalore Rural district',
      equipment_included: 'Washing equipment, Sorting tables, Packaging materials',
      requirements: 'Minimum 100kg batch, advance booking required',
      availability_schedule: '{"capacity": "500kg per day", "booking_lead": "1 day"}',
      rating: 4.7,
      total_ratings: 89
    }
  ]
};

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

async function seedDatabase() {
  const pool = createPool();
  const client = await pool.connect();

  try {
    // Start transaction
    await client.query('BEGIN');

    // Clear existing data in correct order (respecting foreign keys)
    console.log('Clearing existing data...');
    await client.query('DELETE FROM orders');
    await client.query('DELETE FROM products');
    await client.query('DELETE FROM services');
    await client.query('DELETE FROM farmers');
    await client.query('DELETE FROM categories');

    // Insert categories
    console.log('Inserting categories...');
    for (let i = 0; i < sampleData.categories.length; i++) {
      const category = sampleData.categories[i];
      await client.query(`
        INSERT INTO categories (id, name, type, parent_id, description, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        category.id,
        category.name,
        category.type,
        category.parent_id,
        category.description,
        i
      ]);
    }

    // Insert farmers
    console.log('Inserting farmers...');
    for (const farmer of sampleData.farmers) {
      await client.query(`
        INSERT INTO farmers (
          id, name, phone, email, address, location_lat, location_lng,
          city, state, postal_code, farm_size_acres, specialization,
          certification, established_year, description, rating, total_ratings
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `, [
        farmer.id, farmer.name, farmer.phone, farmer.email,
        farmer.address, farmer.location_lat, farmer.location_lng,
        farmer.city, farmer.state, farmer.postal_code,
        farmer.farm_size_acres, farmer.specialization,
        farmer.certification, farmer.established_year,
        farmer.description, farmer.rating, farmer.total_ratings
      ]);
    }

    // Insert products
    console.log('Inserting products...');
    for (const product of sampleData.products) {
      await client.query(`
        INSERT INTO products (
          id, farmer_id, name, category, subcategory, description,
          price, unit, quantity_available, harvest_date, expiry_date,
          organic, images, specifications
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        product.id, product.farmer_id, product.name,
        product.category, product.subcategory, product.description,
        product.price, product.unit, product.quantity_available,
        product.harvest_date, product.expiry_date, product.organic,
        product.images, JSON.stringify(product.specifications)
      ]);
    }

    // Insert services
    console.log('Inserting services...');
    for (const service of sampleData.services) {
      await client.query(`
        INSERT INTO services (
          id, provider_id, name, category, subcategory, description,
          price, unit, duration_hours, coverage_area, equipment_included,
          requirements, availability_schedule, rating, total_ratings
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        service.id, service.provider_id, service.name,
        service.category, service.subcategory, service.description,
        service.price, service.unit, service.duration_hours,
        service.coverage_area, service.equipment_included,
        service.requirements, service.availability_schedule,
        service.rating, service.total_ratings
      ]);
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('Sample data seeded successfully');

  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase }; 