import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  isCampaignStatisticsParams,
  isCampaignStatisticsByDateParams,
  isWarmupStatsByEmailParams,
  isCampaignTopLevelAnalyticsParams,
  isCampaignTopLevelAnalyticsByDateParams,
  isCampaignLeadStatisticsParams,
  isCampaignMailboxStatisticsParams,
  isDownloadCampaignDataParams,
  isViewDownloadStatisticsParams
} from '../types/statistics.js';
import { trackDownload, getDownloadStats, getDownloadRecords } from '../utils/download-tracker.js';

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
    case 'smartlead_download_campaign_data': {
      return handleDownloadCampaignData(args, apiClient, withRetry);
    }
    case 'smartlead_view_download_statistics': {
      return handleViewDownloadStatistics(args);
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

// New function to handle the download and tracking
async function handleDownloadCampaignData(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isDownloadCampaignDataParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_download_campaign_data'
    );
  }

  const { campaign_id, download_type, format, user_id } = args;

  try {
    let endpoint = '';
    let transformFn = (data: any) => data;
    
    // Determine the API endpoint based on download type
    switch (download_type) {
      case 'analytics':
        endpoint = `/campaigns/${campaign_id}/analytics`;
        break;
      case 'leads':
        endpoint = `/campaigns/${campaign_id}/leads`;
        break;
      case 'sequence':
        endpoint = `/campaigns/${campaign_id}/sequence`;
        break;
      case 'full_export':
        endpoint = `/campaigns/${campaign_id}/export`;
        break;
      default:
        throw new McpError(
          ErrorCode.InvalidParams,
          `Invalid download_type: ${download_type}`
        );
    }
    
    // Fetch the data
    const response = await withRetry(
      async () => apiClient.get(endpoint),
      `download campaign ${download_type}`
    );
    
    let responseData = response.data;
    
    // If format is CSV, convert the JSON data to CSV
    if (format === 'csv') {
      responseData = convertToCSV(responseData);
    }
    
    // Track the download
    const downloadId = trackDownload(
      campaign_id,
      download_type,
      format,
      user_id
    );
    
    // Add download metadata to the response
    const result = {
      data: responseData,
      download_metadata: {
        download_id: downloadId,
        timestamp: new Date().toISOString(),
        campaign_id,
        download_type,
        format
      }
    };

    return {
      content: [
        {
          type: 'text',
          text: format === 'json' 
            ? JSON.stringify(result, null, 2)
            : result.data, // CSV data is already stringified
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

// Helper function to convert JSON to CSV
function convertToCSV(data: any): string {
  if (!data || typeof data !== 'object') {
    return '';
  }
  
  // Handle array of objects
  if (Array.isArray(data)) {
    if (data.length === 0) return '';
    
    // Get all possible headers from all objects
    const headers = new Set<string>();
    data.forEach(item => {
      if (item && typeof item === 'object') {
        Object.keys(item).forEach(key => headers.add(key));
      }
    });
    
    const headerRow = Array.from(headers).join(',');
    const rows = data.map(item => {
      if (!item || typeof item !== 'object') return '';
      return Array.from(headers)
        .map(header => {
          const cell = item[header] ?? '';
          // Escape strings with quotes if they contain commas
          return typeof cell === 'string' && cell.includes(',')
            ? `"${cell.replace(/"/g, '""')}"`
            : String(cell);
        })
        .join(',');
    });
    
    return [headerRow, ...rows].join('\n');
  }
  
  // Handle single object
  const headers = Object.keys(data).join(',');
  const values = Object.values(data)
    .map(val => {
      if (typeof val === 'string' && val.includes(',')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return String(val);
    })
    .join(',');
    
  return [headers, values].join('\n');
}

// New function to handle viewing download statistics
async function handleViewDownloadStatistics(args: unknown) {
  if (!isViewDownloadStatisticsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_view_download_statistics'
    );
  }

  const { time_period = 'all', group_by = 'type' } = args;

  try {
    // Get all download records
    const allRecords = getDownloadRecords();
    
    // Filter records by time period
    const now = new Date();
    const filteredRecords = allRecords.filter(record => {
      const recordDate = new Date(record.timestamp);
      
      switch (time_period) {
        case 'today':
          return recordDate.toDateString() === now.toDateString();
        case 'week': {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          return recordDate >= oneWeekAgo;
        }
        case 'month': {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(now.getMonth() - 1);
          return recordDate >= oneMonthAgo;
        }
        case 'all':
        default:
          return true;
      }
    });
    
    // Get basic statistics
    const stats = {
      totalDownloads: filteredRecords.length,
      timePeriod: time_period,
      uniqueUsers: new Set(filteredRecords.map(r => r.userId || r.machineId)).size
    };
    
    // Group by specified field
    let groupedData: Record<string, number> = {};
    
    switch (group_by) {
      case 'type':
        groupedData = filteredRecords.reduce((acc, record) => {
          acc[record.downloadType] = (acc[record.downloadType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'format':
        groupedData = filteredRecords.reduce((acc, record) => {
          acc[record.format] = (acc[record.format] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'campaign':
        groupedData = filteredRecords.reduce((acc, record) => {
          const campaignKey = `campaign_${record.campaignId}`;
          acc[campaignKey] = (acc[campaignKey] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
      case 'date':
        groupedData = filteredRecords.reduce((acc, record) => {
          const date = record.timestamp.split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        break;
    }
    
    // Compile the result
    const result = {
      ...stats,
      groupedBy: group_by,
      groups: groupedData,
      // Include recent downloads for reference
      recentDownloads: filteredRecords
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5)
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `Error retrieving download statistics: ${error.message}` 
      }],
      isError: true,
    };
  }
} 