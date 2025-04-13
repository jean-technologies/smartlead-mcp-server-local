import { CategoryTool, ToolCategory } from './common.js';

// Interface for fetching campaign statistics
export interface CampaignStatisticsParams {
  campaign_id: number;
  offset?: number;
  limit?: number;
  email_sequence_number?: string;
  email_status?: string;
  sent_time_start_date?: string;
  sent_time_end_date?: string;
}

// Interface for fetching campaign statistics by date range
export interface CampaignStatisticsByDateParams {
  campaign_id: number;
  start_date: string;
  end_date: string;
}

// Interface for fetching warmup stats by email account
export interface WarmupStatsByEmailParams {
  email_account_id: number;
}

// Interface for fetching campaign top level analytics
export interface CampaignTopLevelAnalyticsParams {
  campaign_id: number;
}

// Interface for fetching campaign top level analytics by date range
export interface CampaignTopLevelAnalyticsByDateParams {
  campaign_id: number;
  start_date: string;
  end_date: string;
}

// Interface for fetching campaign lead statistics
export interface CampaignLeadStatisticsParams {
  campaign_id: number;
  limit?: number;
  created_at_gt?: string;
  event_time_gt?: string;
  offset?: number;
}

// Interface for fetching campaign mailbox statistics
export interface CampaignMailboxStatisticsParams {
  campaign_id: number;
  client_id?: string;
  offset?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  timezone?: string;
}

// Type guards for params validation

export function isCampaignStatisticsParams(args: unknown): args is CampaignStatisticsParams {
  if (typeof args !== 'object' || args === null) {
    return false;
  }

  const params = args as CampaignStatisticsParams;
  
  if (typeof params.campaign_id !== 'number') {
    return false;
  }
  
  // Optional offset must be a number if present
  if (params.offset !== undefined && typeof params.offset !== 'number') {
    return false;
  }
  
  // Optional limit must be a number if present
  if (params.limit !== undefined && typeof params.limit !== 'number') {
    return false;
  }
  
  // Optional email_sequence_number must be a string if present
  if (params.email_sequence_number !== undefined && typeof params.email_sequence_number !== 'string') {
    return false;
  }
  
  // Optional email_status must be a string if present
  if (params.email_status !== undefined && typeof params.email_status !== 'string') {
    return false;
  }
  
  // Optional sent_time_start_date must be a string if present
  if (params.sent_time_start_date !== undefined && typeof params.sent_time_start_date !== 'string') {
    return false;
  }
  
  // Optional sent_time_end_date must be a string if present
  if (params.sent_time_end_date !== undefined && typeof params.sent_time_end_date !== 'string') {
    return false;
  }
  
  return true;
}

export function isCampaignStatisticsByDateParams(args: unknown): args is CampaignStatisticsByDateParams {
  if (typeof args !== 'object' || args === null) {
    return false;
  }

  const params = args as CampaignStatisticsByDateParams;
  
  return (
    typeof params.campaign_id === 'number' &&
    typeof params.start_date === 'string' &&
    typeof params.end_date === 'string'
  );
}

export function isWarmupStatsByEmailParams(args: unknown): args is WarmupStatsByEmailParams {
  if (typeof args !== 'object' || args === null) {
    return false;
  }

  const params = args as WarmupStatsByEmailParams;
  
  return typeof params.email_account_id === 'number';
}

export function isCampaignTopLevelAnalyticsParams(args: unknown): args is CampaignTopLevelAnalyticsParams {
  if (typeof args !== 'object' || args === null) {
    return false;
  }

  const params = args as CampaignTopLevelAnalyticsParams;
  
  return typeof params.campaign_id === 'number';
}

export function isCampaignTopLevelAnalyticsByDateParams(args: unknown): args is CampaignTopLevelAnalyticsByDateParams {
  if (typeof args !== 'object' || args === null) {
    return false;
  }

  const params = args as CampaignTopLevelAnalyticsByDateParams;
  
  return (
    typeof params.campaign_id === 'number' &&
    typeof params.start_date === 'string' &&
    typeof params.end_date === 'string'
  );
}

export function isCampaignLeadStatisticsParams(args: unknown): args is CampaignLeadStatisticsParams {
  if (typeof args !== 'object' || args === null) {
    return false;
  }

  const params = args as CampaignLeadStatisticsParams;
  
  if (typeof params.campaign_id !== 'number') {
    return false;
  }
  
  // Optional limit must be a string if present (it will be converted to number)
  if (params.limit !== undefined && typeof params.limit !== 'number') {
    return false;
  }
  
  // Optional created_at_gt must be a string if present
  if (params.created_at_gt !== undefined && typeof params.created_at_gt !== 'string') {
    return false;
  }
  
  // Optional event_time_gt must be a string if present
  if (params.event_time_gt !== undefined && typeof params.event_time_gt !== 'string') {
    return false;
  }
  
  // Optional offset must be a string if present (it will be converted to number)
  if (params.offset !== undefined && typeof params.offset !== 'number') {
    return false;
  }
  
  return true;
}

export function isCampaignMailboxStatisticsParams(args: unknown): args is CampaignMailboxStatisticsParams {
  if (typeof args !== 'object' || args === null) {
    return false;
  }

  const params = args as CampaignMailboxStatisticsParams;
  
  if (typeof params.campaign_id !== 'number') {
    return false;
  }
  
  // Optional client_id must be a string if present
  if (params.client_id !== undefined && typeof params.client_id !== 'string') {
    return false;
  }
  
  // Optional offset must be a number if present
  if (params.offset !== undefined && typeof params.offset !== 'number') {
    return false;
  }
  
  // Optional limit must be a number if present
  if (params.limit !== undefined && typeof params.limit !== 'number') {
    return false;
  }
  
  // Optional start_date must be a string if present
  if (params.start_date !== undefined && typeof params.start_date !== 'string') {
    return false;
  }
  
  // Optional end_date must be a string if present
  if (params.end_date !== undefined && typeof params.end_date !== 'string') {
    return false;
  }
  
  // Optional timezone must be a string if present
  if (params.timezone !== undefined && typeof params.timezone !== 'string') {
    return false;
  }
  
  return true;
} 