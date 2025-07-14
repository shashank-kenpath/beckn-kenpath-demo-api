# Beckn Agriculture API - Postman Collection Guide

## 📥 Import Instructions

1. **Download the Collection**: Save `Beckn_Agriculture_API.postman_collection.json`
2. **Import to Postman**: 
   - Open Postman
   - Click "Import" 
   - Select the JSON file
   - The collection will be imported with all endpoints and examples

## 🔧 Setup

### Collection Variables
The collection uses these variables (already configured):
- `baseUrl`: `http://localhost:3000` (API server URL)
- `bap_id`: `kenpath-agriculture-bap`
- `bpp_id`: `kenpath-agriculture-bpp`
- `transaction_id`: Auto-generated UUID
- `message_id`: Auto-generated UUID

### Prerequisites
1. **Start the API server**: `npm start`
2. **Setup database**: `npm run setup-db && npm run seed-data`
3. **Verify health**: Run "Health Check" request first

## 📁 Collection Structure

### 1. Health & System
- **Health Check**: Verify API and database status

### 2. Categories & Taxonomy
- **Get All Categories**: List all product/service categories
- **Get Product Categories Only**: Filter for products only
- **Get Service Categories Only**: Filter for services only

### 3. Beckn Protocol Endpoints
Core Beckn protocol implementation:

#### Search Endpoints
- **Basic Product Search**: Search by product name (e.g., "tomato")
- **Category Based Search**: Search by category (VEGETABLES, FRUITS, etc.)
- **Location Based Search**: Search by city/location
- **Service Search**: Search for services (CONSULTATION, EQUIPMENT_RENTAL)
- **Combined Filters**: Multiple search criteria
- **Query Parameters**: Alternative search using URL parameters

#### Select Endpoint
- **Item Selection**: Select items and get price quotes

### 4. Direct Data Access
Development/testing endpoints:
- **Get Providers by City**: List farmers in a city
- **Get Providers by City and State**: More specific location filter
- **Get Product by ID**: Detailed product information
- **Get Service by ID**: Detailed service information

### 5. Webhook Endpoints
Legacy BAP communication:
- **Webhook GET/POST**: For testing callback mechanisms

### 6. Sample Data IDs
Reference information for testing (see descriptions for IDs)

## 🚀 Quick Start Testing

### 1. Basic Flow
```
1. Health Check → Verify system is ready
2. Get All Categories → See available categories
3. Basic Product Search → Search for "tomato"
4. Get Product by ID → Get details of PROD_001
```

### 2. Advanced Search Testing
```
1. Category Based Search → Search VEGETABLES category
2. Location Based Search → Search in "Bharuch"
3. Combined Filters → Organic vegetables in Bharuch
4. Service Search → Search CONSULTATION services
```

### 3. Complete Beckn Flow
```
1. Search → Find products/services
2. Select → Choose items and get quote
3. (Additional Beckn endpoints like init, confirm would follow)
```

## 📋 Sample Data Reference

### Farmers
- `FARMER_001`: Ramesh Kumar (Bharuch, Gujarat) - Organic Vegetables
- `FARMER_002`: Sunita Devi (Jaipur, Rajasthan) - Grains and Pulses  
- `FARMER_003`: Manjunath Reddy (Bangalore Rural, Karnataka) - Fruit Orchards

### Products
- `PROD_001`: Organic Tomatoes (₹45/kg)
- `PROD_002`: Basmati Rice (₹120/kg)
- `PROD_003`: Fresh Mangoes (₹200/kg)
- `PROD_004`: Tomato Seeds (₹250/100g packet)

### Services
- `SERV_001`: Organic Farming Consultation (₹500/hour)
- `SERV_002`: Tractor with Plowing Equipment (₹800/day)
- `SERV_003`: Fruit Processing & Packaging (₹15/kg)

### Categories
**Products**: CROPS, GRAINS, VEGETABLES, FRUITS, SEEDS, TOOLS
**Services**: CONSULTATION, EQUIPMENT_RENTAL, FIELD_SERVICES, PROCESSING

## 🔍 Search Examples

### Product Search
```json
{
  "message": {
    "intent": {
      "item": {"descriptor": {"name": "tomato"}},
      "category": {"descriptor": {"code": "VEGETABLES"}},
      "fulfillment": {"end": {"location": {"city": "Bharuch"}}}
    }
  }
}
```

### Service Search
```json
{
  "message": {
    "intent": {
      "category": {"descriptor": {"code": "CONSULTATION"}}
    }
  }
}
```

### Query Parameter Search
```
GET /search?query=organic&category=VEGETABLES&location=Bharuch&limit=10
```

## ⚡ Pre-request Scripts

The collection automatically:
- Generates unique `transaction_id` and `message_id` for each request
- Sets proper timestamps
- Maintains Beckn protocol compliance

## 🐛 Troubleshooting

### Common Issues
1. **503 Database Error**: Run `npm run setup-db && npm run seed-data`
2. **404 Not Found**: Ensure server is running on port 3000
3. **Empty Results**: Check if sample data exists with health endpoint

### Response Codes
- `200`: Success with ACK response
- `503`: Database unavailable
- `404`: Item/endpoint not found
- `500`: Internal server error

## 📚 Additional Resources

- **API Documentation**: See README.md in project root
- **Beckn Specification**: https://beckn.network/
- **PostgreSQL Setup**: See project README for database configuration

## 🔄 Auto-Generated Values

Each request automatically generates:
- `transaction_id`: Unique UUID for transaction tracking
- `message_id`: Unique UUID for message identification
- `timestamp`: Current ISO timestamp 