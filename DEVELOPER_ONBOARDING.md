# Smartlead Simplified MCP Server - Developer Onboarding Guide

## What is Smartlead MCP Server?

Smartlead MCP Server is a Multi-Channel Proxy that provides an organized interface to the Smartlead API. It implements the Model Context Protocol (MCP), allowing AI agents and other clients to work with Smartlead's email marketing and lead management features.

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- A Smartlead API Key
- A License Key (purchase at: https://sea-turtle-app-64etr.ondigitalocean.app/)

## Quick Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/your-org/smartlead-simplified.git
   cd smartlead-simplified
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API key and license key
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## Two Main Usage Pathways

### Pathway 1: Claude Integration (STDIO Mode)

This is for using Smartlead tools directly with Claude and similar AI assistants:

1. **Configure Claude Settings**
   - In your Claude settings JSON, add:
   ```json
   {
     "mcp": {
       "name": "smartlead",
       "execute_path": "/path/to/your/smartlead-simplified/dist/index.js",
       "env": {
         "SMARTLEAD_API_KEY": "your_api_key_here",
         "LICENSE_SERVER_URL": "https://sea-turtle-app-64etr.ondigitalocean.app",
         "JEAN_LICENSE_KEY": "your_license_key_here"
       }
     }
   }
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Use with Claude**
   - Claude will now have access to all Smartlead tools allowed by your license tier.
   - Example: Ask Claude to "Create a new outreach campaign in Smartlead" or "Check deliverability metrics for my domain"

### Pathway 2: n8n Integration (SSE Mode)

This is for using Smartlead tools with n8n automation workflows:

1. **Start the server in SSE mode**
   ```bash
   npm run start:sse
   ```
   The server will run on port 3000 by default.

2. **Connect n8n to your server**

   **For local n8n setup (running on the same machine):**
   - Add an MCP node in your n8n workflow
   - Configure the node with:
     - SSE URL: `http://localhost:3000/sse`
     - Message URL: `http://localhost:3000/message`
   - That's it! No need for ngrok when both services are running locally.

   **For n8n cloud or remote n8n:**
   - Set up ngrok tunnel to make your local server accessible:
     ```bash
     npm install -g ngrok
     ngrok http 3000
     ```
   - This will provide a public URL like `https://xxxxxxx.ngrok.io`
   - Configure the MCP node with:
     - SSE URL: `https://xxxxxxx.ngrok.io/sse`
     - Message URL: `https://xxxxxxx.ngrok.io/message`

3. **Use in n8n workflows**
   - Now you can use Smartlead tools directly in your n8n workflows
   - All tools available to your license tier will appear in the MCP node's actions

## License Tiers

| Tier | Features | Tools |
|------|----------|-------|
| **FREE** | Basic campaign & lead management | 20+ tools |
| **BASIC** | + Analytics, Webhooks, Smart Delivery, n8n Integration | 50+ tools |
| **PREMIUM** | + Advanced Features, Higher Usage Limits | All tools |

## Troubleshooting

### Common Issues

1. **License validation issues**
   - Verify your license key is correct
   - Check internet connection
   - Ensure LICENSE_SERVER_URL is set correctly

2. **Connection problems with n8n**
   - For local setup: Make sure both servers are running and using the correct ports
   - For remote/cloud setup: Verify ngrok tunnel is running
   - Check that n8n is using the correct URLs
   - Make sure you have a BASIC or PREMIUM license for n8n integration

3. **Claude integration issues**
   - Verify the path to index.js is correct
   - Ensure environment variables are properly set
   - Check that the server is running in STDIO mode

### Debugging

Enable more detailed logging by prefixing your command with `DEBUG=smartlead:*`:

```bash
DEBUG=smartlead:* npm start
# or
DEBUG=smartlead:* npm run start:sse
```

## Additional Resources

- [Smartlead API Documentation](https://docs.smartlead.ai)
- [Model Context Protocol Specification](https://github.com/modelcontextprotocol/spec)
- [n8n Integration Guide](https://docs.n8n.io) 