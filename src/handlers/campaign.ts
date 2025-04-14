import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { 
  isCreateCampaignParams, 
  isUpdateCampaignScheduleParams, 
  isUpdateCampaignSettingsParams,
  isUpdateCampaignStatusParams,
  isGetCampaignParams,
  isListCampaignsParams,
  isSaveCampaignSequenceParams,
  isGetCampaignSequenceParams,
  isGetCampaignsByLeadParams,
  isExportCampaignLeadsParams,
  isDeleteCampaignParams,
  isGetCampaignAnalyticsByDateParams,
  isGetCampaignSequenceAnalyticsParams
} from '../types/campaign.js';

// Handler for campaign-related tools
export async function handleCampaignTool(
  toolName: string, 
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  switch (toolName) {
    case 'smartlead_create_campaign': {
      return handleCreateCampaign(args, apiClient, withRetry);
    }
    case 'smartlead_update_campaign_schedule': {
      return handleUpdateCampaignSchedule(args, apiClient, withRetry);
    }
    case 'smartlead_update_campaign_settings': {
      return handleUpdateCampaignSettings(args, apiClient, withRetry);
    }
    case 'smartlead_update_campaign_status': {
      return handleUpdateCampaignStatus(args, apiClient, withRetry);
    }
    case 'smartlead_get_campaign': {
      return handleGetCampaign(args, apiClient, withRetry);
    }
    case 'smartlead_list_campaigns': {
      return handleListCampaigns(args, apiClient, withRetry);
    }
    case 'smartlead_save_campaign_sequence': {
      return handleSaveCampaignSequence(args, apiClient, withRetry);
    }
    case 'smartlead_get_campaign_sequence': {
      return handleGetCampaignSequence(args, apiClient, withRetry);
    }
    case 'smartlead_get_campaigns_by_lead': {
      return handleGetCampaignsByLead(args, apiClient, withRetry);
    }
    case 'smartlead_export_campaign_leads': {
      return handleExportCampaignLeads(args, apiClient, withRetry);
    }
    case 'smartlead_delete_campaign': {
      return handleDeleteCampaign(args, apiClient, withRetry);
    }
    case 'smartlead_get_campaign_analytics_by_date': {
      return handleGetCampaignAnalyticsByDate(args, apiClient, withRetry);
    }
    case 'smartlead_get_campaign_sequence_analytics': {
      return handleGetCampaignSequenceAnalytics(args, apiClient, withRetry);
    }
    default:
      throw new Error(`Unknown campaign tool: ${toolName}`);
  }
}

// Individual handlers for each tool
async function handleCreateCampaign(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
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

async function handleUpdateCampaignSchedule(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
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

async function handleUpdateCampaignSettings(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
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

async function handleUpdateCampaignStatus(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
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

async function handleGetCampaign(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
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

async function handleListCampaigns(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isListCampaignsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_list_campaigns'
    );
  }

  try {
    console.log('[DEBUG] Calling list campaigns API with params:', JSON.stringify(args, null, 2));
    console.log('[DEBUG] API URL:', apiClient.defaults.baseURL);
    console.log('[DEBUG] API Key in params:', apiClient.defaults.params?.api_key);
    
    // Extract API key from apiClient or environment variables
    const apiKey = apiClient.defaults.params?.api_key || process.env.SMARTLEAD_API_KEY;
    
    // Create a modified params object, removing any potential 'status' parameter
    // Use a type assertion to handle any properties that may still be in the args object
    const modifiedParams = { ...args };
    const anyParams = modifiedParams as any;
    
    // The API doesn't accept status, so remove it if present
    if (anyParams.status !== undefined) {
      console.log('[DEBUG] Removing unsupported "status" parameter');
      delete anyParams.status;
    }
    
    // Make sure we're using the right endpoint format
    const response = await withRetry(
      async () => {
        try {
          // Create a combined params object that includes the api_key and modified user params
          const combinedParams = {
            ...modifiedParams,
            api_key: apiKey
          };
          
          // Log the full request
          console.log('[DEBUG] Making request to:', `/campaigns`, 'with params:', JSON.stringify(combinedParams, null, 2));
          
          const result = await apiClient.get('/campaigns', { params: combinedParams });
          
          // Log response success
          console.log('[DEBUG] Received API response:', result.status, result.statusText);
          return result;
        } catch (reqError: any) {
          // Log request error details
          console.error('[DEBUG] Request error details:', {
            status: reqError.response?.status,
            statusText: reqError.response?.statusText,
            errorMessage: reqError.message,
            responseData: reqError.response?.data
          });
          throw reqError;
        }
      },
      'list campaigns'
    );

    // Log successful data
    console.log('[DEBUG] List campaigns successful, returning data');
    
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
    // Create a more detailed error message
    const errorDetails = {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response data',
      request: error.request ? 'Request was made but no response received' : 'No request was made'
    };
    
    console.error('[ERROR] List campaigns error:', JSON.stringify(errorDetails, null, 2));
    
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}\n\nDetails: ${JSON.stringify(errorDetails, null, 2)}` 
      }],
      isError: true,
    };
  }
}

async function handleSaveCampaignSequence(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isSaveCampaignSequenceParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_save_campaign_sequence'
    );
  }

  const { campaign_id, sequence } = args;

  try {
    const response = await withRetry(
      async () => apiClient.post(`/campaigns/${campaign_id}/sequences`, { sequence }),
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

async function handleGetCampaignSequence(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetCampaignSequenceParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_campaign_sequence'
    );
  }

  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${args.campaign_id}/sequences`),
      'get campaign sequence'
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

// New handler implementations for the remaining campaign management API endpoints
async function handleGetCampaignsByLead(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetCampaignsByLeadParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_campaigns_by_lead'
    );
  }

  try {
    const response = await withRetry(
      async () => apiClient.get(`/leads/${args.lead_id}/campaigns`),
      'get campaigns by lead'
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

async function handleExportCampaignLeads(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isExportCampaignLeadsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_export_campaign_leads'
    );
  }

  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${args.campaign_id}/leads-export`, {
        responseType: 'text'
      }),
      'export campaign leads'
    );

    return {
      content: [
        {
          type: 'text',
          text: `CSV Data:\n${response.data}`,
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

async function handleDeleteCampaign(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isDeleteCampaignParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_delete_campaign'
    );
  }

  try {
    const response = await withRetry(
      async () => apiClient.delete(`/campaigns/${args.campaign_id}`),
      'delete campaign'
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

async function handleGetCampaignAnalyticsByDate(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetCampaignAnalyticsByDateParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_campaign_analytics_by_date'
    );
  }

  const { campaign_id, ...params } = args;

  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${campaign_id}/analytics-by-date`, { 
        params 
      }),
      'get campaign analytics by date'
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

async function handleGetCampaignSequenceAnalytics(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetCampaignSequenceAnalyticsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_campaign_sequence_analytics'
    );
  }

  const { campaign_id, ...params } = args;

  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${campaign_id}/sequence-analytics`, { 
        params 
      }),
      'get campaign sequence analytics'
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