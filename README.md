# Beckn Agriculture Marketplace API

A dynamic, database-driven API implementing the Beckn protocol for agricultural products and services marketplace. This project transforms from a static template-based system to a fully functional agriculture domain marketplace with proper Beckn Layer 2 configuration.

## 🌾 Features

- **Dynamic Database Integration**: PostgreSQL database with agriculture-specific schema
- **Beckn Protocol Compliance**: Full implementation of Beckn 1.1.0 specification
- **Agriculture Domain Focus**: Farmer profiles, crop products, agricultural services
- **Layer 2 Configuration**: Complete network configuration for agriculture domain
- **Real-time Search**: Dynamic search across products and services
- **Provider Management**: Farmer and service provider profiles
- **Order Management**: End-to-end order lifecycle support

## 🏗️ Project Structure

```
beckn-kenpath-demo-api/
├── index.js                           # Main API server
├── package.json                       # Dependencies and scripts
├── lib/
│   └── database.js                    # Database service layer
├── scripts/
│   ├── setup-database.js             # Database schema creation
│   └── seed-data.js                  # Sample data population
├── config/
│   └── beckn-layer2-config.yaml      # Beckn Layer 2 configuration
├── .env.example                      # Environment configuration template
└── README.md                         # This file
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 16+ 
- PostgreSQL 12+

### 2. Database Setup

Install and start PostgreSQL, then create a database:

```bash
# Create database
createdb beckn_agriculture

# Or using psql
psql -U postgres
CREATE DATABASE beckn_agriculture;
```

### 3. Installation

```bash
# Clone and install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your PostgreSQL credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=beckn_agriculture
DB_USER=postgres
DB_PASSWORD=your_password

# Setup database schema
npm run setup-db

# Seed with sample data
npm run seed-data

# Start the server
npm start

# For development with auto-reload
npm run dev
```

### 4. Verify Installation

```bash
# Check health
curl http://localhost:3000/health

# List categories
curl http://localhost:3000/categories

# Test search
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{"message": {"intent": {"item": {"descriptor": {"name": "tomato"}}}}}'
```

## 📊 Database Schema

### Tables

1. **farmers** - Farmer/provider profiles
2. **products** - Agricultural products (crops, seeds, tools)
3. **services** - Agricultural services (consultation, equipment rental)
4. **orders** - Order management
5. **categories** - Product/service categorization

### Sample Data

The system includes sample data for:
- 3 farmers across Gujarat, Rajasthan, and Karnataka
- 4 products (tomatoes, rice, mangoes, seeds)
- 3 services (consultation, tractor rental, processing)
- 10 categories with hierarchical structure

## 🔍 API Endpoints

### Beckn Protocol Endpoints

- `POST /search` - Dynamic product/service search
- `POST /select` - Item selection with quote calculation
- `GET /webhook` - Webhook for BAP communication
- `POST /webhook` - Webhook for data processing

### Additional Endpoints

- `GET /health` - Service health check
- `GET /categories` - List all categories
- `GET /providers/:city` - Providers in specific city
- `GET /item/:id` - Get specific item details

### Search Parameters

The search endpoint supports multiple parameter extraction methods:

**From Beckn Message Structure:**
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

**From Query Parameters:**
- `?query=tomato`
- `?category=VEGETABLES`
- `?location=Bharuch`
- `?organic=true`
- `?limit=10`

## 🌐 Beckn Layer 2 Configuration

The `config/beckn-layer2-config.yaml` file provides comprehensive network configuration including:

### Network Settings
- Domain: Agriculture
- Country: India (IND)
- Currency: INR
- Language: English

### Domain Taxonomy
- **Product Categories**: Crops, Seeds, Tools
- **Service Categories**: Consultation, Equipment Rental, Field Services
- **Location Mapping**: State-wise city and specialization mapping
- **Quality Standards**: Certification and grading parameters

### Business Rules
- **Seasonal Availability**: Kharif, Rabi, and Zaid seasons
- **Pricing Rules**: Dynamic pricing and bulk discounts
- **Quality Assurance**: Mandatory and optional testing

### Technical Configuration
- **Authentication**: Digital signature with Ed25519
- **Communication**: HTTP/HTTPS and WebSocket support
- **Security**: Data protection and privacy compliance
- **Monitoring**: Performance metrics and reporting

## 📋 Sample API Calls

### Search for Organic Vegetables

```bash
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{
    "context": {
      "domain": "agriculture",
      "action": "search",
      "version": "1.1.0",
      "bap_id": "kenpath-agriculture-bap",
      "bap_uri": "https://bap-client.kenpath.ai",
      "transaction_id": "12345",
      "message_id": "msg_001"
    },
    "message": {
      "intent": {
        "category": {"descriptor": {"code": "VEGETABLES"}},
        "fulfillment": {"end": {"location": {"city": "Bharuch"}}}
      }
    }
  }'
```

### Search by Provider Location

```bash
curl "http://localhost:3000/providers/Bharuch?state=Gujarat"
```

### Get Item Details

```bash
curl "http://localhost:3000/item/PROD_001?type=product"
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=beckn_agriculture
DB_USER=postgres
DB_PASSWORD=your_password

# API Configuration
PORT=3000
NODE_ENV=development

# Beckn Configuration
BPP_ID=kenpath-agriculture-bpp
BPP_URI=https://bpp-client.kenpath.ai
BAP_CALLBACK_URL=https://bpp-client.kenpath.ai/on_search
```

### Database Configuration

The PostgreSQL database provides:

- **ACID Transactions**: Reliable data consistency
- **Advanced Indexing**: Optimized search performance
- **JSON Support**: Native JSONB for flexible data storage
- **Scalability**: Production-ready with connection pooling
- **Full-text Search**: Advanced search capabilities

For production deployment:
- Configure connection pooling parameters
- Set up database backups
- Enable query logging and monitoring
- Consider read replicas for high availability

## 🚀 Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Docker Deployment

```bash
# Build image
docker build -t beckn-agriculture-api .

# Run container
docker run -p 3000:3000 -e DB_HOST=host.docker.internal -e DB_PASSWORD=your_password beckn-agriculture-api
```

## 🧪 Testing

### Manual Testing

Use the provided sample data to test various scenarios:

1. **Search Products**: Test different product categories
2. **Search Services**: Test service discovery
3. **Location-based Search**: Test geo-filtering
4. **Provider Discovery**: Test provider listing

### Integration Testing

Test with actual Beckn network components:

1. Register with Beckn Gateway
2. Subscribe to Beckn Registry
3. Test BAP-BPP communication
4. Verify callback mechanisms

## 📈 Monitoring

The API includes built-in monitoring capabilities:

- Health check endpoint
- Database connection status
- Error logging and handling
- Transaction tracking

### Metrics Tracked

- Response times
- Database query performance
- Error rates
- Search result relevance
- Provider satisfaction

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Ensure Beckn protocol compliance
5. Submit pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Links

- [Beckn Protocol Specification](https://developers.becknprotocol.io/)
- [Beckn ONIX Documentation](https://becknprotocol.io/beckn-onix/)
- [Agriculture Domain Examples](https://github.com/beckn/protocol-specifications)

## 📞 Support

For technical support or questions:

- Create an issue in the repository
- Contact: [your-email@domain.com]
- Documentation: [project-docs-url]

---

**Built with ❤️ for the Beckn Agriculture Network** 