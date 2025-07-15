/**
 * Database Service Layer
 * Handles all database operations for agriculture domain using PostgreSQL
 */

const { Pool } = require('pg');
require('dotenv').config();

class DatabaseService {
  constructor() {
    this.pool = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.pool = new Pool({
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          database: process.env.DB_NAME || 'beckn_agriculture',
          user: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'password',
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });

        // Test the connection
        this.pool.query('SELECT NOW()', (err, result) => {
          if (err) {
            reject(err);
          } else {
            console.log('PostgreSQL connected successfully');
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
    }
  }

  // Search products and services based on query parameters
  async search(params = {}) {
    const client = await this.pool.connect();
    try {
      const queryParams = [];
      let paramIndex = 0;

      // Build base query with consistent types
      let query = `
        SELECT * FROM (
          SELECT
            'product' as type,
            p.id,
            p.name,
            p.description,
            p.price,
            p.currency,
            p.unit,
            p.category,
            p.subcategory,
            p.quantity_available,
            p.organic,
            p.images,
            p.specifications::text as specifications,
            f.id as provider_id,
            f.name as provider_name,
            f.city as provider_city,
            f.state as provider_state,
            f.rating as provider_rating,
            f.specialization,
            f.phone as provider_phone,
            f.email as provider_email
          FROM products p
          JOIN farmers f ON p.farmer_id = f.id
          WHERE p.status = 'available'
      `;

      // Add product filters
      if (params.query) {
        paramIndex += 1;
        query += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.category ILIKE $${paramIndex})`;
        queryParams.push(`%${params.query}%`);
      }

      if (params.category) {
        paramIndex += 1;
        query += ` AND p.category = $${paramIndex}`;
        queryParams.push(params.category);
      }

      if (params.location) {
        paramIndex += 1;
        query += ` AND f.city = $${paramIndex}`;
        queryParams.push(params.location);
      }

      if (params.organic !== undefined) {
        paramIndex += 1;
        query += ` AND p.organic = $${paramIndex}`;
        queryParams.push(params.organic);
      }

      // Add services with same structure
      query += `
          UNION ALL
          SELECT
            'service' as type,
            s.id,
            s.name,
            s.description,
            s.price,
            s.currency,
            s.unit,
            s.category,
            s.subcategory,
            null as quantity_available,
            null as organic,
            null as images,
            COALESCE(s.equipment_included, '{}')::text as specifications,
            f.id as provider_id,
            f.name as provider_name,
            f.city as provider_city,
            f.state as provider_state,
            s.rating as provider_rating,
            f.specialization,
            f.phone as provider_phone,
            f.email as provider_email
          FROM services s
          JOIN farmers f ON s.provider_id = f.id
          WHERE s.status = 'available'
      `;

      // Add service filters
      if (params.query) {
        paramIndex += 1;
        query += ` AND (s.name ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex} OR s.category ILIKE $${paramIndex})`;
        queryParams.push(`%${params.query}%`);
      }

      if (params.category) {
        paramIndex += 1;
        query += ` AND s.category = $${paramIndex}`;
        queryParams.push(params.category);
      }

      if (params.location) {
        paramIndex += 1;
        query += ` AND f.city = $${paramIndex}`;
        queryParams.push(params.location);
      }

      query += `) AS combined_results ORDER BY provider_rating DESC`;

      if (params.limit) {
        paramIndex += 1;
        query += ` LIMIT $${paramIndex}`;
        queryParams.push(parseInt(params.limit));
      }

      const result = await client.query(query, queryParams);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get specific item by ID
  async getItemById(id, type = 'product') {
    const client = await this.pool.connect();
    try {
      let query;
      if (type === 'product') {
        query = `
          SELECT 
            p.*,
            f.name as provider_name,
            f.phone as provider_phone,
            f.email as provider_email,
            f.address as provider_address,
            f.city as provider_city,
            f.state as provider_state,
            f.rating as provider_rating,
            f.specialization as provider_specialization
          FROM products p
          JOIN farmers f ON p.farmer_id = f.id
          WHERE p.id = $1 AND p.status = 'available'
        `;
      } else {
        query = `
          SELECT 
            s.*,
            f.name as provider_name,
            f.phone as provider_phone,
            f.email as provider_email,
            f.address as provider_address,
            f.city as provider_city,
            f.state as provider_state,
            f.specialization as provider_specialization
          FROM services s
          JOIN farmers f ON s.provider_id = f.id
          WHERE s.id = $1 AND s.status = 'available'
        `;
      }

      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Get provider details by ID
  async getProviderById(id) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM farmers WHERE id = $1 AND status = 'active'
      `;

      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  // Create order
  async createOrder(orderData) {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO orders (
          id, transaction_id, customer_name, customer_phone, customer_email,
          customer_address, farmer_id, items, total_amount, currency,
          delivery_type, delivery_address, delivery_date, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id
      `;

      const params = [
        orderData.id,
        orderData.transaction_id,
        orderData.customer_name,
        orderData.customer_phone,
        orderData.customer_email,
        orderData.customer_address,
        orderData.farmer_id,
        JSON.stringify(orderData.items),
        orderData.total_amount,
        orderData.currency || 'INR',
        orderData.delivery_type,
        orderData.delivery_address,
        orderData.delivery_date,
        orderData.notes
      ];

      const result = await client.query(query, params);
      return { id: result.rows[0].id, changes: result.rowCount };
    } finally {
      client.release();
    }
  }

  // Get order by ID
  async getOrderById(id) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT 
          o.*,
          f.name as farmer_name,
          f.phone as farmer_phone,
          f.address as farmer_address
        FROM orders o
        JOIN farmers f ON o.farmer_id = f.id
        WHERE o.id = $1
      `;

      const result = await client.query(query, [id]);
      const row = result.rows[0];
      
      if (row && row.items) {
        row.items = JSON.parse(row.items);
      }
      
      return row || null;
    } finally {
      client.release();
    }
  }

  // Update order status
  async updateOrderStatus(id, status, fulfillmentStatus = null) {
    const client = await this.pool.connect();
    try {
      let query = `UPDATE orders SET payment_status = $1, updated_at = CURRENT_TIMESTAMP`;
      const params = [status];

      if (fulfillmentStatus) {
        query += `, fulfillment_status = $2 WHERE id = $3`;
        params.push(fulfillmentStatus, id);
      } else {
        query += ` WHERE id = $2`;
        params.push(id);
      }

      const result = await client.query(query, params);
      return { changes: result.rowCount };
    } finally {
      client.release();
    }
  }

  // Get categories
  async getCategories(type = null) {
    const client = await this.pool.connect();
    try {
      let query = `SELECT * FROM categories WHERE status = 'active'`;
      const params = [];

      if (type) {
        query += ` AND type = $1`;
        params.push(type);
      }

      query += ` ORDER BY sort_order, name`;

      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  // Get providers in an area
  async getProvidersInArea(city, state = null) {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT 
          f.*,
          COUNT(DISTINCT p.id) as product_count,
          COUNT(DISTINCT s.id) as service_count
        FROM farmers f
        LEFT JOIN products p ON f.id = p.farmer_id AND p.status = 'available'
        LEFT JOIN services s ON f.id = s.provider_id AND s.status = 'available'
        WHERE f.status = 'active' AND f.city = $1
      `;
      const params = [city];

      if (state) {
        query += ` AND f.state = $2`;
        params.push(state);
      }

      query += ` GROUP BY f.id ORDER BY f.rating DESC`;

      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = DatabaseService; 