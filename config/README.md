# AgriStack OAN Layer 2 Configuration

This directory contains the complete Layer 2 configuration for the AgriStack Open Agriculture Network (agristack:oan) domain based on Beckn ONIX specification.

## Files

### 1. agristack-layer2-config.yaml
Complete OpenAPI 3.0 specification for the agristack:oan domain with:
- All Beckn protocol endpoints (/search, /select, /init, /confirm, etc.)
- AgriStack-specific categories and tags
- Domain-specific validation rules
- Error codes for agricultural domain

### 2. agristack-layer2-examples.json
Practical examples for testing including:
- Search requests for products and services
- Select operations
- Webhook usage examples
- Error handling examples

### 3. beckn-onix/ (cloned repository)
Reference implementation from Beckn ONIX for Layer 2 generation

## Usage

### Testing Layer 2 Configuration
```bash
# Test search with Layer 2 compliance
curl -X POST 'http://localhost:3001/search' \
  -H 'Content-Type: application/json' \
  -d @config/agristack-layer2-examples.json

# Test webhook with search
curl -X GET 'http://localhost:3001/webhook?search=tomato&category=VEGETABLES&domain=agristack:oan'

# Test with full Layer 2 context
curl -X POST 'http://localhost:3001/search' \
  -H 'Content-Type: application/json' \
  -d '{
    "context": {
      "domain": "agristack:oan",
      "action": "search",
      "country": "IND",
      "city": "std:080",
      "core_version": "1.1.0",
      "bap_id": "agristack-bap",
      "bap_uri": "https://agristack-bap.kenpath.ai",
      "transaction_id": "txn-123456",
      "message_id": "msg-789012",
      "timestamp": "2024-01-15T10:30:00.000Z"
    },
    "message": {
      "intent": {
        "item": {
          "descriptor": {
            "name": "organic tomato"
          }
        },
        "category": {
          "descriptor": {
            "code": "VEGETABLES"
          }
        }
      }
    }
  }'
```

## Domain Specific Features

### Categories (AgriCategory)
- **VEGETABLES**: Fresh vegetables and produce
- **FRUITS**: Fresh fruits and seasonal produce
- **GRAINS**: Rice, wheat, pulses and cereals
- **SEEDS**: Quality seeds and plant seedlings
- **TOOLS**: Agricultural tools and equipment
- **CONSULTATION**: Expert agricultural consultation
- **EQUIPMENT_RENTAL**: Farm equipment rental services
- **FIELD_SERVICES**: On-field agricultural services
- **PROCESSING**: Post-harvest processing services

### Tags
- **product-metadata**: organic, variety, grade, shelf_life
- **service-metadata**: duration, experience, certification

### Error Codes
- **ITEM_NOT_AVAILABLE**: Product/service not available
- **LOCATION_NOT_SERVICEABLE**: Service not available in location
- **SEASONAL_UNAVAILABLE**: Seasonal product unavailable
- **ORGANIC_CERTIFICATION_MISSING**: Missing organic certification
- **EQUIPMENT_NOT_AVAILABLE**: Equipment not available for rental

### Service Types
- **home_delivery**: For products
- **on_site_service**: For field services
- **pickup**: For equipment pickup
- **remote_consultation**: For advisory services

## Validation Rules
- Domain must be "agristack:oan"
- Required context fields: domain, action, version, message_id, transaction_id
- Supported actions: search, on_search, select, on_select, init, on_init, confirm, on_confirm, status, on_status, track, on_track, cancel, on_cancel, update, on_update, rating, on_rating, support, on_support

## Integration with Current API
The current API implementation supports:
- Webhook endpoints with search functionality
- Database integration for products and services
- Proper Beckn context with agristack:oan domain
- Layer 2 compliant responses