import { CategoryTool, ToolCategory } from '../types/common.js';

// Smart Senders Tools

export const GET_VENDORS_TOOL: CategoryTool = {
  name: 'smartlead_get_vendors',
  description: 'Retrieve all active domain vendors with their corresponding IDs.',
  category: ToolCategory.SMART_SENDERS,
  inputSchema: {
    type: 'object',
    properties: {
      // This endpoint doesn't require specific parameters beyond the API key
      // which is handled at the API client level
    },
    required: [],
  },
};

export const SEARCH_DOMAIN_TOOL: CategoryTool = {
  name: 'smartlead_search_domain',
  description: 'Search for available domains under $15 that match a given domain name pattern.',
  category: ToolCategory.SMART_SENDERS,
  inputSchema: {
    type: 'object',
    properties: {
      domain_name: {
        type: 'string',
        description: 'The domain name pattern you want to search for',
      },
      vendor_id: {
        type: 'integer',
        description: 'ID of the vendor from whom you want to purchase the domain (use Get Vendors API to retrieve this ID)',
      },
    },
    required: ['domain_name', 'vendor_id'],
  },
};

export const AUTO_GENERATE_MAILBOXES_TOOL: CategoryTool = {
  name: 'smartlead_auto_generate_mailboxes',
  description: 'Auto-generate mailboxes based on the domain name and personal details provided.',
  category: ToolCategory.SMART_SENDERS,
  inputSchema: {
    type: 'object',
    properties: {
      vendor_id: {
        type: 'integer',
        description: 'ID of the vendor from whom you want to purchase the domains and mailboxes',
      },
      domains: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            domain_name: {
              type: 'string',
              description: 'The domain name for which you want to generate mailboxes (e.g., example.com)',
            },
            mailbox_details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  first_name: {
                    type: 'string',
                    description: 'First name for the mailbox owner (should be more than 2 characters and without spaces)',
                  },
                  last_name: {
                    type: 'string',
                    description: 'Last name for the mailbox owner (should be more than 2 characters and without spaces)',
                  },
                  profile_pic: {
                    type: 'string',
                    description: 'URL or identifier for profile picture (optional)',
                  },
                },
                required: ['first_name', 'last_name'],
              },
              description: 'Details for each mailbox you want to generate',
            },
          },
          required: ['domain_name', 'mailbox_details'],
        },
        description: 'List of domains and associated mailbox details',
      },
    },
    required: ['vendor_id', 'domains'],
  },
};

export const PLACE_ORDER_MAILBOXES_TOOL: CategoryTool = {
  name: 'smartlead_place_order_mailboxes',
  description: 'Confirm and place order for domains and mailboxes to be purchased.',
  category: ToolCategory.SMART_SENDERS,
  inputSchema: {
    type: 'object',
    properties: {
      vendor_id: {
        type: 'integer',
        description: 'ID of the vendor from whom you want to purchase the domains and mailboxes',
      },
      forwarding_domain: {
        type: 'string',
        description: 'The domain to forward to when users access purchased domains',
      },
      domains: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            domain_name: {
              type: 'string',
              description: 'The domain name you want to purchase',
            },
            mailbox_details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  mailbox: {
                    type: 'string',
                    description: 'The complete mailbox address (e.g., john@example.com)',
                  },
                  first_name: {
                    type: 'string',
                    description: 'First name for the mailbox owner',
                  },
                  last_name: {
                    type: 'string',
                    description: 'Last name for the mailbox owner',
                  },
                  profile_pic: {
                    type: 'string',
                    description: 'URL or identifier for profile picture (optional)',
                  },
                },
                required: ['mailbox', 'first_name', 'last_name'],
              },
              description: 'Details for each mailbox you want to purchase',
            },
          },
          required: ['domain_name', 'mailbox_details'],
        },
        description: 'List of domains and associated mailbox details for purchase',
      },
    },
    required: ['vendor_id', 'forwarding_domain', 'domains'],
  },
};

export const GET_DOMAIN_LIST_TOOL: CategoryTool = {
  name: 'smartlead_get_domain_list',
  description: 'Retrieve a list of all domains purchased through SmartSenders.',
  category: ToolCategory.SMART_SENDERS,
  inputSchema: {
    type: 'object',
    properties: {
      // This endpoint doesn't require specific parameters beyond the API key
      // which is handled at the API client level
    },
    required: [],
  },
};

// Export all tools as an array for easy registration
export const smartSendersTools = [
  GET_VENDORS_TOOL,
  SEARCH_DOMAIN_TOOL,
  AUTO_GENERATE_MAILBOXES_TOOL,
  PLACE_ORDER_MAILBOXES_TOOL,
  GET_DOMAIN_LIST_TOOL,
]; 