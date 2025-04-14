# Integrating Smartlead MCP Server with n8n

This document provides comprehensive instructions for integrating the Smartlead MCP Server with n8n for advanced automation workflows.

## Prerequisites

- Node.js v18 or later
- npm or yarn
- n8n installed (either locally or cloud version)

## Starting the MCP Server for n8n

The recommended approach for n8n integration is to use the Supergateway package, which provides reliable SSE communication:

```bash
# Using the npm script (recommended)
npm run start:n8n

# Or using the direct command with a custom port
npx -y supergateway --stdio "USE_SUPERGATEWAY=true SUPERGATEWAY_API_KEY=test_key node dist/index.js" --port 3001
```

### Verifying the Server is Running

When Supergateway starts successfully, you'll see output like:

```
[supergateway] Starting...
[supergateway] Supergateway is supported by Supermachine (hosted MCPs) - https://supermachine.ai
[supergateway]   - outputTransport: sse
[supergateway]   - port: 3001
[supergateway]   - stdio: USE_SUPERGATEWAY=true SUPERGATEWAY_API_KEY=test_key node dist/index.js
[supergateway]   - ssePath: /sse
[supergateway]   - messagePath: /message
[supergateway] Listening on port 3001
[supergateway] SSE endpoint: http://localhost:3001/sse
[supergateway] POST messages: http://localhost:3001/message
```

You can test the connection with curl:

```bash
curl -N http://localhost:3001/sse
```

Which should return:
```
event: endpoint
data: /message?sessionId=<some-session-id>
```

## Configuring n8n Connection

### Direct Local Connection

1. In your n8n workflow, add a new "Model Context Protocol Client" node
2. Set the connection mode to "HTTP"
3. Enter the server URL: `http://localhost:3001/sse`
4. Click "Test Connection" to verify connectivity

### Public Connection Using ngrok

For remote connections or when using n8n cloud:

1. Install ngrok if you haven't already:
   ```bash
   npm install -g ngrok
   ```

2. Start your MCP server using the command above

3. In a separate terminal, create a secure tunnel to your local server:
   ```bash
   ngrok http 3001
   ```

4. Copy the HTTPS URL provided by ngrok (e.g., `https://abc123.ngrok-free.app`)

5. In n8n, use this URL with the SSE endpoint:
   ```
   https://abc123.ngrok-free.app/sse
   ```

## Available Tools

By default, the following tool categories are enabled:
- Campaign Management
- Email Account Management
- Lead Management
- Campaign Statistics
- Smart Delivery
- Webhooks
- Client Management
- Smart Senders

To view all available tools and their schemas:

1. Add an "MCP Tool Execution" node to your workflow
2. Connect it to the MCP Client node
3. In the Tool Selection dropdown, you'll see all available tools

## Building a Basic Workflow

Example: List Campaigns workflow

1. Add a "Model Context Protocol Client" node and connect to your server
2. Add an "MCP Tool Execution" node
3. Select the "smartlead_list_campaigns" tool
4. Configure parameters (optional):
   - limit: 10 (to limit results)
5. Connect to a "Set" node to transform the data as needed
6. Test the workflow to see campaign data

## Example Workflow: Export Campaign Leads

1. Configure MCP Client node to connect to your server
2. Add MCP Tool Execution node
3. Select "smartlead_export_campaign_leads" tool
4. Configure parameters:
   - campaign_id: 12345 (replace with your actual campaign ID)
5. Connect to a "HTTP Request" node to download the exported file
6. Test the workflow

## Troubleshooting

### Connection Issues

If you're unable to connect:

1. **Check server status**: Ensure the MCP server is running and look for any error messages in the terminal

2. **Port conflicts**: If you see "address already in use" errors, try:
   ```bash
   # Find process using port 3001
   lsof -i :3001
   # Kill the process
   kill -9 <PID>
   # Or use a different port
   npx -y supergateway --stdio "USE_SUPERGATEWAY=true SUPERGATEWAY_API_KEY=test_key node dist/index.js" --port 3002
   ```

3. **API key issues**: Ensure your SMARTLEAD_API_KEY is properly set in the .env file:
   ```
   SMARTLEAD_API_KEY=your_api_key_here
   ```

4. **Supergateway issues**: If you see errors with Supergateway:
   - Make sure only one instance of the server is running
   - Check that the Supergateway package is installed
   - Verify there are no syntax errors in your commands
   - Look for "[supergateway]" prefixed logs for specific error messages

5. **Connection stability issues**: If you notice frequent disconnections or reconnections:
   - Make sure your ngrok tunnel remains stable
   - Try running Supergateway with the `DEBUG=*` environment variable to see more detailed logs:
     ```bash
     DEBUG=* npx -y supergateway --stdio "USE_SUPERGATEWAY=true SUPERGATEWAY_API_KEY=test_key node dist/index.js" --port 3001
     ```
   - If n8n repeatedly connects and disconnects, check your network stability
   - For production deployments, consider hosting both services on the same network

### Data Retrieval Issues

If tools aren't returning expected data:

1. **API limitations**: Some operations may be limited by your Smartlead account permissions
2. **Error messages**: Check the response content for error details
3. **Parameter validation**: Ensure you're providing valid parameters for each tool (like valid campaign_id values)

## Environment Variables

Create a `.env` file with:

```
# Required
SMARTLEAD_API_KEY=your_api_key_here

# Optional - Server configuration
SMARTLEAD_API_URL=https://server.smartlead.ai/api/v1
```

## Getting Help

If you encounter persistent issues:
1. Check the server logs for detailed error messages
2. Make sure your Smartlead API key is valid and has the necessary permissions
3. Read through this guide again to ensure all steps were followed 