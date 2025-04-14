import { CategoryTool, ToolCategory } from '../types/common.js';

// Campaign Management Tools
export const CREATE_CAMPAIGN_TOOL: CategoryTool = {
  name: 'smartlead_create_campaign',
  description: 'Create a new campaign in Smartlead.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
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

export const UPDATE_CAMPAIGN_SCHEDULE_TOOL: CategoryTool = {
  name: 'smartlead_update_campaign_schedule',
  description: 'Update a campaign\'s schedule settings.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
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

export const UPDATE_CAMPAIGN_SETTINGS_TOOL: CategoryTool = {
  name: 'smartlead_update_campaign_settings',
  description: 'Update a campaign\'s general settings.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
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

export const UPDATE_CAMPAIGN_STATUS_TOOL: CategoryTool = {
  name: 'smartlead_update_campaign_status',
  description: 'Update the status of a campaign. Use this specifically for changing a campaign\'s status.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
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

export const GET_CAMPAIGN_TOOL: CategoryTool = {
  name: 'smartlead_get_campaign',
  description: 'Get details of a specific campaign by ID.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
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

export const LIST_CAMPAIGNS_TOOL: CategoryTool = {
  name: 'smartlead_list_campaigns',
  description: 'List all campaigns with optional pagination.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
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

export const SAVE_CAMPAIGN_SEQUENCE_TOOL: CategoryTool = {
  name: 'smartlead_save_campaign_sequence',
  description: 'Save a sequence of emails for a campaign.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
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

export const GET_CAMPAIGN_SEQUENCE_TOOL: CategoryTool = {
  name: 'smartlead_get_campaign_sequence',
  description: 'Fetch a campaign\'s sequence data.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to fetch sequences for',
      },
    },
    required: ['campaign_id'],
  },
};

// New tool definitions for the remaining campaign management API endpoints

export const GET_CAMPAIGNS_BY_LEAD_TOOL: CategoryTool = {
  name: 'smartlead_get_campaigns_by_lead',
  description: 'Fetch all campaigns that a lead belongs to.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      lead_id: {
        type: 'number',
        description: 'ID of the lead to fetch campaigns for',
      },
    },
    required: ['lead_id'],
  },
};

export const EXPORT_CAMPAIGN_LEADS_TOOL: CategoryTool = {
  name: 'smartlead_export_campaign_leads',
  description: 'Export all leads data from a campaign as CSV.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to export leads from',
      },
    },
    required: ['campaign_id'],
  },
};

export const DELETE_CAMPAIGN_TOOL: CategoryTool = {
  name: 'smartlead_delete_campaign',
  description: 'Delete a campaign permanently.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to delete',
      },
    },
    required: ['campaign_id'],
  },
};

export const GET_CAMPAIGN_ANALYTICS_BY_DATE_TOOL: CategoryTool = {
  name: 'smartlead_get_campaign_analytics_by_date',
  description: 'Fetch campaign analytics for a specific date range.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to fetch analytics for',
      },
      start_date: {
        type: 'string',
        format: 'date',
        description: 'Start date in YYYY-MM-DD format',
      },
      end_date: {
        type: 'string',
        format: 'date',
        description: 'End date in YYYY-MM-DD format',
      },
    },
    required: ['campaign_id', 'start_date', 'end_date'],
  },
};

export const GET_CAMPAIGN_SEQUENCE_ANALYTICS_TOOL: CategoryTool = {
  name: 'smartlead_get_campaign_sequence_analytics',
  description: 'Fetch analytics data for a specific email campaign sequence.',
  category: ToolCategory.CAMPAIGN_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to fetch sequence analytics for',
      },
      start_date: {
        type: 'string',
        description: 'Start date in YYYY-MM-DD HH:MM:SS format',
      },
      end_date: {
        type: 'string',
        description: 'End date in YYYY-MM-DD HH:MM:SS format',
      },
      time_zone: {
        type: 'string',
        description: 'Timezone for the analytics data (e.g., "Europe/London")',
      },
    },
    required: ['campaign_id', 'start_date', 'end_date'],
  },
};

// Export an array of all campaign tools for registration
export const campaignTools = [
  CREATE_CAMPAIGN_TOOL,
  UPDATE_CAMPAIGN_SCHEDULE_TOOL,
  UPDATE_CAMPAIGN_SETTINGS_TOOL,
  UPDATE_CAMPAIGN_STATUS_TOOL,
  GET_CAMPAIGN_TOOL,
  LIST_CAMPAIGNS_TOOL,
  SAVE_CAMPAIGN_SEQUENCE_TOOL,
  GET_CAMPAIGN_SEQUENCE_TOOL,
  GET_CAMPAIGNS_BY_LEAD_TOOL,
  EXPORT_CAMPAIGN_LEADS_TOOL,
  DELETE_CAMPAIGN_TOOL,
  GET_CAMPAIGN_ANALYTICS_BY_DATE_TOOL,
  GET_CAMPAIGN_SEQUENCE_ANALYTICS_TOOL
]; 