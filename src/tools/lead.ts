import { CategoryTool, ToolCategory } from '../types/common.js';

// Lead Management Tools
export const LIST_LEADS_TOOL: CategoryTool = {
  name: 'smartlead_list_leads',
  description: 'List leads with optional filtering by campaign or status.',
  category: ToolCategory.LEAD_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'Filter leads by campaign ID',
      },
      status: {
        type: 'string',
        description: 'Filter leads by status (e.g., "active", "unsubscribed", "bounced")',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of leads to return',
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination',
      },
      search: {
        type: 'string',
        description: 'Search term to filter leads',
      },
      start_date: {
        type: 'string',
        description: 'Filter leads created after this date (YYYY-MM-DD format)',
      },
      end_date: {
        type: 'string',
        description: 'Filter leads created before this date (YYYY-MM-DD format)',
      },
    },
  },
};

export const GET_LEAD_TOOL: CategoryTool = {
  name: 'smartlead_get_lead',
  description: 'Get details of a specific lead by ID.',
  category: ToolCategory.LEAD_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      lead_id: {
        type: 'number',
        description: 'ID of the lead to retrieve',
      },
    },
    required: ['lead_id'],
  },
};

export const ADD_LEAD_TO_CAMPAIGN_TOOL: CategoryTool = {
  name: 'smartlead_add_lead_to_campaign',
  description: 'Add a new lead to a campaign.',
  category: ToolCategory.LEAD_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to add the lead to',
      },
      email: {
        type: 'string',
        description: 'Email address of the lead',
      },
      first_name: {
        type: 'string',
        description: 'First name of the lead',
      },
      last_name: {
        type: 'string',
        description: 'Last name of the lead',
      },
      company: {
        type: 'string',
        description: 'Company of the lead',
      },
      title: {
        type: 'string',
        description: 'Job title of the lead',
      },
      phone: {
        type: 'string',
        description: 'Phone number of the lead',
      },
      custom_fields: {
        type: 'object',
        description: 'Custom fields for the lead',
      },
    },
    required: ['campaign_id', 'email'],
  },
};

export const UPDATE_LEAD_TOOL: CategoryTool = {
  name: 'smartlead_update_lead',
  description: 'Update an existing lead\'s information.',
  category: ToolCategory.LEAD_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      lead_id: {
        type: 'number',
        description: 'ID of the lead to update',
      },
      email: {
        type: 'string',
        description: 'New email address for the lead',
      },
      first_name: {
        type: 'string',
        description: 'New first name for the lead',
      },
      last_name: {
        type: 'string',
        description: 'New last name for the lead',
      },
      company: {
        type: 'string',
        description: 'New company for the lead',
      },
      title: {
        type: 'string',
        description: 'New job title for the lead',
      },
      phone: {
        type: 'string',
        description: 'New phone number for the lead',
      },
      custom_fields: {
        type: 'object',
        description: 'Updated custom fields for the lead',
      },
    },
    required: ['lead_id'],
  },
};

export const UPDATE_LEAD_STATUS_TOOL: CategoryTool = {
  name: 'smartlead_update_lead_status',
  description: 'Update a lead\'s status.',
  category: ToolCategory.LEAD_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      lead_id: {
        type: 'number',
        description: 'ID of the lead to update',
      },
      status: {
        type: 'string',
        description: 'New status for the lead',
      },
    },
    required: ['lead_id', 'status'],
  },
};

export const BULK_IMPORT_LEADS_TOOL: CategoryTool = {
  name: 'smartlead_bulk_import_leads',
  description: 'Import multiple leads into a campaign at once.',
  category: ToolCategory.LEAD_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to add the leads to',
      },
      leads: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Email address of the lead',
            },
            first_name: {
              type: 'string',
              description: 'First name of the lead',
            },
            last_name: {
              type: 'string',
              description: 'Last name of the lead',
            },
            company: {
              type: 'string',
              description: 'Company of the lead',
            },
            title: {
              type: 'string',
              description: 'Job title of the lead',
            },
            phone: {
              type: 'string',
              description: 'Phone number of the lead',
            },
            custom_fields: {
              type: 'object',
              description: 'Custom fields for the lead',
            },
          },
          required: ['email'],
        },
        description: 'Array of leads to import',
      },
    },
    required: ['campaign_id', 'leads'],
  },
};

export const DELETE_LEAD_TOOL: CategoryTool = {
  name: 'smartlead_delete_lead',
  description: 'Delete a lead permanently.',
  category: ToolCategory.LEAD_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      lead_id: {
        type: 'number',
        description: 'ID of the lead to delete',
      },
    },
    required: ['lead_id'],
  },
};

// Export an array of all lead management tools for registration
export const leadTools = [
  LIST_LEADS_TOOL,
  GET_LEAD_TOOL,
  ADD_LEAD_TO_CAMPAIGN_TOOL,
  UPDATE_LEAD_TOOL,
  UPDATE_LEAD_STATUS_TOOL,
  BULK_IMPORT_LEADS_TOOL,
  DELETE_LEAD_TOOL,
]; 