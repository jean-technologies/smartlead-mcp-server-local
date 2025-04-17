# Smartlead Simplified MCP Server - Developer Onboarding Guide

## Welcome!

This guide will help you understand and set up the Smartlead Simplified MCP Server. Whether you're a new developer joining the team or just exploring the project, this document covers everything you need to know to get started.

## What is Smartlead MCP Server?

Smartlead MCP Server is a Multi-Channel Proxy that provides an organized interface to the Smartlead API. It implements the Model Context Protocol (MCP), allowing AI agents and other clients to work with Smartlead's email marketing and lead management features.

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- A Smartlead API Key
- A License Key (for BASIC or PREMIUM features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/smartlead-simplified.git
   cd smartlead-simplified
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your environment**
   Copy the example environment file and update it with your credentials:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to add your Smartlead API key and license information.

4. **Build the project**
   ```bash
   npm run build
   ```

## Running the Server

The server can run in different modes depending on your needs:

### Standard Mode (STDIO)

This is the default mode for direct communication with clients like Claude:

```bash
npm start
```

### Server-Sent Events Mode (SSE)

For web clients that communicate via HTTP:

```bash
npm run start:sse
```
This exposes:
- SSE endpoint: `http://localhost:3000/sse`
- Message endpoint: `http://localhost:3000/message`

### Supergateway Integration

For n8n integration and advanced use cases (requires BASIC or PREMIUM license):

```bash
npm run start:sse-supergateway
```

## License Tiers

The application supports three license tiers:

| Tier | Features | Tools |
|------|----------|-------|
| **FREE** | Basic campaign & lead management | 20+ tools |
| **BASIC** | + Analytics, Webhooks, Smart Delivery, n8n Integration | 50+ tools |
| **PREMIUM** | + Advanced Features, Higher Usage Limits | All tools |

## Project Structure

```
smartlead-simplified/
├── dist/               # Compiled JavaScript files
├── src/                # TypeScript source code
│   ├── config/         # Configuration files
│   ├── handlers/       # Tool implementation logic
│   ├── licensing/      # License validation system
│   ├── n8n/            # n8n integration components
│   ├── registry/       # Tool registry & management
│   ├── tools/          # Tool definitions by category
│   ├── types/          # TypeScript type definitions
│   ├── index.ts        # Main entry point
│   └── supergateway.ts # Supergateway integration
├── .env                # Environment variables
├── .env.example        # Example environment file
├── package.json        # Project dependencies
└── tsconfig.json       # TypeScript configuration
```

## Key Components

### 1. Server Core (`src/index.ts`)

The main entry point that sets up the MCP server, handles requests, and routes them to the appropriate handlers.

### 2. Licensing System (`src/licensing/index.ts`)

Manages license validation, feature access control, and communicates with the license server.

### 3. Tool Registry (`src/registry/tool-registry.ts`)

Maintains the registry of all available tools and their metadata.

### 4. Category-based Tools (`src/tools/`)

Tools are organized by functional categories:
- `campaign.js` - Campaign management
- `lead.js` - Lead management
- `statistics.js` - Analytics and reporting
- `smartDelivery.js` - Deliverability tools
- `webhooks.js` - Webhook integration
- And more...

### 5. Handlers (`src/handlers/`)

Contain the actual implementation logic for each tool, making API calls to Smartlead.

## License Validation Flow

1. Server starts up and attempts to validate the license
2. It contacts the license server at `LICENSE_SERVER_URL` 
3. Based on the response, it enables the appropriate feature set
4. For unavailable license servers, it validates key format and grants appropriate tier

### Secure Premium Features

Premium features employ an additional layer of security with server-side validation tokens:

1. When a premium tool is invoked, the server requests a secure validation token from the license server
2. This token is time-limited (typically 1 hour) and tied to the specific license key
3. The token includes a cryptographic signature that cannot be forged
4. For sensitive operations, the tool verifies this token with the license server before proceeding

This approach ensures that premium features cannot be accessed without a valid, paid license, even if the code is modified locally.

## Development Guidelines

### Adding New Tools

1. Define the tool in the appropriate category file in `src/tools/`
2. Implement the handler in the corresponding file in `src/handlers/`
3. Make sure to respect license tier restrictions
4. Register the tool in the registry by updating the tool registration in `src/index.ts`

### Testing Tools

Test your tools using the appropriate interface:

**STDIO Mode**:
```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "your_new_tool", "params": {}}' | npm start
```

**SSE Mode**:
```bash
# With curl
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "your_new_tool", "params": {}}'
```

## Troubleshooting

### Common Issues

1. **"License server unavailable"**
   - Check your internet connection
   - Verify `LICENSE_SERVER_URL` in `.env`
   - Contact license server administrator

2. **"Tool not found" errors**
   - Ensure the tool is properly registered
   - Check if the tool is available in your license tier
   - Verify tool name spelling

3. **Supergateway integration failures**
   - Ensure you have a BASIC or PREMIUM license
   - Check that `USE_SUPERGATEWAY=true` in your environment
   - Verify the `SUPERGATEWAY_API_KEY` is set

### Debugging

Enable more detailed logging by prefixing your command with `DEBUG=smartlead:*`:

```bash
DEBUG=smartlead:* npm start
```

## Best Practices

1. **License Management**:
   - Never hardcode license keys
   - Use proper environment variables
   - Handle license validation failures gracefully

2. **Error Handling**:
   - Always include proper error handling in tool implementations
   - Provide clear error messages to clients
   - Use the retry mechanism for transient errors

3. **Performance**:
   - Minimize unnecessary API calls
   - Use caching when appropriate
   - Monitor performance in production

## Additional Resources

- [Smartlead API Documentation](https://docs.smartlead.ai)
- [Model Context Protocol Specification](https://github.com/modelcontextprotocol/spec)
- [n8n Integration Guide](https://docs.n8n.io)

## Common Commands Reference

```bash
# Development
npm run dev              # Run with auto-rebuild
npm run build            # Compile TypeScript
npm run lint             # Check code style

# Runtime
npm start                # Run in STDIO mode
npm run start:sse        # Run with SSE interface
npm run start:supergateway  # Run with Supergateway (basic)
npm run start:sse-supergateway # Run with SSE + Supergateway (premium)

# Testing
npm test                 # Run all tests
npm run test:supergateway # Test Supergateway integration
``` 