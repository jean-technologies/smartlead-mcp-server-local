# Smartlead MCP Server - Developer Guide

## Overview

Smartlead MCP Server provides an organized interface to the Smartlead API using the Model Context Protocol (MCP), enabling AI assistants and automation tools to manage email marketing campaigns.

## Prerequisites

- Node.js (v18+)
- A Smartlead API Key
- A License Key ([Free or paid](https://sea-turtle-app-64etr.ondigitalocean.app/))

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
cp .env.example .env  # Then edit with your keys
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
      "SMARTLEAD_API_KEY": "your_api_key_here",
      "JEAN_LICENSE_KEY": "your_license_key_here"
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

## License Tiers

| Tier | Tools | Features |
|------|-------|----------|
| **FREE** | 20+ | Campaign & Lead Management |
| **BASIC** | 50+ | + Statistics, Smart Delivery, Webhooks, n8n |
| **PREMIUM** | All | + Client Management, Smart Senders, Advanced Features |

## Troubleshooting

### Common Solutions
- Configure settings: `npx smartlead-mcp-server config`
- Set keys directly: `npx smartlead-mcp-server sse --api-key=X --license-key=Y`
- Debug mode: `DEBUG=smartlead:* npx smartlead-mcp-server start`

### License Issues
- Free license promo code (use at checkout): `JEANPARTNER`
- Basic/Premium: Purchase at [license server](https://sea-turtle-app-64etr.ondigitalocean.app/)

## Resources

- [Smartlead API Docs](https://docs.smartlead.ai)
- [MCP Specification](https://github.com/modelcontextprotocol/spec)
- [n8n Integration Guide](https://docs.n8n.io) 