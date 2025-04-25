# Smartlead Simplified MCP Server

This application provides a simplified interface to the Smartlead API, allowing AI assistants and automation tools to interact with Smartlead's email marketing features. We welcome contribution from the community.

**Licensing:** All features are now enabled by default with maximum permissiveness! No license key required.

> **For developer details:** See [DEVELOPER_ONBOARDING.md](./DEVELOPER_ONBOARDING.md)

## Quick Start

### Installation
```bash
npm install smartlead-mcp-server@1.2.1
```

or use directly with npx (no installation needed):


### With Claude:
```bash
npx smartlead-mcp-server start
```

### With n8n:
```bash
npx smartlead-mcp-server sse
```

First run will prompt for your Smartlead API Key. No license key is required.

## Integration Examples

### Claude Extension:
```json
{
  "mcpServers": {
    "smartlead": {
      "command": "npx",
      "args": ["smartlead-mcp-server", "start"],
      "env": {
        "SMARTLEAD_API_KEY": "your_api_key_here"
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

**All features are now enabled by default, including:**
- Campaign & Lead Management
- Statistics and Analytics
- Smart Delivery & Webhooks
- n8n Integration
- Client Management
- Smart Senders
- Download Tracking and Analytics

## New Download Tracking Features

This release adds new download tracking capabilities:

### Download Campaign Data
Download campaign data with tracking using the `smartlead_download_campaign_data` tool:
```json
{
  "campaign_id": 12345,
  "download_type": "analytics", // "analytics", "leads", "sequence", "full_export"
  "format": "json", // "json" or "csv"
  "user_id": "optional-user-identifier"
}
```

### View Download Statistics
View download statistics using the `smartlead_view_download_statistics` tool:
```json
{
  "time_period": "all", // "all", "today", "week", "month"
  "group_by": "type" // "type", "format", "campaign", "date"
}
```

All downloads are tracked in `~/.smartlead-mcp/downloads.json` for analytics.

## Need Help?

- Run `npx smartlead-mcp-server config` to set up credentials
- Use `--api-key` option for non-interactive setup
- Contact: jonathan@jeantechnologies.com
- Website: [jeantechnologies.com](https://jeantechnologies.com)

## License

This software is proprietary and confidential. Unauthorized copying, redistribution, or use of this software, in whole or in part, via any medium, is strictly prohibited without the express permission of Jean Technologies.

Copyright © 2025 Jean Technologies. All rights reserved.