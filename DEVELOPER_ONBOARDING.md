# Smartlead MCP Server - Developer Guide

## Overview

Smartlead MCP Server provides an organized interface to the Smartlead API using the Model Context Protocol (MCP), enabling AI assistants and automation tools to manage email marketing campaigns.

## Prerequisites

- Node.js (v18+)
- A Smartlead API Key

## Quick Start Options

### Option 1: Use npx (Recommended)

```bash
# For Claude
npx smartlead-mcp-server start

# For n8n
npx smartlead-mcp-server sse
```

### Option 2: Development Setup

```bash
# Clone and install
git clone https://github.com/jean-technologies/smartlead-mcp-server-local.git
cd smartlead-mcp-server-local
npm install

# Configure and build
cp .env.example .env  # Then edit with your API key
npm run build

# Run
npm start  # For Claude
# OR
npm run start:sse  # For n8n
```

## Two Integration Pathways

### 1. Claude Integration

Add to Claude settings JSON:
```json
{
  "mcp": {
    "name": "smartlead",
    "command": "npx",
    "args": ["smartlead-mcp-server", "start"],
    "env": {
      "SMARTLEAD_API_KEY": "your_api_key_here"
    }
  }
}
```

### 2. n8n Integration

#### Local n8n:
1. Run server: `npx smartlead-mcp-server sse`
2. Configure n8n MCP node with:
   - SSE URL: `http://localhost:3000/sse`
   - Message URL: `http://localhost:3000/message`

#### n8n Cloud:
1. Run server: `npx smartlead-mcp-server sse`
2. Create tunnel: `npx ngrok http 3000`
3. Use ngrok URL in n8n MCP node

## Available Features

All features are now enabled by default, including:
- Campaign & Lead Management
- Statistics and Analytics
- Smart Delivery & Webhooks
- n8n Integration
- Client Management
- Smart Senders
- Download Tracking and Analytics

## Download Tracking System

### Implementation Details

The download tracking system stores records in `~/.smartlead-mcp/downloads.json` with the following structure:

```json
{
  "downloads": [
    {
      "id": "unique-download-id",
      "timestamp": "2023-06-15T12:34:56.789Z",
      "campaignId": 12345,
      "downloadType": "analytics",
      "format": "json",
      "userId": "optional-user-id",
      "machineId": "machine-identifier"
    }
  ]
}
```

### Available Tools

1. **Download Campaign Data**: `smartlead_download_campaign_data`
   - Fetches data from Smartlead API
   - Converts to CSV if requested
   - Automatically tracks download details

2. **View Download Statistics**: `smartlead_view_download_statistics`
   - Filter by time period (all, today, week, month)
   - Group by various dimensions (type, format, campaign, date)
   - Get usage insights and recent downloads

## Troubleshooting

### Common Solutions
- Configure settings: `npx smartlead-mcp-server config`
- Set API key directly: `npx smartlead-mcp-server sse --api-key=YOUR_API_KEY`
- Debug mode: `DEBUG=smartlead:* npx smartlead-mcp-server start`

## Resources

- [Smartlead API Docs](https://docs.smartlead.ai)
- [MCP Specification](https://github.com/modelcontextprotocol/spec)
- [n8n Integration Guide](https://docs.n8n.io) 