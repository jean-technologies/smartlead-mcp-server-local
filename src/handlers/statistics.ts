import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  isCampaignStatisticsParams,
  isCampaignStatisticsByDateParams,
  isWarmupStatsByEmailParams,
  isCampaignTopLevelAnalyticsParams,
  isCampaignTopLevelAnalyticsByDateParams,
  isCampaignLeadStatisticsParams,
  isCampaignMailboxStatisticsParams
} from '../types/statistics.js';

// Handler for statistics-related tools
export async function handleStatisticsTool(
  toolName: string,
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  switch (toolName) {
    case 'smartlead_get_campaign_statistics': {
      return handleCampaignStatistics(args, apiClient, withRetry);
    }
    case 'smartlead_get_campaign_statistics_by_date': {
      return handleCampaignStatisticsByDate(args, apiClient, withRetry);
    }
    case 'smartlead_get_warmup_stats_by_email': {
      return handleWarmupStatsByEmail(args, apiClient, withRetry);
    }
    case 'smartlead_get_campaign_top_level_analytics': {
      return handleCampaignTopLevelAnalytics(args, apiClient, withRetry);
    }
    case 'smartlead_get_campaign_top_level_analytics_by_date': {
      return handleCampaignTopLevelAnalyticsByDate(args, apiClient, withRetry);
    }
    case 'smartlead_get_campaign_lead_statistics': {
      return handleCampaignLeadStatistics(args, apiClient, withRetry);
    }
    case 'smartlead_get_campaign_mailbox_statistics': {
      return handleCampaignMailboxStatistics(args, apiClient, withRetry);
    }
    default:
      throw new Error(`Unknown statistics tool: ${toolName}`);
  }
}

// Individual handlers for each tool
async function handleCampaignStatistics(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isCampaignStatisticsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_campaign_statistics'
    );
  }

  const { campaign_id, ...queryParams } = args;

  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${campaign_id}/statistics`, { params: queryParams }),
      'get campaign statistics'
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

async function handleCampaignStatisticsByDate(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isCampaignStatisticsByDateParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_campaign_statistics_by_date'
    );
  }

  const { campaign_id, start_date, end_date } = args;

  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${campaign_id}/analytics-by-date`, {
        params: {
          start_date,
          end_date
        }
      }),
      'get campaign statistics by date'
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

async function handleWarmupStatsByEmail(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isWarmupStatsByEmailParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_warmup_stats_by_email'
    );
  }

  const { email_account_id } = args;

  try {
    const response = await withRetry(
      async () => apiClient.get(`/email-accounts/${email_account_id}/warmup-stats`),
      'get warmup stats by email'
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

async function handleCampaignTopLevelAnalytics(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isCampaignTopLevelAnalyticsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_campaign_top_level_analytics'
    );
  }

  const { campaign_id } = args;

  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${campaign_id}/analytics`),
      'get campaign top level analytics'
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

async function handleCampaignTopLevelAnalyticsByDate(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isCampaignTopLevelAnalyticsByDateParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_campaign_top_level_analytics_by_date'
    );
  }

  const { campaign_id, start_date, end_date } = args;

  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${campaign_id}/top-level-analytics-by-date`, {
        params: {
          start_date,
          end_date
        }
      }),
      'get campaign top level analytics by date'
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

async function handleCampaignLeadStatistics(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isCampaignLeadStatisticsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_campaign_lead_statistics'
    );
  }

  const { campaign_id, ...queryParams } = args;

  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${campaign_id}/lead-statistics`, {
        params: queryParams
      }),
      'get campaign lead statistics'
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

async function handleCampaignMailboxStatistics(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isCampaignMailboxStatisticsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_campaign_mailbox_statistics'
    );
  }

  const { campaign_id, ...queryParams } = args;

  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${campaign_id}/mailbox-statistics`, {
        params: queryParams
      }),
      'get campaign mailbox statistics'
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