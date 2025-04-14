#!/usr/bin/env node

import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// For request body parsing
app.use(express.json());

// Type for tracking server-transport pairs
type ConnectionData = {
  server: Server;
  transport: any; // Using any because we can't directly access private fields
  sessionId: string;
};

// Track active connections
const connections = new Map<string, ConnectionData>();

// Import server creator function from the index file
async function createMCPServer(): Promise<Server> {
  try {
    // Dynamic import to avoid circular dependencies
    const indexModule = await import('./index.js');
    if (typeof indexModule.createServer === 'function') {
      return indexModule.createServer();
    }
    throw new Error('createServer function not found in index.js');
  } catch (error: any) {
    console.error(`Error creating MCP server: ${error.message}`);
    throw error;
  }
}

// SSE endpoint for n8n connection
app.get('/sse', async (req, res) => {
  try {
    // Generate a unique session ID
    const sessionId = uuidv4();
    console.log(`New SSE connection request received`);
    
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    
    // Send initial event to keep connection alive
    res.write(`data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`);
    
    // Create a new MCP server for this connection
    const server = await createMCPServer();
    
    // Create transport for this connection
    // Note: We're using a workaround because SSEServerTransport normally manages its own HTTP handling
    // but here we need to integrate with our Express app
    const transport = new SSEServerTransport('', res);
    
    // Add error and close handlers
    transport.onerror = (error: Error) => {
      console.error(`[ERROR] SSE transport error: ${error.message}`);
    };
    
    transport.onclose = () => {
      console.log(`SSE connection closed: ${sessionId}`);
      connections.delete(sessionId);
    };
    
    // Store connection data
    connections.set(sessionId, { 
      server, 
      transport,
      sessionId 
    });
    
    console.log(`SSE connection established with sessionId: ${sessionId}`);
    
    // Connect server to transport
    try {
      await server.connect(transport);
    } catch (error: any) {
      console.error(`Error connecting server to transport: ${error.message}`);
      res.status(500).end();
      return;
    }
    
    // Handle client disconnect
    req.on('close', () => {
      console.log(`SSE connection closed: ${sessionId}`);
      connections.delete(sessionId);
    });
  } catch (error: any) {
    console.error(`Error handling SSE request: ${error.message}`);
    res.status(500).end();
  }
});

// Message endpoint for receiving JSON-RPC messages from clients
app.post('/message', async (req, res) => {
  try {
    // Get sessionId from query parameters for identifying which connection to use
    const sessionId = req.query.sessionId as string;
    
    if (!sessionId) {
      return res.status(400).json({ 
        jsonrpc: '2.0', 
        error: { code: -32602, message: 'Invalid params: sessionId is required' },
        id: null 
      });
    }
    
    const connection = connections.get(sessionId);
    if (!connection) {
      return res.status(404).json({ 
        jsonrpc: '2.0', 
        error: { code: -32602, message: 'Session not found' },
        id: null 
      });
    }
    
    // The message should be a JSON-RPC request
    const message = req.body;
    
    if (!message || typeof message !== 'object') {
      return res.status(400).json({ 
        jsonrpc: '2.0', 
        error: { code: -32600, message: 'Invalid request' },
        id: null 
      });
    }
    
    console.log(`Received message for session ${sessionId}:`, JSON.stringify(message));
    
    // For SSE transport, we need to manually push the message to the transport's response stream
    try {
      // Handle specific message types
      
      // Handle initialize request
      if (message.method === 'initialize') {
        // Send a server event with the initialization response
        const response = {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            serverInfo: { name: 'smartlead-mcp', version: '1.0.0' },
            capabilities: { 
              tools: { callTool: true, listTools: true },
              logging: { loggingMessage: true }
            },
            instructions: 'Smartlead MCP Server for accessing Smartlead API functionality',
            protocolVersion: '2024-11-05'
          }
        };
        
        // Send the response via SSE
        connection.transport.onerror = (err: Error) => console.error('SSE error:', err);
        
        // Write to the response stream directly
        const eventData = `data: ${JSON.stringify(response)}\n\n`;
        try {
          // Access the response object directly to write data
          const sseResponse = connection.transport as any;
          if (sseResponse && sseResponse.res && typeof sseResponse.res.write === 'function') {
            sseResponse.res.write(eventData);
          }
        } catch (err) {
          console.error('Failed to write to SSE stream:', err);
        }
        
        // Log the response
        console.log(`Sent initialize response for session ${sessionId}`);
        
        return res.status(200).json({ received: true });
      }
      
      // If this is a tools/list request, handle it
      if (message.method === 'tools/list') {
        // Import toolRegistry dynamically
        const { toolRegistry } = await import('./registry/tool-registry.js');
        
        // Create a response with the list of tools
        const response = {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            tools: toolRegistry.getEnabledTools()
          }
        };
        
        // Write to the response stream directly
        const eventData = `data: ${JSON.stringify(response)}\n\n`;
        try {
          const sseResponse = connection.transport as any;
          if (sseResponse && sseResponse.res && typeof sseResponse.res.write === 'function') {
            sseResponse.res.write(eventData);
          }
        } catch (err) {
          console.error('Failed to write to SSE stream:', err);
        }
        
        console.log(`Sent tools/list response for session ${sessionId}`);
        return res.status(200).json({ received: true });
      }
      
      // If this is a tools/call request, we need to call the tool and return the result
      if (message.method === 'tools/call') {
        console.log('Received tools/call request, forwarding to server');
        
        try {
          // Dynamic import toolRegistry and handlers
          const { toolRegistry } = await import('./index.js');
          const { handleCampaignTool } = await import('./handlers/campaign.js');
          const { handleLeadTool } = await import('./handlers/lead.js');
          const { handleStatisticsTool } = await import('./handlers/statistics.js');
          const { handleSmartDeliveryTool } = await import('./handlers/smartDelivery.js');
          const { handleWebhookTool } = await import('./handlers/webhooks.js');
          const { handleClientManagementTool } = await import('./handlers/clientManagement.js');
          const { handleSmartSendersTool } = await import('./handlers/smartSenders.js');
          
          // Process the tool call
          const { name, arguments: args = {} } = message.params;
          const toolResult = await processToolCall(name, args, toolRegistry, {
            handleCampaignTool,
            handleLeadTool,
            handleStatisticsTool,
            handleSmartDeliveryTool,
            handleWebhookTool,
            handleClientManagementTool,
            handleSmartSendersTool
          });
          
          // Create and send response
          const response = {
            jsonrpc: '2.0',
            id: message.id,
            result: toolResult
          };
          
          // Write to the response stream directly
          const eventData = `data: ${JSON.stringify(response)}\n\n`;
          try {
            const sseResponse = connection.transport as any;
            if (sseResponse && sseResponse.res && typeof sseResponse.res.write === 'function') {
              sseResponse.res.write(eventData);
            }
          } catch (err) {
            console.error('Failed to write to SSE stream:', err);
          }
          
          console.log(`Sent tools/call response for session ${sessionId}`);
          return res.status(200).json({ received: true });
        } catch (error: any) {
          console.error(`Error processing tool call: ${error.message}`);
          
          // Send error response
          const errorResponse = {
            jsonrpc: '2.0',
            id: message.id,
            error: {
              code: -32603,
              message: `Error processing tool call: ${error.message}`
            }
          };
          
          const eventData = `data: ${JSON.stringify(errorResponse)}\n\n`;
          try {
            const sseResponse = connection.transport as any;
            if (sseResponse && sseResponse.res && typeof sseResponse.res.write === 'function') {
              sseResponse.res.write(eventData);
            }
          } catch (err) {
            console.error('Failed to write error response to SSE stream:', err);
          }
          
          return res.status(200).json({ received: true });
        }
      }
      
      // For other message types, just acknowledge receipt
      return res.status(200).json({ received: true, message: 'Unhandled message type' });
    } catch (error: any) {
      console.error(`Error handling message: ${error.message}`);
      return res.status(500).json({ 
        jsonrpc: '2.0', 
        error: { code: -32603, message: `Internal error: ${error.message}` },
        id: message.id || null 
      });
    }
  } catch (error: any) {
    console.error(`Error in message endpoint: ${error.message}`);
    return res.status(500).json({ 
      jsonrpc: '2.0', 
      error: { code: -32603, message: 'Internal server error' },
      id: null 
    });
  }
});

// Process a tool call and return the result
async function processToolCall(
  toolName: string, 
  args: any, 
  toolRegistry: any,
  handlers: {
    handleCampaignTool: any,
    handleLeadTool: any,
    handleStatisticsTool: any,
    handleSmartDeliveryTool: any,
    handleWebhookTool: any,
    handleClientManagementTool: any,
    handleSmartSendersTool: any
  }
) {
  console.log(`Processing tool call: ${toolName}`);
  
  // Check if the tool exists and is enabled
  if (!toolRegistry.hasToolWithName(toolName)) {
    throw new Error(`Tool not found or not enabled: ${toolName}`);
  }
  
  const tool = toolRegistry.getToolWithName(toolName);
  
  // Determine handler based on tool category
  switch (tool.category) {
    case 'Campaign Management':
      return await handlers.handleCampaignTool(toolName, args);
    case 'Lead Management':
      return await handlers.handleLeadTool(toolName, args);
    case 'Campaign Statistics':
      return await handlers.handleStatisticsTool(toolName, args);
    case 'Smart Delivery':
      return await handlers.handleSmartDeliveryTool(toolName, args);
    case 'Webhooks':
      return await handlers.handleWebhookTool(toolName, args);
    case 'Client Management':
      return await handlers.handleClientManagementTool(toolName, args);
    case 'Smart Senders':
      return await handlers.handleSmartSendersTool(toolName, args);
    default:
      throw new Error(`No handler for tool category: ${tool.category}`);
  }
}

// Start the server
function startServer() {
  app.listen(PORT, () => {
    console.log(`Smartlead MCP SSE Server is running on port ${PORT}`);
    console.log(`SSE endpoint available at: http://localhost:${PORT}/sse`);
  });
}

// Only start if this is the main module (not imported)
if (import.meta.url === new URL(import.meta.url).href) {
  startServer();
} 