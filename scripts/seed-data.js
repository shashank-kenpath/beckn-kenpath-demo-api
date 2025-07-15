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
      farmer_id: "FARMER001",
      farmer_name: "Birabal Kumar",
      aadhaar: "XXXXXXXX5569",
      dob: "01-01-1986",
      gender: "Male",
      farmer_category: "Big Farmer(Farmer having land >=2 Hectare)",
      caste_category: "ST",
      total_land_area: "10.00",
      location_info: {
        latitude: "21.1466",
        longitude: "79.0889",
        address: "mu po titamba",
        village_lgd_code: "531465",
        district_lgd_code: "468",
        sub_district_lgd_code: "4001",
        state_lgd_code: "27"
      },
      farm_details: [
        {
          farm_id: "FARM001398",
          location_info: {
            latitude: "21.1466",
            longitude: "79.0889",
            address: "mu po titamba",
            village_lgd_code: "531465",
            district_lgd_code: "468",
            sub_district_lgd_code: "4001",
            state_lgd_code: "27"
          },
          joint_owners: [
            {
              owner_number: "309",
              main_owner_number: "246",
              owner_name_ror: "पार्वती राजकुमार कास्देकर",
              owner_identifier_name: "राजकुमार कास्देकर",
              owner_identifier_relationship: null
            }
          ],
          survey_number: "106",
          plot_area: "0.63",
          area_unit: "Hectare"
        },
        {
          farm_id: "FARM001399",
          location_info: {
            latitude: "21.1466",
            longitude: "79.0889",
            address: "mu po titamba",
            village_lgd_code: "531465",
            district_lgd_code: "468",
            sub_district_lgd_code: "4001",
            state_lgd_code: "27"
          },
          joint_owners: [
            {
              owner_number: "391",
              main_owner_number: "246",
              owner_name_ror: "बिरबल काशीराम",
              owner_identifier_name: "काशीराम",
              owner_identifier_relationship: null
            }
          ],
          survey_number: "107",
          plot_area: "0.75",
          area_unit: "Hectare"
        }
      ]
    },
    {
      farmer_id: "FARMER002",
      farmer_name: "Sunita Devi",
      aadhaar: "XXXXXXXX7891",
      dob: "15-03-1978",
      gender: "Female",
      farmer_category: "Medium Farmer(Farmer having land 1-2 Hectare)",
      caste_category: "OBC",
      total_land_area: "1.50",
      location_info: {
        latitude: "26.9124",
        longitude: "75.7873",
        address: "Village Keshavpura",
        village_lgd_code: "531466",
        district_lgd_code: "469",
        sub_district_lgd_code: "4002",
        state_lgd_code: "08"
      },
      farm_details: [
        {
          farm_id: "FARM002001",
          location_info: {
            latitude: "26.9124",
            longitude: "75.7873",
            address: "Village Keshavpura",
            village_lgd_code: "531466",
            district_lgd_code: "469",
            sub_district_lgd_code: "4002",
            state_lgd_code: "08"
          },
          joint_owners: [
            {
              owner_number: "201",
              main_owner_number: "200",
              owner_name_ror: "सुनीता देवी",
              owner_identifier_name: "राम लाल",
              owner_identifier_relationship: "पति"
            }
          ],
          survey_number: "45",
          plot_area: "1.50",
          area_unit: "Hectare"
        }
      ]
    },
    {
      farmer_id: "FARMER003",
      farmer_name: "Manjunath Reddy",
      aadhaar: "XXXXXXXX2345",
      dob: "22-07-1975",
      gender: "Male",
      farmer_category: "Big Farmer(Farmer having land >=2 Hectare)",
      caste_category: "General",
      total_land_area: "5.25",
      location_info: {
        latitude: "13.2257",
        longitude: "77.5545",
        address: "Village Doddaballapur",
        village_lgd_code: "531467",
        district_lgd_code: "470",
        sub_district_lgd_code: "4003",
        state_lgd_code: "29"
      },
      farm_details: [
        {
          farm_id: "FARM003001",
          location_info: {
            latitude: "13.2257",
            longitude: "77.5545",
            address: "Village Doddaballapur",
            village_lgd_code: "531467",
            district_lgd_code: "470",
            sub_district_lgd_code: "4003",
            state_lgd_code: "29"
          },
          joint_owners: [
            {
              owner_number: "501",
              main_owner_number: "500",
              owner_name_ror: "मंजुनाथ रेड्डी",
              owner_identifier_name: "वेंकट रेड्डी",
              owner_identifier_relationship: "पिता"
            }
          ],
          survey_number: "78",
          plot_area: "2.50",
          area_unit: "Hectare"
        },
        {
          farm_id: "FARM003002",
          location_info: {
            latitude: "13.2257",
            longitude: "77.5545",
            address: "Village Doddaballapur",
            village_lgd_code: "531467",
            district_lgd_code: "470",
            sub_district_lgd_code: "4003",
            state_lgd_code: "29"
          },
          joint_owners: [
            {
              owner_number: "502",
              main_owner_number: "500",
              owner_name_ror: "लक्ष्मी रेड्डी",
              owner_identifier_name: "मंजुनाथ रेड्डी",
              owner_identifier_relationship: "पत्नी"
            }
          ],
          survey_number: "79",
          plot_area: "2.75",
          area_unit: "Hectare"
        }
      ]
    }
  ],

  products: [
    {
      id: 'PROD_001',
      farmer_id: 'FARMER001',
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
      farmer_id: 'FARMER002',
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
      farmer_id: 'FARMER003',
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
      farmer_id: 'FARMER001',
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
      provider_id: 'FARMER001',
      name: 'Organic Farming Consultation',
      category: 'CONSULTATION',
      subcategory: 'Crop Advisory',
      description: 'Expert advice on organic farming practices, pest management, and soil health',
      price: 500.00,
      unit: 'per hour',
      duration_hours: 2,
      coverage_area: '50km radius from Titamba',
      equipment_included: 'Soil testing kit, pH meter',
      requirements: 'Farm visit access, historical crop data',
      availability_schedule: '{"days": ["Mon", "Wed", "Fri"], "hours": "09:00-17:00"}',
      rating: 4.6,
      total_ratings: 34
    },
    {
      id: 'SERV_002',
      provider_id: 'FARMER002',
      name: 'Tractor with Plowing Equipment',
      category: 'EQUIPMENT_RENTAL',
      subcategory: 'Tractors',
      description: 'Modern tractor with plowing and tilling equipment for field preparation',
      price: 800.00,
      unit: 'per day',
      duration_hours: 8,
      coverage_area: 'Keshavpura district',
      equipment_included: 'Tractor, Plow, Tiller, Operator',
      requirements: 'Fuel to be provided by customer',
      availability_schedule: '{"advance_booking": "2 days", "seasons": ["Kharif", "Rabi"]}',
      rating: 4.4,
      total_ratings: 67
    },
    {
      id: 'SERV_003',
      provider_id: 'FARMER003',
      name: 'Fruit Processing & Packaging',
      category: 'PROCESSING',
      subcategory: 'Post-Harvest',
      description: 'Professional fruit cleaning, sorting, and packaging services',
      price: 15.00,
      unit: 'per kg processed',
      duration_hours: 4,
      coverage_area: 'Doddaballapur district',
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
          certification, established_year, description, rating, total_ratings,
          aadhaar, dob, gender, farmer_category, caste_category, total_land_area,
          location_info, farm_details
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
      `, [
        farmer.farmer_id,
        farmer.farmer_name,
        '+91-9876543210', // Default phone
        `${farmer.farmer_name.toLowerCase().replace(' ', '.')}@agri.com`, // Generated email
        farmer.location_info.address,
        parseFloat(farmer.location_info.latitude),
        parseFloat(farmer.location_info.longitude),
        'City', // Default city - can be derived from LGD codes
        'State', // Default state - can be derived from LGD codes
        '000000', // Default postal code
        parseFloat(farmer.total_land_area), // Using total_land_area as farm_size_acres
        'Mixed Farming', // Default specialization
        'Standard Certified', // Default certification
        2015, // Default established year
        `Farmer specializing in ${farmer.farmer_category}`, // Generated description
        4.5, // Default rating
        50, // Default total ratings
        farmer.aadhaar,
        farmer.dob,
        farmer.gender,
        farmer.farmer_category,
        farmer.caste_category,
        farmer.total_land_area,
        JSON.stringify(farmer.location_info),
        JSON.stringify(farmer.farm_details)
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