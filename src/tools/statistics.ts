import { CategoryTool, ToolCategory } from '../types/common.js';

// Campaign Statistics Tools
export const CAMPAIGN_STATISTICS_TOOL: CategoryTool = {
  name: 'smartlead_get_campaign_statistics',
  description: 'Fetch campaign statistics using the campaign\'s ID.',
  category: ToolCategory.CAMPAIGN_STATISTICS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to fetch statistics for',
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of statistics to return',
      },
      email_sequence_number: {
        type: 'string',
        description: 'Email sequence number to filter by (e.g., "1,2,3,4")',
      },
      email_status: {
        type: 'string',
        description: 'Email status to filter by (e.g., "opened", "clicked", "replied", "unsubscribed", "bounced")',
      },
      sent_time_start_date: {
        type: 'string',
        description: 'Filter by sent time greater than this date (e.g., "2023-10-16 10:33:02.000Z")',
      },
      sent_time_end_date: {
        type: 'string',
        description: 'Filter by sent time less than this date (e.g., "2023-10-16 10:33:02.000Z")',
      },
    },
    required: ['campaign_id'],
  },
};

export const CAMPAIGN_STATISTICS_BY_DATE_TOOL: CategoryTool = {
  name: 'smartlead_get_campaign_statistics_by_date',
  description: 'Fetch campaign statistics for a specific date range.',
  category: ToolCategory.CAMPAIGN_STATISTICS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to fetch statistics for',
      },
      start_date: {
        type: 'string',
        description: 'Start date in YYYY-MM-DD format',
      },
      end_date: {
        type: 'string',
        description: 'End date in YYYY-MM-DD format',
      },
    },
    required: ['campaign_id', 'start_date', 'end_date'],
  },
};

export const WARMUP_STATS_BY_EMAIL_TOOL: CategoryTool = {
  name: 'smartlead_get_warmup_stats_by_email',
  description: 'Fetch warmup stats for the last 7 days for a specific email account.',
  category: ToolCategory.CAMPAIGN_STATISTICS,
  inputSchema: {
    type: 'object',
    properties: {
      email_account_id: {
        type: 'number',
        description: 'ID of the email account to fetch warmup stats for',
      },
    },
    required: ['email_account_id'],
  },
};

export const CAMPAIGN_TOP_LEVEL_ANALYTICS_TOOL: CategoryTool = {
  name: 'smartlead_get_campaign_top_level_analytics',
  description: 'Fetch top level analytics for a campaign.',
  category: ToolCategory.CAMPAIGN_STATISTICS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to fetch analytics for',
      },
    },
    required: ['campaign_id'],
  },
};

export const CAMPAIGN_TOP_LEVEL_ANALYTICS_BY_DATE_TOOL: CategoryTool = {
  name: 'smartlead_get_campaign_top_level_analytics_by_date',
  description: 'Fetch campaign top level analytics for a specific date range.',
  category: ToolCategory.CAMPAIGN_STATISTICS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to fetch analytics for',
      },
      start_date: {
        type: 'string',
        description: 'Start date in YYYY-MM-DD format',
      },
      end_date: {
        type: 'string',
        description: 'End date in YYYY-MM-DD format',
      },
    },
    required: ['campaign_id', 'start_date', 'end_date'],
  },
};

export const CAMPAIGN_LEAD_STATISTICS_TOOL: CategoryTool = {
  name: 'smartlead_get_campaign_lead_statistics',
  description: 'Fetch lead statistics for a campaign.',
  category: ToolCategory.CAMPAIGN_STATISTICS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to fetch lead statistics for',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of leads to return (max 100)',
      },
      created_at_gt: {
        type: 'string',
        description: 'Filter by leads created after this date (YYYY-MM-DD format)',
      },
      event_time_gt: {
        type: 'string',
        description: 'Filter by events after this date (YYYY-MM-DD format)',
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination',
      },
    },
    required: ['campaign_id'],
  },
};

export const CAMPAIGN_MAILBOX_STATISTICS_TOOL: CategoryTool = {
  name: 'smartlead_get_campaign_mailbox_statistics',
  description: 'Fetch mailbox statistics for a campaign.',
  category: ToolCategory.CAMPAIGN_STATISTICS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to fetch mailbox statistics for',
      },
      client_id: {
        type: 'string',
        description: 'Client ID if the campaign is client-specific',
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results to return (min 1, max 20)',
      },
      start_date: {
        type: 'string',
        description: 'Start date (must be used with end_date)',
      },
      end_date: {
        type: 'string',
        description: 'End date (must be used with start_date)',
      },
      timezone: {
        type: 'string',
        description: 'Timezone for the data (e.g., "America/Los_Angeles")',
      },
    },
    required: ['campaign_id'],
  },
};

// Add this new tool for downloading campaign data with tracking
export const DOWNLOAD_CAMPAIGN_DATA_TOOL: CategoryTool = {
  name: 'smartlead_download_campaign_data',
  description: 'Download campaign data and track the download for analytics.',
  category: ToolCategory.CAMPAIGN_STATISTICS,
  inputSchema: {
    type: 'object',
    properties: {
      campaign_id: {
        type: 'number',
        description: 'ID of the campaign to download data for',
      },
      download_type: {
        type: 'string',
        enum: ['analytics', 'leads', 'sequence', 'full_export'],
        description: 'Type of data to download',
      },
      format: {
        type: 'string',
        enum: ['json', 'csv'],
        description: 'Format of the downloaded data',
      },
      user_id: {
        type: 'string',
        description: 'Optional user identifier for tracking downloads',
      },
    },
    required: ['campaign_id', 'download_type', 'format'],
  },
};

// Add this new tool for viewing download statistics
export const VIEW_DOWNLOAD_STATISTICS_TOOL: CategoryTool = {
  name: 'smartlead_view_download_statistics',
  description: 'View statistics about downloaded campaign data.',
  category: ToolCategory.CAMPAIGN_STATISTICS,
  inputSchema: {
    type: 'object',
    properties: {
      time_period: {
        type: 'string',
        enum: ['all', 'today', 'week', 'month'],
        description: 'Time period to filter statistics by',
      },
      group_by: {
        type: 'string',
        enum: ['type', 'format', 'campaign', 'date'],
        description: 'How to group the statistics',
      },
    },
  },
};

// Export an array of all campaign statistics tools for registration
export const statisticsTools: CategoryTool[] = [
  CAMPAIGN_STATISTICS_TOOL,
  CAMPAIGN_STATISTICS_BY_DATE_TOOL,
  WARMUP_STATS_BY_EMAIL_TOOL,
  CAMPAIGN_TOP_LEVEL_ANALYTICS_TOOL,
  CAMPAIGN_TOP_LEVEL_ANALYTICS_BY_DATE_TOOL,
  CAMPAIGN_LEAD_STATISTICS_TOOL,
  CAMPAIGN_MAILBOX_STATISTICS_TOOL,
  DOWNLOAD_CAMPAIGN_DATA_TOOL,
  VIEW_DOWNLOAD_STATISTICS_TOOL,
]; 