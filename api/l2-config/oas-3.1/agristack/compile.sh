#!/bin/bash

# AgriStack Layer 2 Configuration Compilation Script
# Based on Beckn ONIX Layer 2 compilation process

echo "=== AgriStack OAN Layer 2 Configuration Compilation ==="
echo ""

# Check if swagger-cli is installed
if ! command -v swagger-cli &> /dev/null; then
    echo "Installing swagger-cli..."
    npm install -g swagger-cli
fi

# Compile the Layer 2 configuration
echo "Compiling Layer 2 configuration..."
swagger-cli bundle template_agristack_1.1.0_openapi_3.1.yaml \
  --outfile agristack_1.1.0_openapi_3.1.yaml \
  --type yaml

# Check if compilation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully created agristack_1.1.0_openapi_3.1.yaml"
    echo ""
    echo "Layer 2 configuration is ready for use!"
    echo ""
    echo "To test the configuration:"
    echo "1. Start your API server"
    echo "2. Use the example JSON files in example-jsons/"
    echo "3. Test webhook with: ./test-webhook.sh"
else
    echo "❌ Compilation failed"
    exit 1
fi

echo ""
echo "=== Compilation Complete ==="