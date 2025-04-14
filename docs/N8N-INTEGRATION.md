# Integrating with n8n

This document provides instructions for integrating the Smartlead MCP Server with n8n.

## Prerequisites

- Node.js v18 or later
- npm or yarn
- n8n installed (either locally or cloud version)

## Starting the MCP Server for n8n

To start the MCP server in a mode compatible with n8n, use one of the following methods:

### Method 1: Using npm scripts

```bash
npm run dev:n8n
```

This will build the project and start the server in n8n-compatible mode on port 3000.

### Method 2: Using the shell script

```bash
chmod +x scripts/start-n8n-compatible.sh
./scripts/start-n8n-compatible.sh
```

## Connecting from n8n

1. In your n8n workflow, add a new "Model Context Protocol Client" node
2. Set the connection mode to "HTTP" 
3. Enter the server URL as `http://localhost:3000/sse`
4. If you're using a public URL via ngrok or similar, use that URL instead

## Troubleshooting

### CORS Issues

If you encounter CORS issues, make sure the `CORS_ORIGIN` environment variable is set properly:

```bash
CORS_ORIGIN="*" npm run start:n8n
```

Or for specific domains:

```bash
CORS_ORIGIN="https://your-n8n-domain.com" npm run start:n8n
```

### Connection Timeouts

If connections are timing out:

1. Check that your server is running and accessible
2. Ensure no firewalls are blocking the connection
3. Try using a tool like ngrok to expose your local server:

```bash
ngrok http 3000
```

Then use the ngrok URL in n8n.

## Using Tools from n8n

Once connected, you can use the "MCP Tool Execution" node in n8n to call any of the tools provided by the Smartlead MCP server. 

Example workflow:

1. Start with a trigger node (HTTP Request, Schedule, etc.)
2. Connect to "MCP Tool Execution" node
3. Select the tool you want to use (e.g., "list_campaigns")
4. Configure the tool parameters
5. Connect to subsequent nodes to process the results 