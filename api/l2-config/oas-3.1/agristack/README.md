# AgriStack OAN Layer 2 Configuration

This directory contains the complete Layer 2 configuration for the AgriStack Open Agriculture Network (agristack:oan) domain based on Beckn ONIX specification.

## Directory Structure

```
api/l2-config/oas-3.1/agristack/
├── template_agristack_1.1.0_openapi_3.1.yaml    # Main template file
├── example-rules/
│   ├── requests/
│   │   └── search/
│   │       └── agri_search_rules.yaml           # Search request rules
│   ├── responses/
│   │   └── on_search/
│   │       └── agri_on_search_rules.yaml        # On search response rules
│   └── shared-rules/
│       └── agri_context_rules.yaml              # Shared context rules
├── example-jsons/
│   ├── requests/
│   │   └── search/
│   │       ├── search_vegetables.json           # Search vegetables
│   │       ├── search_equipment_rental.json     # Search equipment rental
│   │       └── webhook_search.json              # Webhook search example
│   └── responses/
│       └── on_search/
│           └── on_search_vegetables.json        # On search response
└── README.md                                    # This file
```

## Files Created

### 1. template_agristack_1.1.0_openapi_3.1.yaml
Complete OpenAPI 3.1 template for agristack:oan domain with:
- All Beckn protocol endpoints (/search, /on_search, /select, etc.)
- Webhook endpoint with search parameter support
- AgriStack-specific schemas and validation rules
- Domain-specific categories and service types

### 2. Rule Files
- **agri_search_rules.yaml**: Validation rules for search requests
- **agri_on_search_rules.yaml**: Validation rules for on_search responses
- **agri_context_rules.yaml**: Shared context validation rules

### 3. Example JSON Files
- **search_vegetables.json**: Search for organic tomatoes
- **search_equipment_rental.json**: Search for tractor rental
- **webhook_search.json**: Webhook search with parameters
- **on_search_vegetables.json**: Complete on_search response

## Compilation Instructions

### Install Swagger CLI
```bash
sudo npm install -g swagger-cli
```

### Compile Layer 2 Configuration
```bash
cd api/l2-config/oas-3.1/agristack/
swagger-cli bundle template_agristack_1.1.0_openapi_3.1.yaml --outfile agristack_1.1.0_openapi_3.1.yaml --type yaml
```

### Expected Output
```
Created agristack_1.1.0_openapi_3.1.yaml from template_agristack_1.1.0_openapi_3.1.yaml
```

## Testing with Current API

### Webhook Search (Layer 2 Compliant)
```bash
# GET request with search parameter
curl -X GET 'http://localhost:3001/webhook?search=organic&category=VEGETABLES&location=Bangalore'

# POST request with full context
curl -X POST 'http://localhost:3001/webhook' \
  -H 'Content-Type: application/json' \
  -d @example-jsons/requests/search/webhook_search.json
```

### Standard Search (Layer 2 Compliant)
```bash
curl -X POST 'http://localhost:3001/search' \
  -H 'Content-Type: application/json' \
  -d @example-jsons/requests/search/search_vegetables.json
```

## Domain Specific Features

### Categories
- **VEGETABLES**: Fresh vegetables and produce
- **FRUITS**: Fresh fruits and seasonal produce
- **GRAINS**: Rice, wheat, pulses and cereals
- **SEEDS**: Quality seeds and plant seedlings
- **TOOLS**: Agricultural tools and equipment
- **CONSULTATION**: Expert agricultural consultation
- **EQUIPMENT_RENTAL**: Farm equipment rental services
- **FIELD_SERVICES**: On-field agricultural services
- **PROCESSING**: Post-harvest processing services

### Service Types
- **home_delivery**: For products
- **on_site_service**: For field services
- **pickup**: For equipment pickup
- **remote_consultation**: For advisory services

### Validation Rules
- Domain must be "agristack:oan"
- Required context fields: domain, action, version, message_id, transaction_id
- Supported actions: All Beckn protocol actions
- Webhook supports search parameter in query/body

## Integration Status
✅ Webhook endpoints updated with search functionality
✅ Database integration for products and services
✅ Proper Beckn context with agristack:oan domain
✅ Layer 2 compliant responses
✅ Ready for compilation and testing