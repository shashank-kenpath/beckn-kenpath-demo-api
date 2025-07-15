/**
 * Beckn-enabled AgriStack OAN API with Database Integration
 * A dynamic API that connects to database for agriculture products and services
 */

const express = require("express");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();

const DatabaseService = require('./lib/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database service
const dbService = new DatabaseService();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to database on startup
let dbConnected = false;
dbService.connect()
  .then(() => {
    dbConnected = true;
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

/**
 * Build dynamic Beckn response based on database results
 */
async function buildDynamicResponse(reqBody = {}, searchResults = []) {
  const now = new Date();
  const incomingCtx = reqBody.context ?? {};

  const ctx_out = {
    ttl: incomingCtx.ttl ?? "PT30M",
    action: "on_search",
    timestamp: now.toISOString(),
    message_id: incomingCtx.message_id,
    transaction_id: incomingCtx.transaction_id ?? uuidv4(),
    domain: incomingCtx.domain ?? "agristack:oan",
    version: incomingCtx.version ?? "1.1.0",
    bap_id: incomingCtx.bap_id ?? null,
    bap_uri: incomingCtx.bap_uri ?? null,
    bpp_id: incomingCtx.bpp_id ?? "kenpath-agriculture-bpp",
    bpp_uri: incomingCtx.bpp_uri ?? "https://bpp-client.kenpath.ai",
    location: incomingCtx.location ?? { country: { name: "IND", code: "IND" } }
  };

  // Group results by provider
  const providerMap = new Map();
  
  searchResults.forEach(item => {
    if (!providerMap.has(item.provider_id)) {
      providerMap.set(item.provider_id, {
        id: item.provider_id,
        descriptor: {
          name: item.provider_name,
          short_desc: item.specialization || "AgriStack OAN products and services",
          images: [
            {
              url: `https://api.kenpath.ai/images/providers/${item.provider_id}.jpg`,
              size_type: "sm"
            }
          ]
        },
        locations: [
          {
            id: `${item.provider_id}_location`,
            city: item.provider_city,
            state: item.provider_state,
            country: "IND"
          }
        ],
        categories: [],
        items: [],
        fulfillments: [
          {
            id: `${item.provider_id}_fulfillment`,
            type: item.type === 'service' ? 'on_site_service' : 'home_delivery',
            agent: {
              person: {
                name: item.provider_name
              },
              contact: {
                phone: item.provider_phone || "+91-9876543210",
                email: item.provider_email || "contact@provider.com"
              }
            }
          }
        ],
        payments: [
          {
            id: `${item.provider_id}_payment`,
            type: "PRE-ORDER",
            collected_by: "BPP",
            status: "NOT-PAID",
            tags: [
              {
                code: "SETTLEMENT_TYPE",
                list: [
                  {
                    code: "SETTLEMENT_TYPE",
                    value: "upi"
                  }
                ]
              }
            ]
          }
        ]
      });
    }

    const provider = providerMap.get(item.provider_id);
    
    // Add category if not exists
    if (!provider.categories.find(cat => cat.id === item.category)) {
      provider.categories.push({
        id: item.category,
        descriptor: {
          code: item.category,
          name: getCategoryName(item.category)
        }
      });
    }

    // Add item
    const becknItem = {
      id: item.id,
      descriptor: {
        name: item.name,
        short_desc: item.description.substring(0, 100),
        long_desc: item.description,
        images: item.images ? [{ url: item.images }] : []
      },
      category_ids: [item.category],
      location_ids: [`${item.provider_id}_location`],
      fulfillment_ids: [`${item.provider_id}_fulfillment`],
      payment_ids: [`${item.provider_id}_payment`],
      price: {
        currency: item.currency || "INR",
        value: item.price.toString(),
        maximum_value: item.price.toString()
      },
      quantity: {
        unitized: {
          measure: {
            unit: item.unit,
            value: "1"
          }
        },
        available: {
          count: item.type === 'product' ? (item.quantity_available || 1) : 1
        },
        maximum: {
          count: item.type === 'product' ? (item.quantity_available || 1) : 1
        }
      },
      tags: []
    };

    // Add type-specific tags
    if (item.type === 'product') {
      becknItem.tags.push({
        descriptor: {
          code: "product-metadata",
          name: "Product Metadata"
        },
        list: [
          {
            descriptor: { code: "type", name: "Type" },
            value: "product"
          },
          {
            descriptor: { code: "organic", name: "Organic" },
            value: item.organic ? "yes" : "no"
          }
        ]
      });
      
      if (item.specifications) {
        try {
          const specs = JSON.parse(item.specifications);
          Object.entries(specs).forEach(([key, value]) => {
            becknItem.tags[0].list.push({
              descriptor: { code: key, name: key.replace('_', ' ').toUpperCase() },
              value: value.toString()
            });
          });
        } catch (e) {
          // Invalid JSON, skip
        }
      }
    } else {
      becknItem.tags.push({
        descriptor: {
          code: "service-metadata",
          name: "Service Metadata"
        },
        list: [
          {
            descriptor: { code: "type", name: "Type" },
            value: "service"
          },
          {
            descriptor: { code: "duration", name: "Duration (hours)" },
            value: item.duration_hours ? item.duration_hours.toString() : "1"
          }
        ]
      });
    }

    provider.items.push(becknItem);
  });

  return {
    context: ctx_out,
    message: {
      ack: { status: "ACK" },
      catalog: {
        descriptor: {
          name: "AgriStack OAN Products & Services Catalog",
          short_desc: "Discover fresh produce, farming equipment, and agristack services",
          long_desc: "A comprehensive marketplace for agristack products and services connecting farmers, suppliers, and buyers across India"
        },
        providers: Array.from(providerMap.values())
      }
    }
  };
}

function getCategoryName(categoryCode) {
  const categoryNames = {
    'VEGETABLES': 'Vegetables',
    'FRUITS': 'Fruits',
    'GRAINS': 'Grains & Cereals',
    'SEEDS': 'Seeds & Seedlings',
    'TOOLS': 'Farm Tools',
    'CONSULTATION': 'Consultation Services',
    'EQUIPMENT_RENTAL': 'Equipment Rental',
    'FIELD_SERVICES': 'Field Services',
    'PROCESSING': 'Processing Services'
  };
  return categoryNames[categoryCode] || categoryCode;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Common function to forward to BAP endpoint
async function forwardToBap(payload, source) {
  try {
    const data = await buildDynamicResponse(payload);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://bpp-client.kenpath.ai/on_search',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: data
    };
    const response = await axios.request(config);
    console.log(`BAP /on_search response (${source}):`, JSON.stringify(response.data));
  } catch (error) {
    console.error(`Error forwarding to BAP /on_search (${source}):`, error?.response?.data || error.message);
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString() 
  });
});

// Get all categories
app.get("/categories", async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(503).json({ error: "Database not available" });
    }

    const categories = await dbService.getCategories(req.query.type);
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Dynamic search endpoint
app.post("/search", async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(503).json({ error: "Database not available" });
    }

    console.log('Search request received:', JSON.stringify(req.body, null, 2));

    // Extract search parameters from Beckn message
    const searchParams = {};
    const message = req.body.message;
    
    if (message && message.intent) {
      const intent = message.intent;
      
      // Extract search query from item descriptor
      if (intent.item && intent.item.descriptor && intent.item.descriptor.name) {
        searchParams.query = intent.item.descriptor.name;
      }
      
      // Extract category from intent
      if (intent.category && intent.category.descriptor && intent.category.descriptor.code) {
        searchParams.category = intent.category.descriptor.code;
      }
      
      // Extract location from intent
      if (intent.fulfillment && intent.fulfillment.end && intent.fulfillment.end.location) {
        const location = intent.fulfillment.end.location;
        if (location.city) {
          searchParams.location = location.city;
        }
      }
      
      // Check for provider-specific search
      if (intent.provider && intent.provider.id) {
        searchParams.provider_id = intent.provider.id;
      }
    }

    // Also check query parameters for fallback
    Object.assign(searchParams, {
      query: searchParams.query || req.query.query,
      category: searchParams.category || req.query.category,
      location: searchParams.location || req.query.location,
      organic: req.query.organic === 'true' ? true : req.query.organic === 'false' ? false : undefined,
      limit: req.query.limit || 20
    });

    console.log('Extracted search parameters:', searchParams);

    // Search database
    const searchResults = await dbService.search(searchParams);
    console.log(`Found ${searchResults.length} results`);

    // Build and send response
    const dynamicResponse = await buildDynamicResponse(req.body, searchResults);
    
    // Send immediate ACK
    res.status(200).json({ message: { ack: { status: "ACK" } } });

    // Forward to BAP after delay (async callback pattern)
    (async () => {
      await delay(1000);
      await forwardToBap(req.body, "search");
    })();

  } catch (error) {
    console.error('Error in search endpoint:', error);
    res.status(500).json({ 
      message: { 
        ack: { status: "NACK" },
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to process search request"
        }
      }
    });
  }
});

// Select endpoint (item selection)
app.post("/select", async (req, res) => {
  try {
    console.log('Select request received:', JSON.stringify(req.body, null, 2));
    
    const message = req.body.message;
    if (message && message.order && message.order.items) {
      const items = message.order.items;
      let totalValue = 0;
      
      // Calculate total and validate items
      for (const item of items) {
        const dbItem = await dbService.getItemById(item.id, item.tags?.find(t => t.descriptor?.code === 'type')?.value || 'product');
        if (dbItem) {
          totalValue += dbItem.price * (item.quantity?.count || 1);
        }
      }
      
      // Build select response with quote
      const response = {
        context: {
          ...req.body.context,
          action: "on_select",
          timestamp: new Date().toISOString()
        },
        message: {
          ack: { status: "ACK" },
          order: {
            ...message.order,
            quote: {
              price: {
                currency: "INR",
                value: totalValue.toString()
              },
              breakup: items.map(item => ({
                item: { id: item.id },
                title: `Item charges`,
                price: {
                  currency: "INR", 
                  value: (totalValue / items.length).toString() // Simplified
                }
              }))
            }
          }
        }
      };
      
      res.json({ message: { ack: { status: "ACK" } } });
      
      // Forward response to BAP
      setTimeout(async () => {
        try {
          await axios.post('https://bpp-client.kenpath.ai/on_select', response);
        } catch (err) {
          console.error('Error forwarding select response:', err.message);
        }
      }, 1000);
    } else {
      res.status(400).json({ message: { ack: { status: "NACK" } } });
    }
  } catch (error) {
    console.error('Error in select endpoint:', error);
    res.status(500).json({ message: { ack: { status: "NACK" } } });
  }
});

// Additional endpoints that work with database
app.get("/providers/:city", async (req, res) => {
  try {
    const providers = await dbService.getProvidersInArea(req.params.city, req.query.state);
    res.json({ providers });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
});

app.get("/item/:id", async (req, res) => {
  try {
    const item = await dbService.getItemById(req.params.id, req.query.type);
    if (item) {
      res.json({ item });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

const staticAckResponse = {
  "message": {
    "ack": {
      "status": "ACK"
    }
  }
}

// Enhanced webhook routes with search functionality and proper Beckn context
app.get("/webhook", async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(503).json({ error: "Database not available" });
    }

    console.log('Webhook GET received:', JSON.stringify(req.query, null, 2));
    
    // Extract search parameter from query
    const searchQuery = req.query.search || req.query.q || req.query.query;
    
    let searchResults = [];
    
    if (searchQuery) {
      // Search database with the provided search parameter
      const searchParams = {
        query: searchQuery,
        category: req.query.category,
        location: req.query.location,
        organic: req.query.organic === 'true' ? true : req.query.organic === 'false' ? false : undefined,
        limit: parseInt(req.query.limit) || 20
      };
      
      console.log('Webhook search parameters:', searchParams);
      searchResults = await dbService.search(searchParams);
      console.log(`Found ${searchResults.length} results for webhook search`);
    } else {
      // If no search parameter, get all available items
      searchResults = await dbService.search({ limit: 20 });
    }

    // Create proper Beckn context for webhook response
    const now = new Date();
    const webhookContext = {
      domain: "agristack:oan",
      action: "on_search",
      country: "IND",
      city: "std:080",
      core_version: "1.1.0",
      bap_id: "webhook-test-bap",
      bap_uri: "https://webhook-test.kenpath.ai",
      bpp_id: "kenpath-agriculture-bpp",
      bpp_uri: "https://bpp-client.kenpath.ai",
      transaction_id: uuidv4(),
      message_id: uuidv4(),
      timestamp: now.toISOString(),
      ttl: "PT30M"
    };

    // Build response with search results and proper context
    const response = await buildDynamicResponse({ context: webhookContext }, searchResults);
    
    // Send immediate ACK
    res.json(staticAckResponse);
    
    // Forward to BAP after delay
    (async () => {
      await delay(1000);
      await forwardToBap(response, "webhook-get");
    })();
    
  } catch (error) {
    console.error('Error in webhook GET:', error);
    res.status(500).json({ error: 'Failed to process webhook request' });
  }
});

app.post("/webhook", async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(503).json({ error: "Database not available" });
    }

    console.log("Webhook POST received:", JSON.stringify(req.body, null, 2));
    
    // Extract search parameter from body or query
    const searchQuery = req.body.search || req.query.search || req.query.q || req.query.query;
    
    let searchResults = [];
    
    if (searchQuery) {
      // Search database with the provided search parameter
      const searchParams = {
        query: searchQuery,
        category: req.body.category || req.query.category,
        location: req.body.location || req.query.location,
        organic: req.body.organic === 'true' ? true : req.body.organic === 'false' ? false : undefined,
        limit: parseInt(req.body.limit || req.query.limit) || 20
      };
      
      console.log('Webhook search parameters:', searchParams);
      searchResults = await dbService.search(searchParams);
      console.log(`Found ${searchResults.length} results for webhook search`);
    } else {
      // If no search parameter, get all available items
      searchResults = await dbService.search({ limit: 20 });
    }

    // Use provided context or create default
    const now = new Date();
    const context = req.body.context || {
      domain: "agristack:oan",
      action: "on_search",
      country: "IND",
      city: "std:080",
      core_version: "1.1.0",
      bap_id: "webhook-test-bap",
      bap_uri: "https://webhook-test.kenpath.ai",
      bpp_id: "kenpath-agriculture-bpp",
      bpp_uri: "https://bpp-client.kenpath.ai",
      transaction_id: uuidv4(),
      message_id: uuidv4(),
      timestamp: now.toISOString(),
      ttl: "PT30M"
    };

    // Build response with search results
    const response = await buildDynamicResponse({ context }, searchResults);
    
    // Send immediate ACK
    res.json({ received: true, body: req.body });
    
    // Forward to BAP after delay
    (async () => {
      await delay(1000);
      await forwardToBap(response, "webhook-post");
    })();
    
  } catch (error) {
    console.error('Error in webhook POST:', error);
    res.status(500).json({ error: 'Failed to process webhook request' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await dbService.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Beckn Agriculture API listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Categories: http://localhost:${PORT}/categories`);
  console.log(`Database integration: ${dbConnected ? 'Active' : 'Pending'}`);
}); 