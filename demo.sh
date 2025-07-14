#!/bin/bash

# Beckn Agriculture API Demo Script
# This script demonstrates the working features of the database-driven Beckn API

echo "🌾 Beckn Agriculture Marketplace API Demo"
echo "==========================================="
echo

# Check if server is running
echo "1. Checking server health..."
curl -s http://localhost:3000/health | jq '.'
echo

echo "2. Listing agriculture categories..."
curl -s http://localhost:3000/categories | jq '.categories[] | {id: .id, name: .name, type: .type}'
echo

echo "3. Testing Beckn-formatted search for tomatoes..."
curl -s -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{
    "context": {
      "domain": "agriculture",
      "action": "search",
      "version": "1.1.0",
      "bap_id": "kenpath-agriculture-bap",
      "transaction_id": "demo-001",
      "message_id": "msg-001"
    },
    "message": {
      "intent": {
        "item": {"descriptor": {"name": "tomato"}},
        "category": {"descriptor": {"code": "VEGETABLES"}},
        "fulfillment": {"end": {"location": {"city": "Bharuch"}}}
      }
    }
  }' | jq '.'
echo

echo "4. Getting providers in Bharuch, Gujarat..."
curl -s "http://localhost:3000/providers/Bharuch?state=Gujarat" | jq '.providers[] | {name: .name, specialization: .specialization, rating: .rating}'
echo

echo "5. Getting details of organic tomatoes..."
curl -s "http://localhost:3000/item/PROD_001?type=product" | jq '.item | {name: .name, price: .price, unit: .unit, provider: .provider_name, organic: .organic}'
echo

echo "6. Getting details of consultation service..."
curl -s "http://localhost:3000/item/SERV_001?type=service" | jq '.item | {name: .name, price: .price, unit: .unit, provider: .provider_name, duration: .duration_hours}'
echo

echo "7. Searching for services in Equipment Rental category..."
curl -s http://localhost:3000/categories?type=service | jq '.categories[] | select(.id == "EQUIPMENT_RENTAL")'
echo

echo "8. Database statistics..."
echo "Categories:" $(sqlite3 database.sqlite "SELECT COUNT(*) FROM categories;")
echo "Farmers:" $(sqlite3 database.sqlite "SELECT COUNT(*) FROM farmers;")
echo "Products:" $(sqlite3 database.sqlite "SELECT COUNT(*) FROM products;")
echo "Services:" $(sqlite3 database.sqlite "SELECT COUNT(*) FROM services;")
echo

echo "✅ Demo completed! The API is working with:"
echo "   • Dynamic database integration"
echo "   • Beckn protocol compliance"
echo "   • Agriculture domain taxonomy"
echo "   • Real-time search capabilities"
echo "   • Provider and product management"
echo

echo "📄 Check the Beckn Layer 2 configuration at: config/beckn-layer2-config.yaml"
echo "📚 Full documentation available in: README.md" 