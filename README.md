# Smartlead MCP Server

A Model Context Protocol (MCP) server for Smartlead integration. This server provides tools for managing various aspects of your Smartlead account, including campaigns, leads, statistics, and smart delivery.

## Features

- **Campaign Management**: Create, update, and manage email campaigns and sequences
- **Lead Management**: Add, update, and track leads in your campaigns
- **Statistics**: Fetch and analyze campaign performance metrics
- **Smart Delivery**: Optimize email delivery for better engagement (coming soon)

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

### Standalone Usage

To start the server directly:

```bash
npm start
```

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

## Configuration

The server can be configured using environment variables:

- `SMARTLEAD_API_KEY` (required): Your Smartlead API key
- `SMARTLEAD_API_URL` (optional): Custom API URL (defaults to https://server.smartlead.ai/api/v1)
- `SMARTLEAD_RETRY_MAX_ATTEMPTS`: Maximum retry attempts for API calls (default: 3)
- `SMARTLEAD_RETRY_INITIAL_DELAY`: Initial delay in milliseconds for retries (default: 1000)
- `SMARTLEAD_RETRY_MAX_DELAY`: Maximum delay in milliseconds for retries (default: 10000)
- `SMARTLEAD_RETRY_BACKOFF_FACTOR`: Backoff factor for retry delays (default: 2)

## Available Tool Categories

The server provides tools in the following categories:

### Campaign Management
Tools for creating and managing email campaigns, schedules, and sequences

### Lead Management
Tools for adding, updating, and managing leads across campaigns

### Statistics
Tools for retrieving and analyzing campaign performance metrics

### Smart Delivery
Tools for optimizing email delivery (coming soon)

## Enabling/Disabling Features

Features can be enabled or disabled in the `src/config/feature-config.ts` file. By default, only the statistics category is enabled.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
