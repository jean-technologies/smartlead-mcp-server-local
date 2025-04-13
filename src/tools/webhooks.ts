import { CategoryTool, ToolCategory } from '../types/common.js';
import { WebhookEventType } from '../types/webhooks.js';

// Webhook Tools

export const FETCH_WEBHOOKS_BY_CAMPAIGN_TOOL: CategoryTool = {
  name: 'smartlead_fetch_webhooks_by_campaign',
  description: 'Fetch all the webhooks associated with a campaign using the campaign ID.',
  category: ToolCategory.WEBHOOKS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'string',
        description: 'ID of the campaign to fetch webhooks for',
      },
    },
    required: ['campaign_id'],
  },
};

export const UPSERT_CAMPAIGN_WEBHOOK_TOOL: CategoryTool = {
  name: 'smartlead_upsert_campaign_webhook',
  description: 'Add or update a webhook for a specific campaign.',
  category: ToolCategory.WEBHOOKS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'string',
        description: 'ID of the campaign to add/update webhook for',
      },
      id: {
        type: ['integer', 'null'],
        description: 'ID of the webhook to update. Set to null to create a new webhook.',
      },
      name: {
        type: 'string',
        description: 'Name for the webhook',
      },
      webhook_url: {
        type: 'string',
        description: 'URL to call when the webhook event occurs',
      },
      event_types: {
        type: 'array',
        items: {
          type: 'string',
          enum: Object.values(WebhookEventType),
        },
        description: `Types of events to trigger the webhook. Options: ${Object.values(WebhookEventType).join(', ')}`,
      },
      categories: {
        type: 'array',
        items: { type: 'string' },
        description: 'Categories for filtering webhook events (e.g. ["Interested", "NotInterested"])',
      },
    },
    required: ['campaign_id', 'name', 'webhook_url', 'event_types'],
  },
};

export const DELETE_CAMPAIGN_WEBHOOK_TOOL: CategoryTool = {
  name: 'smartlead_delete_campaign_webhook',
  description: 'Delete a specific webhook from a campaign.',
  category: ToolCategory.WEBHOOKS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'string',
        description: 'ID of the campaign containing the webhook',
      },
      id: {
        type: 'integer',
        description: 'ID of the webhook to delete',
      },
    },
    required: ['campaign_id', 'id'],
  },
};

export const GET_WEBHOOKS_PUBLISH_SUMMARY_TOOL: CategoryTool = {
  name: 'smartlead_get_webhooks_publish_summary',
  description: 'Get a summary of webhook publish events (Private Beta feature).',
  category: ToolCategory.WEBHOOKS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'string',
        description: 'ID of the campaign to get webhook publish summary for',
      },
      fromTime: {
        type: 'string',
        description: 'Start date/time in ISO 8601 format (e.g. 2025-03-21T00:00:00Z)',
      },
      toTime: {
        type: 'string',
        description: 'End date/time in ISO 8601 format (e.g. 2025-04-04T23:59:59Z)',
      },
    },
    required: ['campaign_id'],
  },
};

export const RETRIGGER_FAILED_EVENTS_TOOL: CategoryTool = {
  name: 'smartlead_retrigger_failed_events',
  description: 'Retrigger failed webhook events (Private Beta feature).',
  category: ToolCategory.WEBHOOKS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'string',
        description: 'ID of the campaign to retrigger failed webhook events for',
      },
      fromTime: {
        type: 'string',
        description: 'Start date/time in ISO 8601 format (e.g. 2025-03-21T00:00:00Z)',
      },
      toTime: {
        type: 'string',
        description: 'End date/time in ISO 8601 format (e.g. 2025-04-04T23:59:59Z)',
      },
    },
    required: ['campaign_id', 'fromTime', 'toTime'],
  },
};

// Export all tools as an array for easy registration
export const webhookTools = [
  FETCH_WEBHOOKS_BY_CAMPAIGN_TOOL,
  UPSERT_CAMPAIGN_WEBHOOK_TOOL,
  DELETE_CAMPAIGN_WEBHOOK_TOOL,
  GET_WEBHOOKS_PUBLISH_SUMMARY_TOOL,
  RETRIGGER_FAILED_EVENTS_TOOL,
]; 