import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  isFetchWebhooksByCampaignParams,
  isUpsertCampaignWebhookParams,
  isDeleteCampaignWebhookParams,
  isGetWebhooksPublishSummaryParams,
  isRetriggerFailedEventsParams
} from '../types/webhooks.js';

// SmartLead API base URL
const SMARTLEAD_API_URL = 'https://server.smartlead.ai/api/v1';

// Handler for Webhook-related tools
export async function handleWebhookTool(
  toolName: string,
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  switch (toolName) {
    case 'smartlead_fetch_webhooks_by_campaign': {
      return handleFetchWebhooksByCampaign(args, apiClient, withRetry);
    }
    case 'smartlead_upsert_campaign_webhook': {
      return handleUpsertCampaignWebhook(args, apiClient, withRetry);
    }
    case 'smartlead_delete_campaign_webhook': {
      return handleDeleteCampaignWebhook(args, apiClient, withRetry);
    }
    case 'smartlead_get_webhooks_publish_summary': {
      return handleGetWebhooksPublishSummary(args, apiClient, withRetry);
    }
    case 'smartlead_retrigger_failed_events': {
      return handleRetriggerFailedEvents(args, apiClient, withRetry);
    }
    default:
      throw new Error(`Unknown Webhook tool: ${toolName}`);
  }
}

// Create a modified client for SmartLead API with the correct base URL
function createSmartLeadClient(apiClient: AxiosInstance) {
  return {
    get: (url: string, config?: any) => 
      apiClient.get(`${SMARTLEAD_API_URL}${url}`, config),
    post: (url: string, data?: any, config?: any) => 
      apiClient.post(`${SMARTLEAD_API_URL}${url}`, data, config),
    put: (url: string, data?: any, config?: any) => 
      apiClient.put(`${SMARTLEAD_API_URL}${url}`, data, config),
    delete: (url: string, config?: any) => 
      apiClient.delete(`${SMARTLEAD_API_URL}${url}`, config)
  };
}

// Individual handlers for each tool
async function handleFetchWebhooksByCampaign(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isFetchWebhooksByCampaignParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_fetch_webhooks_by_campaign'
    );
  }

  try {
    const smartLeadClient = createSmartLeadClient(apiClient);
    const { campaign_id } = args;
    
    const response = await withRetry(
      async () => smartLeadClient.get(`/campaigns/${campaign_id}/webhooks`),
      'fetch webhooks by campaign'
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

async function handleUpsertCampaignWebhook(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isUpsertCampaignWebhookParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_upsert_campaign_webhook'
    );
  }

  try {
    const smartLeadClient = createSmartLeadClient(apiClient);
    const { campaign_id, ...webhookData } = args;
    
    const response = await withRetry(
      async () => smartLeadClient.post(`/campaigns/${campaign_id}/webhooks`, webhookData),
      'upsert campaign webhook'
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

async function handleDeleteCampaignWebhook(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isDeleteCampaignWebhookParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_delete_campaign_webhook'
    );
  }

  try {
    const smartLeadClient = createSmartLeadClient(apiClient);
    const { campaign_id, id } = args;
    
    // The API documentation suggests a DELETE with a body payload
    // Different from typical REST practices but following the API spec
    const response = await withRetry(
      async () => smartLeadClient.delete(`/campaigns/${campaign_id}/webhooks`, { 
        data: { id }
      }),
      'delete campaign webhook'
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

async function handleGetWebhooksPublishSummary(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetWebhooksPublishSummaryParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_webhooks_publish_summary'
    );
  }

  try {
    const smartLeadClient = createSmartLeadClient(apiClient);
    const { campaign_id, fromTime, toTime } = args;
    
    let url = `/campaigns/${campaign_id}/webhooks/summary`;
    const queryParams = new URLSearchParams();
    
    if (fromTime) {
      queryParams.append('fromTime', fromTime);
    }
    
    if (toTime) {
      queryParams.append('toTime', toTime);
    }
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    const response = await withRetry(
      async () => smartLeadClient.get(url),
      'get webhooks publish summary'
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

async function handleRetriggerFailedEvents(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isRetriggerFailedEventsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_retrigger_failed_events'
    );
  }

  try {
    const smartLeadClient = createSmartLeadClient(apiClient);
    const { campaign_id, fromTime, toTime } = args;
    
    const response = await withRetry(
      async () => smartLeadClient.post(`/campaigns/${campaign_id}/webhooks/retrigger-failed-events`, {
        fromTime,
        toTime
      }),
      'retrigger failed events'
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