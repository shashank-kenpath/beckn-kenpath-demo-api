#!/bin/bash

# Test script for webhook endpoints with search functionality

echo "=== Testing Webhook Endpoints ==="
echo ""

# Test GET webhook with search
echo "1. Testing GET /webhook with search parameter:"
echo "curl -X GET 'http://localhost:3001/webhook?search=tomato&category=VEGETABLES&location=Mumbai'"
curl -X GET 'http://localhost:3001/webhook?search=tomato&category=VEGETABLES&location=Mumbai'
echo ""
echo ""

# Test POST webhook with search in body
echo "2. Testing POST /webhook with search in body:"
echo "curl -X POST 'http://localhost:3001/webhook' -H 'Content-Type: application/json' -d '{\"search\":\"organic\",\"category\":\"VEGETABLES\"}'"
curl -X POST 'http://localhost:3001/webhook' -H 'Content-Type: application/json' -d '{"search":"organic","category":"VEGETABLES"}'
echo ""
echo ""

# Test POST webhook with search in query
echo "3. Testing POST /webhook with search in query:"
echo "curl -X POST 'http://localhost:3001/webhook?search=apple' -H 'Content-Type: application/json' -d '{}'"
curl -X POST 'http://localhost:3001/webhook?search=apple' -H 'Content-Type: application/json' -d '{}'
echo ""
echo ""

# Test webhook without search (should return all items)
echo "4. Testing GET /webhook without search:"
echo "curl -X GET 'http://localhost:3001/webhook'"
curl -X GET 'http://localhost:3001/webhook'
echo ""
echo ""

# Test webhook with full Beckn context
echo "5. Testing POST /webhook with full Beckn context:"
echo "curl -X POST 'http://localhost:3001/webhook' -H 'Content-Type: application/json' -d '{\"context\":{\"domain\":\"agriculture\",\"action\":\"search\",\"message_id\":\"test-msg-123\",\"transaction_id\":\"test-txn-123\",\"bap_id\":\"test-bap\",\"bap_uri\":\"https://test-bap.com\"},\"search\":\"wheat\"}'"
curl -X POST 'http://localhost:3001/webhook' -H 'Content-Type: application/json' -d '{"context":{"domain":"agriculture","action":"search","message_id":"test-msg-123","transaction_id":"test-txn-123","bap_id":"test-bap","bap_uri":"https://test-bap.com"},"search":"wheat"}'
echo ""
echo ""

echo "=== All tests completed ==="