#!/bin/bash

# Set environment variables
export CORS_ORIGIN="*"
export PORT=3000

# Check if the directory exists
if [ ! -d "./dist" ]; then
  echo "Building project..."
  npm run build
fi

# Start the SSE server
echo "Starting Smartlead MCP Server in n8n-compatible mode..."
node dist/sse-server.js 