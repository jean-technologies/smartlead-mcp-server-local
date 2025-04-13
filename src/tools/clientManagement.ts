import { CategoryTool, ToolCategory } from '../types/common.js';

// Client Management Tools

export const ADD_CLIENT_TOOL: CategoryTool = {
  name: 'smartlead_add_client',
  description: 'Add a new client to the system, optionally with white-label settings.',
  category: ToolCategory.CLIENT_MANAGEMENT,
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the client',
      },
      email: {
        type: 'string',
        description: 'Email address of the client',
      },
      permission: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of permissions to grant to the client. Use ["full_access"] for full permissions.',
      },
      logo: {
        type: 'string',
        description: 'Logo text or identifier',
      },
      logo_url: {
        type: ['string', 'null'],
        description: 'URL to the client\'s logo image',
      },
      password: {
        type: 'string',
        description: 'Password for the client\'s account',
      },
    },
    required: ['name', 'email', 'permission', 'password'],
  },
};

export const FETCH_ALL_CLIENTS_TOOL: CategoryTool = {
  name: 'smartlead_fetch_all_clients',
  description: 'Retrieve a list of all clients in the system.',
  category: ToolCategory.CLIENT_MANAGEMENT,
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
export const clientManagementTools = [
  ADD_CLIENT_TOOL,
  FETCH_ALL_CLIENTS_TOOL,
]; 