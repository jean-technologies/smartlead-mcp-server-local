import { CategoryTool, ToolCategory } from '../types/common.js';

// Email Account Management Tools
export const LIST_EMAIL_ACCOUNTS_CAMPAIGN_TOOL: CategoryTool = {
  name: 'smartlead_list_email_accounts_campaign',
  description: 'List all email accounts associated with a specific campaign.',
  category: ToolCategory.EMAIL_ACCOUNT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to get email accounts for',
      },
      status: {
        type: 'string',
        enum: ['active', 'disconnected', 'pending'],
        description: 'Filter email accounts by status',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of email accounts to return',
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination',
      },
    },
    required: ['campaign_id'],
  },
};

export const ADD_EMAIL_TO_CAMPAIGN_TOOL: CategoryTool = {
  name: 'smartlead_add_email_to_campaign',
  description: 'Add an email account to a campaign.',
  category: ToolCategory.EMAIL_ACCOUNT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to add the email account to',
      },
      email_account_id: {
        type: 'number',
        description: 'ID of the email account to add to the campaign',
      },
    },
    required: ['campaign_id', 'email_account_id'],
  },
};

export const REMOVE_EMAIL_FROM_CAMPAIGN_TOOL: CategoryTool = {
  name: 'smartlead_remove_email_from_campaign',
  description: 'Remove an email account from a campaign.',
  category: ToolCategory.EMAIL_ACCOUNT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to remove the email account from',
      },
      email_account_id: {
        type: 'number',
        description: 'ID of the email account to remove from the campaign',
      },
    },
    required: ['campaign_id', 'email_account_id'],
  },
};

export const FETCH_EMAIL_ACCOUNTS_TOOL: CategoryTool = {
  name: 'smartlead_fetch_email_accounts',
  description: 'Fetch all email accounts associated with the user.',
  category: ToolCategory.EMAIL_ACCOUNT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['active', 'disconnected', 'pending'],
        description: 'Filter email accounts by status',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of email accounts to return',
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination',
      },
    },
  },
};

export const CREATE_EMAIL_ACCOUNT_TOOL: CategoryTool = {
  name: 'smartlead_create_email_account',
  description: 'Create a new email account.',
  category: ToolCategory.EMAIL_ACCOUNT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'Email address',
      },
      provider: {
        type: 'string',
        description: 'Email provider (e.g., "gmail", "outlook", "custom")',
      },
      name: {
        type: 'string',
        description: 'Display name for the email account',
      },
      smtp_host: {
        type: 'string',
        description: 'SMTP server hostname (for custom providers)',
      },
      smtp_port: {
        type: 'number',
        description: 'SMTP server port (for custom providers)',
      },
      smtp_username: {
        type: 'string',
        description: 'SMTP username (for custom providers)',
      },
      smtp_password: {
        type: 'string',
        description: 'SMTP password (for custom providers)',
      },
      imap_host: {
        type: 'string',
        description: 'IMAP server hostname (for custom providers)',
      },
      imap_port: {
        type: 'number',
        description: 'IMAP server port (for custom providers)',
      },
      imap_username: {
        type: 'string',
        description: 'IMAP username (for custom providers)',
      },
      imap_password: {
        type: 'string',
        description: 'IMAP password (for custom providers)',
      },
      oauth_token: {
        type: 'string',
        description: 'OAuth token (for OAuth-based providers)',
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Tags to assign to the email account',
      },
    },
    required: ['email', 'provider'],
  },
};

export const UPDATE_EMAIL_ACCOUNT_TOOL: CategoryTool = {
  name: 'smartlead_update_email_account',
  description: 'Update an existing email account.',
  category: ToolCategory.EMAIL_ACCOUNT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      email_account_id: {
        type: 'number',
        description: 'ID of the email account to update',
      },
      name: {
        type: 'string',
        description: 'Display name for the email account',
      },
      smtp_host: {
        type: 'string',
        description: 'SMTP server hostname',
      },
      smtp_port: {
        type: 'number',
        description: 'SMTP server port',
      },
      smtp_username: {
        type: 'string',
        description: 'SMTP username',
      },
      smtp_password: {
        type: 'string',
        description: 'SMTP password',
      },
      imap_host: {
        type: 'string',
        description: 'IMAP server hostname',
      },
      imap_port: {
        type: 'number',
        description: 'IMAP server port',
      },
      imap_username: {
        type: 'string',
        description: 'IMAP username',
      },
      imap_password: {
        type: 'string',
        description: 'IMAP password',
      },
      oauth_token: {
        type: 'string',
        description: 'OAuth token',
      },
      status: {
        type: 'string',
        enum: ['active', 'paused', 'disconnected'],
        description: 'Status of the email account',
      },
    },
    required: ['email_account_id'],
  },
};

export const FETCH_EMAIL_ACCOUNT_BY_ID_TOOL: CategoryTool = {
  name: 'smartlead_fetch_email_account_by_id',
  description: 'Fetch a specific email account by ID.',
  category: ToolCategory.EMAIL_ACCOUNT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      email_account_id: {
        type: 'number',
        description: 'ID of the email account to fetch',
      },
    },
    required: ['email_account_id'],
  },
};

export const UPDATE_EMAIL_WARMUP_TOOL: CategoryTool = {
  name: 'smartlead_update_email_warmup',
  description: 'Add or update warmup settings for an email account.',
  category: ToolCategory.EMAIL_ACCOUNT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      email_account_id: {
        type: 'number',
        description: 'ID of the email account to update warmup settings for',
      },
      enabled: {
        type: 'boolean',
        description: 'Whether warmup is enabled for this email account',
      },
      daily_limit: {
        type: 'number',
        description: 'Daily limit for warmup emails',
      },
      warmup_settings: {
        type: 'object',
        properties: {
          start_time: {
            type: 'string',
            description: 'Start time for warmup in HH:MM format',
          },
          end_time: {
            type: 'string',
            description: 'End time for warmup in HH:MM format',
          },
          days_of_week: {
            type: 'array',
            items: {
              type: 'number',
            },
            description: 'Days of the week for warmup (1-7, where 1 is Monday)',
          },
        },
        description: 'Additional warmup settings',
      },
    },
    required: ['email_account_id', 'enabled'],
  },
};

export const RECONNECT_EMAIL_ACCOUNT_TOOL: CategoryTool = {
  name: 'smartlead_reconnect_email_account',
  description: 'Reconnect a failed email account.',
  category: ToolCategory.EMAIL_ACCOUNT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      email_account_id: {
        type: 'number',
        description: 'ID of the email account to reconnect',
      },
      connection_details: {
        type: 'object',
        properties: {
          smtp_host: {
            type: 'string',
            description: 'SMTP server hostname',
          },
          smtp_port: {
            type: 'number',
            description: 'SMTP server port',
          },
          smtp_username: {
            type: 'string',
            description: 'SMTP username',
          },
          smtp_password: {
            type: 'string',
            description: 'SMTP password',
          },
          imap_host: {
            type: 'string',
            description: 'IMAP server hostname',
          },
          imap_port: {
            type: 'number',
            description: 'IMAP server port',
          },
          imap_username: {
            type: 'string',
            description: 'IMAP username',
          },
          imap_password: {
            type: 'string',
            description: 'IMAP password',
          },
          oauth_token: {
            type: 'string',
            description: 'OAuth token',
          },
        },
        description: 'Connection details for reconnecting the email account',
      },
    },
    required: ['email_account_id'],
  },
};

export const UPDATE_EMAIL_ACCOUNT_TAG_TOOL: CategoryTool = {
  name: 'smartlead_update_email_account_tag',
  description: 'Update tags for an email account.',
  category: ToolCategory.EMAIL_ACCOUNT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      email_account_id: {
        type: 'number',
        description: 'ID of the email account to update tags for',
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Tags to assign to the email account',
      },
    },
    required: ['email_account_id', 'tags'],
  },
};

// Export all email tools as an array
export const emailTools = [
  LIST_EMAIL_ACCOUNTS_CAMPAIGN_TOOL,
  ADD_EMAIL_TO_CAMPAIGN_TOOL,
  REMOVE_EMAIL_FROM_CAMPAIGN_TOOL,
  FETCH_EMAIL_ACCOUNTS_TOOL,
  CREATE_EMAIL_ACCOUNT_TOOL,
  UPDATE_EMAIL_ACCOUNT_TOOL,
  FETCH_EMAIL_ACCOUNT_BY_ID_TOOL,
  UPDATE_EMAIL_WARMUP_TOOL,
  RECONNECT_EMAIL_ACCOUNT_TOOL,
  UPDATE_EMAIL_ACCOUNT_TAG_TOOL,
]; 