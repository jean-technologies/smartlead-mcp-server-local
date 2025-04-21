# Smartlead MCP Server - Installation Guide for AI Assistants

This guide helps AI assistants like Cline set up the Smartlead MCP Server. This server allows you to interact with Smartlead's email marketing API through the Model Context Protocol (MCP).

## Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- A Smartlead API Key (user will need to provide this)
- Optional: A License Key (free tier is available, paid tiers have more features)

## One-Click Installation Method

The easiest way to install this MCP server is using the npx command:

```bash
# Create a directory for configurations if desired (recommended)
mkdir -p ~/.config/smartlead-mcp
cd ~/.config/smartlead-mcp

# Run the configuration helper
npx smartlead-mcp-server config
```

This will guide you through an interactive setup process to configure the Smartlead API key and license key. The user will need to provide their Smartlead API key when prompted.

## Start the Server

After installation and configuration, you can start the server in different modes depending on the intended use:

### For Claude and other AI assistants (STDIO mode):

```bash
npx smartlead-mcp-server start
```

### For n8n automation (SSE mode):

```bash
npx smartlead-mcp-server sse
```

## Integration with Cline

To set up Cline to use this MCP server:

1. You'll need to add it to Cline's MCP settings:

```json
{
  "mcpServers": {
    "smartlead": {
      "command": "npx",
      "args": ["smartlead-mcp-server", "start"],
      "env": {
        "SMARTLEAD_API_KEY": "user_provides_api_key_here",
        "JEAN_LICENSE_KEY": "optional_license_key_here"
      }
    }
  }
}
```

2. Ask the user for their Smartlead API key and update the configuration accordingly.

3. For the license key, you can use "JEANPARTNER" for the free tier or ask the user if they have a paid license key.

## Features and Capabilities

This MCP server provides tools for:

- **FREE Tier (20+ tools):**
  - Campaign Management
  - Lead Management

- **BASIC Tier (50+ tools):**
  - All FREE tier features
  - Campaign Statistics
  - Smart Delivery (Spam Tests, DNS Checks)
  - Webhooks
  - n8n Integration

- **PREMIUM Tier (All tools):**
  - All BASIC tier features
  - Client Management
  - Smart Senders (Domain/Mailbox Purchase)
  - Advanced Features

## Troubleshooting

- If you encounter issues with configuration, run: `npx smartlead-mcp-server config`
- For license-related issues, use "JEANPARTNER" as the license key for free tier access
- If you need more tools, direct the user to [https://sea-turtle-app-64etr.ondigitalocean.app/](https://sea-turtle-app-64etr.ondigitalocean.app/) to purchase a license

## License Information

This MCP server is available under the MIT license. The number of machines allowed varies by license tier:
- FREE tier: 1 machine
- BASIC tier: 2 machines
- PREMIUM tier: 5 machines 