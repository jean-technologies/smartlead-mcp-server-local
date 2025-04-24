# Smartlead Simplified MCP Server

This application provides a simplified interface to the Smartlead API, allowing AI assistants and automation tools to interact with Smartlead's email marketing features.

**Licensing:** Features are enabled based on your license tier (Free, Basic, Premium). [Get a license here](https://sea-turtle-app-64etr.ondigitalocean.app/) or use the free version.

> **For developer details:** See [DEVELOPER_ONBOARDING.md](./DEVELOPER_ONBOARDING.md)

## Quick Start

### Installation
```bash
npm install smartlead-mcp-server@1.1.0

### With Claude:
```bash
npx smartlead-mcp-server start
```

### With n8n:
```bash
npx smartlead-mcp-server sse
```

First run will prompt for your Smartlead API Key and License Key.

## Integration Examples

### Claude Extension:
```json
{
  "mcpServers": {
    "smartlead": {
      "command": "npx",
      "args": ["smartlead-mcp-server", "start"],
      "env": {
        "SMARTLEAD_API_KEY": "your_api_key_here",
        "JEAN_LICENSE_KEY": "your_license_key_here"
      }
    }
  }
}
```

### n8n Setup:
1. Start the server: `npx smartlead-mcp-server sse`
2. Configure n8n MCP Client node with:
   - SSE URL: `http://localhost:3000/sse`
   - Message URL: `http://localhost:3000/message`

## Available Features

**FREE:** Campaign & Lead Management (20+ tools)

**BASIC:** + Statistics, Smart Delivery, Webhooks, n8n Integration (50+ tools)

**PREMIUM:** + Client Management, Smart Senders, Advanced Features (All tools)

## Need Help?

- Run `npx smartlead-mcp-server config` to set up credentials
- Use `--api-key` and `--license-key` options for non-interactive setup
- Contact: jonathan@jeantechnologies.com
- Website: [jeantechnologies.com](https://jeantechnologies.com)

## License

This software is proprietary and confidential. Unauthorized copying, redistribution, or use of this software, in whole or in part, via any medium, is strictly prohibited without the express permission of Jean Technologies.

Copyright © 2025 Jean Technologies. All rights reserved.