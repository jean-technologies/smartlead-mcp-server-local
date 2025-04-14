# Smartlead MCP Server

A Model Context Protocol (MCP) server for Smartlead integration. This server provides tools for managing various aspects of your Smartlead account, including campaigns, leads, statistics, smart delivery, webhooks, client management, and smart senders.

## Features

- **Campaign Management**: Create, update, and manage email campaigns and sequences
- **Lead Management**: Add, update, and track leads in your campaigns
- **Statistics**: Fetch and analyze campaign performance metrics
- **Smart Delivery**: Optimize email delivery with spam test automation, reporting, and analytics
- **Webhooks**: Manage webhook integrations with external services
- **Client Management**: Manage clients and their permissions
- **Smart Senders**: Seamlessly search, generate, and purchase domains and mailboxes for email campaigns
- **Supergateway Integration**: Streamlined integration with n8n using Supergateway

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and add your Smartlead API key:

```
SMARTLEAD_API_KEY=your_api_key_here
```

4. Build the project:

```bash
npm run build
```

## Usage

### Server Operation Modes

The server can be run in the following modes:

#### Standard Mode (STDIO)

For Claude or other AI assistants using STDIO communication:

```bash
npm start
```

#### n8n Integration via Supergateway

For integrating with n8n (recommended approach):

```bash
# Start the server with Supergateway
npx -y supergateway --stdio "USE_SUPERGATEWAY=true SUPERGATEWAY_API_KEY=test_key node dist/index.js" --port 3001

# For more detailed logs, use:
DEBUG=* npx -y supergateway --stdio "USE_SUPERGATEWAY=true SUPERGATEWAY_API_KEY=test_key node dist/index.js" --port 3001
```

Note: If you notice connection instability issues with n8n, check the Troubleshooting section in [docs/N8N-INTEGRATION.md](docs/N8N-INTEGRATION.md).

### Integration with Claude or Other MCP Clients

To use this MCP server with Claude or other MCP clients, you need to add it to the appropriate MCP settings file:

1. For Claude VSCode extension, add it to `c:\Users\<username>\AppData\Roaming\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
2. For Claude desktop app, add it to `%APPDATA%\Claude\claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS

Example configuration:

```json
{
  "mcpServers": {
    "smartlead": {
      "command": "node",
      "args": ["path/to/smartlead-mcp-server/dist/index.js"],
      "env": {
        "SMARTLEAD_API_KEY": "your_api_key_here"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Replace `your_api_key_here` with your actual Smartlead API key and update the path to match your installation.

### Integration with n8n

For n8n integration using Supergateway:

1. Start the server with Supergateway:
```bash
npx -y supergateway --stdio "USE_SUPERGATEWAY=true SUPERGATEWAY_API_KEY=test_key node dist/index.js" --port 3001
```

2. In n8n, add an MCP Client node and configure it to connect to:
```
http://localhost:3001/sse
```

If you need to expose your local server to the internet, you can use a tool like ngrok:

```bash
ngrok http 3001
```

Then use the provided ngrok URL with the /sse endpoint in your n8n workflow.

**For detailed n8n integration instructions, examples, and troubleshooting, see [docs/N8N-INTEGRATION.md](docs/N8N-INTEGRATION.md).**

## Configuration

The server can be configured using environment variables:

### Required Environment Variables
- `SMARTLEAD_API_KEY`: Your Smartlead API key

### Optional Configuration
- `SMARTLEAD_API_URL`: Custom API URL (defaults to https://server.smartlead.ai/api/v1)
- `SMARTLEAD_RETRY_MAX_ATTEMPTS`: Maximum retry attempts for API calls (default: 3)
- `SMARTLEAD_RETRY_INITIAL_DELAY`: Initial delay in milliseconds for retries (default: 1000)
- `SMARTLEAD_RETRY_MAX_DELAY`: Maximum delay in milliseconds for retries (default: 10000)
- `SMARTLEAD_RETRY_BACKOFF_FACTOR`: Backoff factor for retry delays (default: 2)

## Available Tool Categories

The server provides tools in the following categories:

### Campaign Management
Tools for creating and managing email campaigns, schedules, and sequences.

### Lead Management
Tools for adding, updating, and managing leads across campaigns.

### Statistics
Tools for retrieving and analyzing campaign performance metrics.

### Smart Delivery
Tools for optimizing email delivery through sophisticated spam testing, including:
- Creating manual and automated placement tests
- Retrieving regional and provider-wise reports
- Analyzing spam filter effectiveness
- Checking DKIM, SPF, and rDNS settings
- Managing folders and test organization
- Retrieving detailed content and header analysis

### Webhooks
Tools for managing webhook integrations with external services, allowing for real-time event handling.

### Client Management
Tools for managing clients and their access permissions within your Smartlead account.

### Smart Senders
Tools for streamlining email infrastructure setup, including:
- Retrieving available domain vendors
- Searching for available domains under $15
- Auto-generating mailbox suggestions based on personal details
- Placing orders for domains and mailboxes
- Retrieving lists of purchased domains

## Special API Endpoints

Note that while most API endpoints use the standard Smartlead API URL (https://server.smartlead.ai/api/v1), the Smart Senders category uses a different base URL:

```
https://smart-senders.smartlead.ai/api/v1
```

This is handled automatically by the server when making requests to Smart Senders endpoints.

## Enabling/Disabling Features

Features can be enabled or disabled in the `src/config/feature-config.ts` file. By default, all categories are enabled. You can disable specific categories by modifying the configuration file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
