#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  InitializeRequestSchema,
  InitializedNotificationSchema,
  ServerCapabilities
} from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

// Import our modular components
import { campaignTools } from './tools/campaign.js';
import { leadTools } from './tools/lead.js';
import { statisticsTools } from './tools/statistics.js';
import { smartDeliveryTools } from './tools/smartDelivery.js';
import { webhookTools } from './tools/webhooks.js';
import { clientManagementTools } from './tools/clientManagement.js';
import { smartSendersTools } from './tools/smartSenders.js';
import { handleCampaignTool } from './handlers/campaign.js';
import { handleLeadTool } from './handlers/lead.js';
import { handleStatisticsTool } from './handlers/statistics.js';
import { handleSmartDeliveryTool } from './handlers/smartDelivery.js';
import { handleWebhookTool } from './handlers/webhooks.js';
import { handleClientManagementTool } from './handlers/clientManagement.js';
import { handleSmartSendersTool } from './handlers/smartSenders.js';
import { enabledCategories } from './config/feature-config.js';
import { ToolCategory } from './types/common.js';
import { toolRegistry } from './registry/tool-registry.js';

dotenv.config();

// Define server capabilities
const serverCapabilities: ServerCapabilities = {
  tools: {
    callTool: true,
    listTools: true
  },
  logging: {
    loggingMessage: true
  }
};

// Server implementation
const server = new Server(
  {
    name: 'smartlead-mcp',
    version: '1.0.0',
  },
  {
    capabilities: serverCapabilities,
    instructions: 'Smartlead MCP Server for accessing Smartlead API functionality'
  }
);

// Get API key and URL from environment variables
const SMARTLEAD_API_KEY = process.env.SMARTLEAD_API_KEY;
const SMARTLEAD_API_URL = process.env.SMARTLEAD_API_URL || 'https://server.smartlead.ai/api/v1';

// Check if API key is provided
if (!SMARTLEAD_API_KEY) {
  console.error('Error: SMARTLEAD_API_KEY environment variable is required');
  process.exit(1);
}

// Configuration for retries and monitoring
const CONFIG = {
  retry: {
    maxAttempts: Number(process.env.SMARTLEAD_RETRY_MAX_ATTEMPTS) || 3,
    initialDelay: Number(process.env.SMARTLEAD_RETRY_INITIAL_DELAY) || 1000,
    maxDelay: Number(process.env.SMARTLEAD_RETRY_MAX_DELAY) || 10000,
    backoffFactor: Number(process.env.SMARTLEAD_RETRY_BACKOFF_FACTOR) || 2,
  },
};

// Initialize Axios instance for API requests
const apiClient: AxiosInstance = axios.create({
  baseURL: SMARTLEAD_API_URL,
  params: {
    api_key: SMARTLEAD_API_KEY,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to debug all outgoing API requests
apiClient.interceptors.request.use(function (config) {
  // Log request details
  console.log('[API Request]', { 
    method: config.method?.toUpperCase(),
    url: config.url,
    baseURL: config.baseURL,
    params: config.params,
    data: config.data,
    headers: config.headers
  });
  return config;
}, function (error) {
  console.error('[API Request Error]', error);
  return Promise.reject(error);
});

// Add response interceptor to debug all incoming API responses
apiClient.interceptors.response.use(function (response) {
  // Log successful response
  console.log('[API Response]', { 
    status: response.status, 
    statusText: response.statusText,
    data: response.data ? 'Data received' : 'No data',
    headers: response.headers
  });
  return response;
}, function (error) {
  // Log error response
  console.error('[API Response Error]', { 
    message: error.message,
    response: error.response ? {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    } : 'No response',
    request: error.request ? 'Request was made but no response' : 'No request was made'
  });
  return Promise.reject(error);
});

function safeLog(
  level:
    | 'error'
    | 'debug'
    | 'info'
    | 'notice'
    | 'warning'
    | 'critical'
    | 'alert'
    | 'emergency',
  data: any
): void {
  try {
    // Always log to stderr for now to avoid protocol interference
    const logMessage = typeof data === 'object' ? JSON.stringify(data) : data;
    console.error(`[${level}] ${logMessage}`);
    
    // Try to send via proper logging mechanism, but don't throw if it fails
    try {
      server.sendLoggingMessage({ level, data }).catch(e => {
        console.error(`Failed to send log via protocol: ${e.message}`);
      });
    } catch (e) {
      console.error(`Error in logging mechanism: ${e instanceof Error ? e.message : String(e)}`);
    }
  } catch (e) {
    // Last resort fallback if anything in the logging fails
    console.error(`[${level}] Failed to format log message: ${e instanceof Error ? e.message : String(e)}`);
    try {
      console.error(`Original data type: ${typeof data}`);
    } catch (_) {
      // Ignore any errors in the fallback logging
    }
  }
}

// Add utility function for delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Add retry logic with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  context: string,
  attempt = 1
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const isRateLimit =
      error instanceof Error &&
      (error.message.includes('rate limit') || error.message.includes('429'));

    if (isRateLimit && attempt < CONFIG.retry.maxAttempts) {
      const delayMs = Math.min(
        CONFIG.retry.initialDelay *
          Math.pow(CONFIG.retry.backoffFactor, attempt - 1),
        CONFIG.retry.maxDelay
      );

      safeLog('info', `Rate limit hit for ${context}. Attempt ${attempt}/${CONFIG.retry.maxAttempts}. Retrying in ${delayMs}ms`);

      await delay(delayMs);
      return withRetry(operation, context, attempt + 1);
    }

    throw error;
  }
}

// Register all available tools with the registry
function registerTools() {
  // Register campaign tools if enabled
  if (enabledCategories.campaignManagement) {
    toolRegistry.registerMany(campaignTools);
  }
  
  // Register lead management tools if enabled
  if (enabledCategories.leadManagement) {
    toolRegistry.registerMany(leadTools);
  }
  
  // Register campaign statistics tools if enabled
  if (enabledCategories.campaignStatistics) {
    toolRegistry.registerMany(statisticsTools);
  }
  
  // Register smart delivery tools if enabled
  if (enabledCategories.smartDelivery) {
    toolRegistry.registerMany(smartDeliveryTools);
  }
  
  // Register webhook tools if enabled
  if (enabledCategories.webhooks) {
    toolRegistry.registerMany(webhookTools);
  }
  
  // Register client management tools if enabled
  if (enabledCategories.clientManagement) {
    toolRegistry.registerMany(clientManagementTools);
  }
  
  // Register smart senders tools if enabled
  if (enabledCategories.smartSenders) {
    toolRegistry.registerMany(smartSendersTools);
  }
}

// Initialize the tool registry
registerTools();

// Handle listTools requests
server.setRequestHandler(ListToolsRequestSchema, async () => {
  safeLog('info', 'Handling listTools request');
  
  return {
    tools: toolRegistry.getEnabledTools()
  };
});

// Handle callTool requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  const timestamp = new Date().toISOString();
  safeLog('info', `[${timestamp}] Received request for tool: ${name}`);
  
  try {
    // Ensure the tool exists
    const tool = toolRegistry.getByName(name);
    if (!tool) {
      throw new Error(`Tool "${name}" not found`);
    }
    
    // Dispatch to the appropriate handler based on tool category
    switch (tool.category) {
      case ToolCategory.CAMPAIGN_MANAGEMENT:
        return await handleCampaignTool(name, args, apiClient, withRetry);
      case ToolCategory.LEAD_MANAGEMENT:
        return await handleLeadTool(name, args, apiClient, withRetry);
      case ToolCategory.CAMPAIGN_STATISTICS:
        return await handleStatisticsTool(name, args, apiClient, withRetry);
      case ToolCategory.SMART_DELIVERY:
        return await handleSmartDeliveryTool(name, args, apiClient, withRetry);
      case ToolCategory.WEBHOOKS:
        return await handleWebhookTool(name, args, apiClient, withRetry);
      case ToolCategory.CLIENT_MANAGEMENT:
        return await handleClientManagementTool(name, args, apiClient, withRetry);
      case ToolCategory.SMART_SENDERS:
        return await handleSmartSendersTool(name, args, apiClient, withRetry);
      default:
        throw new Error(`Unsupported tool category: ${tool.category}`);
    }
  } catch (error) {
    safeLog('error', `Error handling tool "${name}": ${error instanceof Error ? error.message : String(error)}`);
    
    return {
      content: [
        {
          type: 'text',
          text: `Error calling tool "${name}": ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  } finally {
    safeLog('info', 'Request completed in ' + (new Date().getTime() - new Date(timestamp).getTime()) + 'ms');
  }
});

// Handle initialization
server.setRequestHandler(InitializeRequestSchema, async (request) => {
  safeLog('info', `Handling initialize request from ${request.params.clientInfo?.name || 'unknown client'}`);
  
  // Log the initialize request for debugging
  safeLog('debug', `Initialize request received: ${JSON.stringify(request.params, null, 2)}`);
  
  // Send the initialized response
  const response = {
    serverInfo: {
      name: 'smartlead-mcp',
      version: '1.0.0'
    },
    capabilities: serverCapabilities,
    instructions: 'Smartlead MCP Server for accessing Smartlead API functionality',
    protocolVersion: request.params.protocolVersion
  };
  
  safeLog('debug', `Sending initialize response: ${JSON.stringify(response, null, 2)}`);
  
  return response;
});

// Handle the initialized notification
server.setNotificationHandler(InitializedNotificationSchema, async () => {
  safeLog('info', 'Client initialized - ready to handle requests');
  safeLog('debug', 'Received initialized notification from client');
});

// Initialize the server
async function initServer() {
  console.error('Initializing Smartlead MCP Server...');
  
  // Use stdio transport
  console.error('Running in stdio mode, logging will be directed to stderr');
  const transport = new StdioServerTransport();
  
  // Connect the server to the transport
  await server.connect(transport);
  
  safeLog('info', 'Smartlead MCP Server initialized successfully');
  safeLog('info', `Configuration: API URL: ${SMARTLEAD_API_URL}`);
  
  // Log enabled categories
  const enabledCategoriesArray = Object.entries(enabledCategories)
    .filter(([_, enabled]) => enabled)
    .map(([category]) => category);
  
  safeLog('info', `Enabled categories: ${enabledCategoriesArray.join(', ')}`);
  safeLog('info', `Enabled tools: ${toolRegistry.getEnabledTools().length}`);
  
  console.log('Smartlead MCP Server running on stdio');
}

// Initialize the server when this module is executed
initServer().catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});

// Export necessary components for other modules
export { enabledCategories, toolRegistry }; 