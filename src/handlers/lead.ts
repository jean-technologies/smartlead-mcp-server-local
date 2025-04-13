import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  isListLeadsParams,
  isGetLeadParams,
  isAddLeadToCampaignParams,
  isUpdateLeadParams,
  isUpdateLeadStatusParams,
  isBulkImportLeadsParams,
  isDeleteLeadParams
} from '../types/lead.js';

// Handler for lead-related tools
export async function handleLeadTool(
  toolName: string,
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  switch (toolName) {
    case 'smartlead_list_leads': {
      return handleListLeads(args, apiClient, withRetry);
    }
    case 'smartlead_get_lead': {
      return handleGetLead(args, apiClient, withRetry);
    }
    case 'smartlead_add_lead_to_campaign': {
      return handleAddLeadToCampaign(args, apiClient, withRetry);
    }
    case 'smartlead_update_lead': {
      return handleUpdateLead(args, apiClient, withRetry);
    }
    case 'smartlead_update_lead_status': {
      return handleUpdateLeadStatus(args, apiClient, withRetry);
    }
    case 'smartlead_bulk_import_leads': {
      return handleBulkImportLeads(args, apiClient, withRetry);
    }
    case 'smartlead_delete_lead': {
      return handleDeleteLead(args, apiClient, withRetry);
    }
    default:
      throw new Error(`Unknown lead tool: ${toolName}`);
  }
}

// Individual handlers for each tool
async function handleListLeads(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isListLeadsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_list_leads'
    );
  }

  try {
    // Build query parameters from args
    const params = new URLSearchParams();
    if (args.campaign_id !== undefined) {
      params.append('campaign_id', args.campaign_id.toString());
    }
    if (args.status !== undefined) {
      params.append('status', args.status);
    }
    if (args.limit !== undefined) {
      params.append('limit', args.limit.toString());
    }
    if (args.offset !== undefined) {
      params.append('offset', args.offset.toString());
    }
    if (args.search !== undefined) {
      params.append('search', args.search);
    }
    if (args.start_date !== undefined) {
      params.append('start_date', args.start_date);
    }
    if (args.end_date !== undefined) {
      params.append('end_date', args.end_date);
    }

    const response = await withRetry(
      async () => apiClient.get('/leads', { params }),
      'list leads'
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
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
}

async function handleGetLead(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetLeadParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_lead'
    );
  }

  try {
    const response = await withRetry(
      async () => apiClient.get(`/leads/${args.lead_id}`),
      'get lead'
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
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
}

async function handleAddLeadToCampaign(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isAddLeadToCampaignParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_add_lead_to_campaign'
    );
  }

  try {
    const response = await withRetry(
      async () => apiClient.post(`/campaigns/${args.campaign_id}/leads`, args),
      'add lead to campaign'
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
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
}

async function handleUpdateLead(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isUpdateLeadParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_update_lead'
    );
  }

  const { lead_id, ...leadData } = args;

  try {
    const response = await withRetry(
      async () => apiClient.put(`/leads/${lead_id}`, leadData),
      'update lead'
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
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
}

async function handleUpdateLeadStatus(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isUpdateLeadStatusParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_update_lead_status'
    );
  }

  const { lead_id, status } = args;

  try {
    const response = await withRetry(
      async () => apiClient.put(`/leads/${lead_id}/status`, { status }),
      'update lead status'
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
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
}

async function handleBulkImportLeads(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isBulkImportLeadsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_bulk_import_leads'
    );
  }

  try {
    const response = await withRetry(
      async () => apiClient.post(`/campaigns/${args.campaign_id}/leads/bulk`, {
        leads: args.leads
      }),
      'bulk import leads'
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
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
}

async function handleDeleteLead(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isDeleteLeadParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_delete_lead'
    );
  }

  try {
    const response = await withRetry(
      async () => apiClient.delete(`/leads/${args.lead_id}`),
      'delete lead'
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
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
} 