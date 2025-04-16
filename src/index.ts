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

// Import licensing system
import { validateLicense, trackUsage, isFeatureEnabled } from './licensing/index.js';

// Import Supergateway integration
import { createSupergateway } from './supergateway.js';

// Import our modular components
import { campaignTools } from './tools/campaign.js';
// import { emailTools } from './tools/email.js';
import { leadTools } from './tools/lead.js';
import { statisticsTools } from './tools/statistics.js';
import { smartDeliveryTools } from './tools/smartDelivery.js';
import { webhookTools } from './tools/webhooks.js';
import { clientManagementTools } from './tools/clientManagement.js';
import { smartSendersTools } from './tools/smartSenders.js';
import { handleCampaignTool } from './handlers/campaign.js';
// import { handleEmailTool } from './handlers/email.js';
import { handleLeadTool } from './handlers/lead.js';
import { handleStatisticsTool } from './handlers/statistics.js';
import { handleSmartDeliveryTool } from './handlers/smartDelivery.js';
import { handleWebhookTool } from './handlers/webhooks.js';
import { handleClientManagementTool } from './handlers/clientManagement.js';
import { handleSmartSendersTool } from './handlers/smartSenders.js';
import { enabledCategories, featureFlags } from './config/feature-config.js';
import { ToolCategory } from './types/common.js';
import { toolRegistry } from './registry/tool-registry.js';

console.log('Starting Smartlead MCP Server...');

dotenv.config();

// Check license on startup
(async () => {
  const licenseResult = await validateLicense();
  console.log(`License: ${licenseResult.message}`);
  console.log(`Tier: ${licenseResult.level}`);
  console.log(`Available categories: ${licenseResult.features.allowedCategories.join(', ')}`);
  
  // Set n8n integration flag based on license
  featureFlags.n8nIntegration = licenseResult.features.n8nIntegration;
})().catch(error => {
  console.error('License validation error:', error);
});

// Check if Supergateway integration is enabled
const useSupergateway = process.env.USE_SUPERGATEWAY === 'true';

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

let isStdioTransport = true;

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

      safeLog(
        'warning',
        `Rate limit hit for ${context}. Attempt ${attempt}/${CONFIG.retry.maxAttempts}. Retrying in ${delayMs}ms`
      );

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
  
  // Register email account tools if enabled
  // if (enabledCategories.emailAccountManagement) {
  //   toolRegistry.registerMany(emailTools);
  // }
  
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
  
  // Add more categories here as they are implemented
  // For example:
  // if (enabledCategories.emailAccountManagement) {
  //   toolRegistry.registerMany(emailAccountTools);
  // }
}

// Initialize the tool registry
registerTools();

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  safeLog('info', 'Handling listTools request');
  
  try {
    // Get license-filtered tools
    const tools = await toolRegistry.getEnabledToolsAsync();
    
    // Log license status and available tools count
    const license = await validateLicense();
    safeLog('info', `Listing ${tools.length} tools available in ${license.level} license tier`);
    
    return {
      tools: tools,
    };
  } catch (error) {
    // Fallback to sync method if async fails
    safeLog('warning', `License validation failed, using default tool list: ${error}`);
    return {
      tools: toolRegistry.getEnabledTools(),
    };
  }
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const startTime = Date.now();
  try {
    const { name, arguments: args } = request.params;

    // Log incoming request with timestamp
    safeLog(
      'info',
      `[${new Date().toISOString()}] Received request for tool: ${name}`
    );

    // Safe guard for undefined arguments
    const toolArgs = args || {};

    // Check if the tool exists in the registry
    if (!toolRegistry.hasToolWithName(name)) {
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }

    // Get the tool details to determine which handler to use
    const tool = toolRegistry.getByName(name);
    
    if (!tool) {
      return {
        content: [{ type: "text", text: `Tool ${name} not found in registry` }],
        isError: true,
      };
    }
    
    // Check license for tool access
    const licenseResult = await validateLicense();
    
    // Track usage for analytics and quota tracking
    await trackUsage(process.env.YOUR_SERVICE_API_KEY, name);
    
    // Check if this tool category is allowed by the license
    if (!licenseResult.features.allowedCategories.includes(tool.category)) {
      return {
        content: [{ 
          type: "text", 
          text: `Tool ${name} is not available in your current license tier (${licenseResult.level}). Please upgrade to access this feature.` 
        }],
        isError: true,
      };
    }
    
    // Check for usage quota limits
    if (licenseResult.usageCount >= licenseResult.features.maxRequests && licenseResult.level !== 'premium') {
      return {
        content: [{ 
          type: "text", 
          text: `You have reached your monthly usage quota (${licenseResult.features.maxRequests} requests). Please upgrade your plan to continue using this service.` 
        }],
        isError: true,
      };
    }

    // Call the appropriate handler based on tool category
    switch (tool.category) {
      case ToolCategory.CAMPAIGN_MANAGEMENT:
        return await handleCampaignTool(name, toolArgs, apiClient, withRetry);
      // case ToolCategory.EMAIL_ACCOUNT_MANAGEMENT:
      //   return await handleEmailTool(name, toolArgs, apiClient, withRetry);
      case ToolCategory.LEAD_MANAGEMENT:
        return await handleLeadTool(name, toolArgs, apiClient, withRetry);
      case ToolCategory.CAMPAIGN_STATISTICS:
        return await handleStatisticsTool(name, toolArgs, apiClient, withRetry);
      case ToolCategory.SMART_DELIVERY:
        return await handleSmartDeliveryTool(name, toolArgs, apiClient, withRetry);
      case ToolCategory.WEBHOOKS:
        return await handleWebhookTool(name, toolArgs, apiClient, withRetry);
      case ToolCategory.CLIENT_MANAGEMENT:
        return await handleClientManagementTool(name, toolArgs, apiClient, withRetry);
      case ToolCategory.SMART_SENDERS:
        return await handleSmartSendersTool(name, toolArgs, apiClient, withRetry);
      default:
        return {
          content: [{ type: "text", text: `Unsupported tool category: ${tool.category}` }],
          isError: true,
        };
    }
  } catch (error) {
    // Log detailed error information
    safeLog('error', {
      message: `Request failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      tool: request.params.name,
      arguments: request.params.arguments,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
    });
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  } finally {
    // Log request completion with performance metrics
    safeLog('info', `Request completed in ${Date.now() - startTime}ms`);
  }
});

// Initialize handler (part of the protocol)
server.setRequestHandler(InitializeRequestSchema, async (request) => {
  safeLog('info', `Handling initialize request from ${request.params.clientInfo?.name || 'unknown client'}`);
  console.error(`[DEBUG] Initialize request received: ${JSON.stringify(request.params, null, 2)}`);
  
  // Respond with our server info and capabilities
  const response = {
    serverInfo: {
      name: 'smartlead-mcp',
      version: '1.0.0',
    },
    capabilities: serverCapabilities,
    instructions: 'Smartlead MCP Server for accessing Smartlead API functionality',
    protocolVersion: request.params.protocolVersion || '2024-11-05'
  };
  
  console.error(`[DEBUG] Sending initialize response: ${JSON.stringify(response, null, 2)}`);
  return response;
});

// Initialized notification (part of the protocol)
server.setNotificationHandler(InitializedNotificationSchema, () => {
  safeLog('info', 'Client initialized - ready to handle requests');
  console.error('[DEBUG] Received initialized notification from client');
});

// Server startup
async function runServer() {
  try {
    console.error('Initializing Smartlead MCP Server...');

    // Check if we're trying to use n8n integration
    const usingN8nMode = process.env.USE_SUPERGATEWAY === 'true' || process.argv.includes('--sse');
    
    if (usingN8nMode) {
      // Check license for n8n integration permission
      const licenseResult = await validateLicense();
      
      if (!licenseResult.features.n8nIntegration) {
        console.error('=============================================================');
        console.error('ERROR: Your license does not include n8n integration features');
        console.error('This feature requires a Premium license subscription.');
        console.error('Visit https://yourservice.com/pricing to upgrade your plan.');
        console.error('=============================================================');
        process.exit(1);
      } else {
        console.error('n8n integration enabled - Premium license detected');
      }
    }

    // Use standard stdio transport directly
    const transport = new StdioServerTransport();
    
    console.error('Running in stdio mode, logging will be directed to stderr');

    // Set up error handling
    process.on('uncaughtException', (error) => {
      console.error(`[FATAL] Uncaught exception: ${error.message}`);
      console.error(error.stack);
      // Don't exit - just log the error
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error(`[FATAL] Unhandled promise rejection: ${reason}`);
      // Don't exit - just log the error
    });

    // Add transport error handler
    transport.onerror = (error) => {
      console.error(`[ERROR] Transport error: ${error.message}`);
    };

    // Connect to the transport
    await server.connect(transport);

    // Set onclose handler
    transport.onclose = () => {
      console.error('[INFO] Transport was closed. This should only happen when the process is shutting down.');
    };

    // Now that we're connected, we can send logging messages
    safeLog('info', 'Smartlead MCP Server initialized successfully');
    safeLog(
      'info',
      `Configuration: API URL: ${SMARTLEAD_API_URL}`
    );
    
    // Log license information
    const licenseInfo = await validateLicense();
    safeLog('info', `License tier: ${licenseInfo.level} - ${licenseInfo.message}`);
    
    // Log which categories are enabled
    const enabledCats = licenseInfo.features.allowedCategories.join(', ');
    safeLog('info', `Enabled categories: ${enabledCats}`);
    
    // Log the number of enabled tools
    const enabledToolsCount = toolRegistry.getEnabledTools().length;
    safeLog('info', `Enabled tools: ${enabledToolsCount}`);

    console.error('Smartlead MCP Server running on stdio');
    
    // Keep the process running
    process.stdin.resume();
  } catch (error) {
    console.error('Fatal error running server:', error);
    process.exit(1);
  }
}

runServer().catch((error: any) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
}); 