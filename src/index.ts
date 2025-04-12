#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  Tool,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Tool definitions
const CREATE_CAMPAIGN_TOOL: Tool = {
  name: 'smartlead_create_campaign',
  description: 'Create a new campaign in Smartlead.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the campaign',
      },
      client_id: {
        type: 'number',
        description: 'Client ID for the campaign',
      },
    },
    required: ['name'],
  },
};

const UPDATE_CAMPAIGN_SCHEDULE_TOOL: Tool = {
  name: 'smartlead_update_campaign_schedule',
  description: 'Update a campaign\'s schedule settings.',
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to update',
      },
      timezone: {
        type: 'string',
        description: 'Timezone for the campaign (e.g., "America/Los_Angeles")',
      },
      days_of_the_week: {
        type: 'array',
        items: { type: 'number' },
        description: 'Days of the week to send emails (1-7, where 1 is Monday)',
      },
      start_hour: {
        type: 'string',
        description: 'Start hour in 24-hour format (e.g., "09:00")',
      },
      end_hour: {
        type: 'string',
        description: 'End hour in 24-hour format (e.g., "17:00")',
      },
      min_time_btw_emails: {
        type: 'number',
        description: 'Minimum time between emails in minutes',
      },
      max_new_leads_per_day: {
        type: 'number',
        description: 'Maximum number of new leads per day',
      },
      schedule_start_time: {
        type: 'string',
        description: 'Schedule start time in ISO format',
      },
    },
    required: ['campaign_id'],
  },
};

const UPDATE_CAMPAIGN_SETTINGS_TOOL: Tool = {
  name: 'smartlead_update_campaign_settings',
  description: 'Update a campaign\'s general settings.',
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to update',
      },
      name: {
        type: 'string',
        description: 'New name for the campaign',
      },
      status: {
        type: 'string',
        enum: ['active', 'paused', 'completed'],
        description: 'Status of the campaign',
      },
      settings: {
        type: 'object',
        description: 'Additional campaign settings',
      },
    },
    required: ['campaign_id'],
  },
};

const UPDATE_CAMPAIGN_STATUS_TOOL: Tool = {
  name: 'smartlead_update_campaign_status',
  description: 'Update the status of a campaign. Use this specifically for changing a campaign\'s status.',
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to update the status for',
      },
      status: {
        type: 'string',
        enum: ['PAUSED', 'STOPPED', 'START'],
        description: 'New status for the campaign (must be in uppercase)',
      },
    },
    required: ['campaign_id', 'status'],
  },
};

const GET_CAMPAIGN_TOOL: Tool = {
  name: 'smartlead_get_campaign',
  description: 'Get details of a specific campaign by ID.',
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to retrieve',
      },
    },
    required: ['campaign_id'],
  },
};

const LIST_CAMPAIGNS_TOOL: Tool = {
  name: 'smartlead_list_campaigns',
  description: 'List all campaigns with optional filtering.',
  inputSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['active', 'paused', 'completed'],
        description: 'Filter campaigns by status',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of campaigns to return',
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination',
      },
    },
  },
};

const SAVE_CAMPAIGN_SEQUENCE_TOOL: Tool = {
  name: 'smartlead_save_campaign_sequence',
  description: 'Save a sequence of emails for a campaign.',
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign',
      },
      sequence: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            seq_number: {
              type: 'number',
              description: 'The sequence number (order) of this email',
            },
            seq_delay_details: {
              type: 'object',
              properties: {
                delay_in_days: {
                  type: 'number',
                  description: 'Days to wait before sending this email',
                }
              },
              description: 'Delay details for this sequence'
            },
            variant_distribution_type: {
              type: 'string',
              enum: ['MANUAL_EQUAL', 'MANUAL_PERCENTAGE', 'AI_EQUAL'],
              description: 'How to distribute variants'
            },
            lead_distribution_percentage: {
              type: 'number',
              description: 'What sample % size of the lead pool to use to find the winner (for AI_EQUAL)'
            },
            winning_metric_property: {
              type: 'string',
              enum: ['OPEN_RATE', 'CLICK_RATE', 'REPLY_RATE', 'POSITIVE_REPLY_RATE'],
              description: 'Metric to use for determining the winning variant (for AI_EQUAL)'
            },
            seq_variants: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  subject: {
                    type: 'string',
                    description: 'Email subject line',
                  },
                  email_body: {
                    type: 'string',
                    description: 'Email body content in HTML',
                  },
                  variant_label: {
                    type: 'string',
                    description: 'Label for this variant (A, B, C, etc.)',
                  },
                  variant_distribution_percentage: {
                    type: 'number',
                    description: 'Percentage of leads to receive this variant (for MANUAL_PERCENTAGE)'
                  }
                },
                required: ['subject', 'email_body', 'variant_label'],
              },
              description: 'Variants of the email in this sequence'
            }
          },
          required: ['seq_number', 'seq_delay_details', 'variant_distribution_type', 'seq_variants'],
        },
        description: 'Sequence of emails to send',
      },
    },
    required: ['campaign_id', 'sequence'],
  },
};

// Type definitions
interface CreateCampaignParams {
  name: string;
  client_id?: number;
}

interface UpdateCampaignScheduleParams {
  campaign_id: number;
  timezone?: string;
  days_of_the_week?: number[];
  start_hour?: string;
  end_hour?: string;
  min_time_btw_emails?: number;
  max_new_leads_per_day?: number;
  schedule_start_time?: string;
}

interface UpdateCampaignSettingsParams {
  campaign_id: number;
  name?: string;
  status?: 'active' | 'paused' | 'completed';
  settings?: Record<string, any>;
}

interface UpdateCampaignStatusParams {
  campaign_id: number;
  status: 'PAUSED' | 'STOPPED' | 'START';
}

interface GetCampaignParams {
  campaign_id: number;
}

interface ListCampaignsParams {
  status?: 'active' | 'paused' | 'completed';
  limit?: number;
  offset?: number;
}

interface SaveCampaignSequenceParams {
  campaign_id: number;
  sequence: Array<{
    seq_number: number;
    seq_delay_details: {
      delay_in_days: number;
    };
    variant_distribution_type: 'MANUAL_EQUAL' | 'MANUAL_PERCENTAGE' | 'AI_EQUAL';
    lead_distribution_percentage?: number;
    winning_metric_property?: 'OPEN_RATE' | 'CLICK_RATE' | 'REPLY_RATE' | 'POSITIVE_REPLY_RATE';
    seq_variants: Array<{
      subject: string;
      email_body: string;
      variant_label: string;
      id?: number;
      variant_distribution_percentage?: number;
    }>;
  }>;
}

// Type guards
function isCreateCampaignParams(args: unknown): args is CreateCampaignParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as { name: unknown }).name === 'string'
  );
}

function isUpdateCampaignScheduleParams(args: unknown): args is UpdateCampaignScheduleParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number'
  );
}

function isUpdateCampaignSettingsParams(args: unknown): args is UpdateCampaignSettingsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number'
  );
}

function isUpdateCampaignStatusParams(args: unknown): args is UpdateCampaignStatusParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number' &&
    'status' in args &&
    typeof (args as { status: unknown }).status === 'string' &&
    ['PAUSED', 'STOPPED', 'START'].includes((args as { status: string }).status)
  );
}

function isGetCampaignParams(args: unknown): args is GetCampaignParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number'
  );
}

function isListCampaignsParams(args: unknown): args is ListCampaignsParams {
  return typeof args === 'object' && args !== null;
}

function isSaveCampaignSequenceParams(args: unknown): args is SaveCampaignSequenceParams {
  if (
    typeof args !== 'object' ||
    args === null ||
    !('campaign_id' in args) ||
    typeof (args as { campaign_id: unknown }).campaign_id !== 'number' ||
    !('sequence' in args) ||
    !Array.isArray((args as { sequence: unknown }).sequence)
  ) {
    return false;
  }

  const sequence = (args as { sequence: unknown[] }).sequence;
  return sequence.every(isValidSequenceItem);
}

function isValidSequenceItem(item: unknown): boolean {
  return (
    typeof item === 'object' &&
    item !== null &&
    'seq_number' in item &&
    typeof (item as { seq_number: unknown }).seq_number === 'number' &&
    'seq_delay_details' in item &&
    typeof (item as { seq_delay_details: unknown }).seq_delay_details === 'object' &&
    (item as { seq_delay_details: unknown }).seq_delay_details !== null &&
    'delay_in_days' in (item as { seq_delay_details: { delay_in_days: unknown } }).seq_delay_details &&
    typeof (item as { seq_delay_details: { delay_in_days: unknown } }).seq_delay_details.delay_in_days === 'number' &&
    'variant_distribution_type' in item &&
    typeof (item as { variant_distribution_type: unknown }).variant_distribution_type === 'string' &&
    'seq_variants' in item &&
    Array.isArray((item as { seq_variants: unknown[] }).seq_variants) &&
    (item as { seq_variants: unknown[] }).seq_variants.every(
      (variant) =>
        typeof variant === 'object' &&
        variant !== null &&
        'subject' in variant &&
        typeof (variant as { subject: unknown }).subject === 'string' &&
        'email_body' in variant &&
        typeof (variant as { email_body: unknown }).email_body === 'string' &&
        'variant_label' in variant &&
        typeof (variant as { variant_label: unknown }).variant_label === 'string'
    )
  );
}

// Server implementation
const server = new Server(
  {
    name: 'smartlead-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      logging: {},
    },
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

let isStdioTransport = false;

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
  if (isStdioTransport) {
    // For stdio transport, log to stderr to avoid protocol interference
    console.error(
      `[${level}] ${typeof data === 'object' ? JSON.stringify(data) : data}`
    );
  } else {
    // For other transport types, use the normal logging mechanism
    server.sendLoggingMessage({ level, data });
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

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    CREATE_CAMPAIGN_TOOL,
    UPDATE_CAMPAIGN_SCHEDULE_TOOL,
    UPDATE_CAMPAIGN_SETTINGS_TOOL,
    UPDATE_CAMPAIGN_STATUS_TOOL,
    GET_CAMPAIGN_TOOL,
    LIST_CAMPAIGNS_TOOL,
    SAVE_CAMPAIGN_SEQUENCE_TOOL,
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const startTime = Date.now();
  try {
    const { name, arguments: args } = request.params;

    // Log incoming request with timestamp
    safeLog(
      'info',
      `[${new Date().toISOString()}] Received request for tool: ${name}`
    );

    if (!args) {
      throw new Error('No arguments provided');
    }

    switch (name) {
      case 'smartlead_create_campaign': {
        if (!isCreateCampaignParams(args)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Invalid arguments for smartlead_create_campaign'
          );
        }

        try {
          const response = await withRetry(
            async () => apiClient.post('/campaigns/create', args),
            'create campaign'
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
            isError: false,
          };
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? `API Error: ${error.response?.data?.message || error.message}`
            : `Error: ${error instanceof Error ? error.message : String(error)}`;

          return {
            content: [{ type: 'text', text: errorMessage }],
            isError: true,
          };
        }
      }

      case 'smartlead_update_campaign_schedule': {
        if (!isUpdateCampaignScheduleParams(args)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Invalid arguments for smartlead_update_campaign_schedule'
          );
        }

        const { campaign_id, ...scheduleParams } = args;

        try {
          const response = await withRetry(
            async () => apiClient.post(`/campaigns/${campaign_id}/schedule`, scheduleParams),
            'update campaign schedule'
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
            isError: false,
          };
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? `API Error: ${error.response?.data?.message || error.message}`
            : `Error: ${error instanceof Error ? error.message : String(error)}`;

          return {
            content: [{ type: 'text', text: errorMessage }],
            isError: true,
          };
        }
      }

      case 'smartlead_update_campaign_settings': {
        if (!isUpdateCampaignSettingsParams(args)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Invalid arguments for smartlead_update_campaign_settings'
          );
        }

        const { campaign_id, ...settingsParams } = args;

        try {
          const response = await withRetry(
            async () => apiClient.post(`/campaigns/${campaign_id}/settings`, settingsParams),
            'update campaign settings'
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
            isError: false,
          };
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? `API Error: ${error.response?.data?.message || error.message}`
            : `Error: ${error instanceof Error ? error.message : String(error)}`;

          return {
            content: [{ type: 'text', text: errorMessage }],
            isError: true,
          };
        }
      }

      case 'smartlead_update_campaign_status': {
        if (!isUpdateCampaignStatusParams(args)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Invalid arguments for smartlead_update_campaign_status'
          );
        }

        const { campaign_id, status } = args;

        try {
          const response = await withRetry(
            async () => apiClient.post(`/campaigns/${campaign_id}/status`, { status }),
            'update campaign status'
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
            isError: false,
          };
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? `API Error: ${error.response?.data?.message || error.message}`
            : `Error: ${error instanceof Error ? error.message : String(error)}`;

          return {
            content: [{ type: 'text', text: errorMessage }],
            isError: true,
          };
        }
      }

      case 'smartlead_get_campaign': {
        if (!isGetCampaignParams(args)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Invalid arguments for smartlead_get_campaign'
          );
        }

        try {
          const response = await withRetry(
            async () => apiClient.get(`/campaigns/${args.campaign_id}`),
            'get campaign'
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
            isError: false,
          };
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? `API Error: ${error.response?.data?.message || error.message}`
            : `Error: ${error instanceof Error ? error.message : String(error)}`;

          return {
            content: [{ type: 'text', text: errorMessage }],
            isError: true,
          };
        }
      }

      case 'smartlead_list_campaigns': {
        if (!isListCampaignsParams(args)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Invalid arguments for smartlead_list_campaigns'
          );
        }

        try {
          const response = await withRetry(
            async () => apiClient.get('/campaigns', { params: args }),
            'list campaigns'
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
            isError: false,
          };
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? `API Error: ${error.response?.data?.message || error.message}`
            : `Error: ${error instanceof Error ? error.message : String(error)}`;

          return {
            content: [{ type: 'text', text: errorMessage }],
            isError: true,
          };
        }
      }

      case 'smartlead_save_campaign_sequence': {
        if (!isSaveCampaignSequenceParams(args)) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Invalid arguments for smartlead_save_campaign_sequence'
          );
        }

        const { campaign_id, sequence } = args;

        try {
          const response = await withRetry(
            async () => apiClient.post(`/campaigns/${campaign_id}/sequences`, { sequences: sequence }),
            'save campaign sequence'
          );

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(response.data, null, 2),
              },
            ],
            isError: false,
          };
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? `API Error: ${error.response?.data?.message || error.message}`
            : `Error: ${error instanceof Error ? error.message : String(error)}`;

          return {
            content: [{ type: 'text', text: errorMessage }],
            isError: true,
          };
        }
      }

      default:
        return {
          content: [
            { type: 'text', text: `Unknown tool: ${name}` },
          ],
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
          type: 'text',
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

// Server startup
async function runServer() {
  try {
    console.error('Initializing Smartlead MCP Server...');

    const transport = new StdioServerTransport();

    // Detect if we're using stdio transport
    isStdioTransport = transport instanceof StdioServerTransport;
    if (isStdioTransport) {
      console.error(
        'Running in stdio mode, logging will be directed to stderr'
      );
    }

    await server.connect(transport);

    // Now that we're connected, we can send logging messages
    safeLog('info', 'Smartlead MCP Server initialized successfully');
    safeLog(
      'info',
      `Configuration: API URL: ${SMARTLEAD_API_URL}`
    );

    console.error('Smartlead MCP Server running on stdio');
  } catch (error) {
    console.error('Fatal error running server:', error);
    process.exit(1);
  }
}

runServer().catch((error: any) => {
  console.error('Fatal error running server:', error);
  process.exit(1);
});
