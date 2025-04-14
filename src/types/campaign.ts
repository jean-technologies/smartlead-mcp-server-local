// Type definitions for campaign management

export interface CreateCampaignParams {
  name: string;
  client_id?: number;
}

export interface UpdateCampaignScheduleParams {
  campaign_id: number;
  timezone?: string;
  days_of_the_week?: number[];
  start_hour?: string;
  end_hour?: string;
  min_time_btw_emails?: number;
  max_new_leads_per_day?: number;
  schedule_start_time?: string;
}

export interface UpdateCampaignSettingsParams {
  campaign_id: number;
  name?: string;
  status?: 'active' | 'paused' | 'completed';
  settings?: Record<string, any>;
}

export interface UpdateCampaignStatusParams {
  campaign_id: number;
  status: 'PAUSED' | 'STOPPED' | 'START';
}

export interface GetCampaignParams {
  campaign_id: number;
}

export interface GetCampaignSequenceParams {
  campaign_id: number;
}

export interface ListCampaignsParams {
  limit?: number;
  offset?: number;
}

export interface SaveCampaignSequenceParams {
  campaign_id: number;
  sequence: Array<{
    seq_number: number;
    seq_delay_details: {
      delay_in_days: number;
    };
    variant_distribution_type: 'MANUAL_EQUAL' | 'MANUAL_PERCENTAGE' | 'AI_EQUAL';
    lead_distribution_percentage?: number;
    winning_metric_property?: 'OPEN_RATE' | 'CLICK_RATE' | 'REPLY_RATE' | 'POSITIVE_REPLY_RATE';
    seq_variants: Array<{
      subject: string;
      email_body: string;
      variant_label: string;
      id?: number;
      variant_distribution_percentage?: number;
    }>;
  }>;
}

// New interface definitions for remaining campaign management endpoints
export interface GetCampaignsByLeadParams {
  lead_id: number;
}

export interface ExportCampaignLeadsParams {
  campaign_id: number;
}

export interface DeleteCampaignParams {
  campaign_id: number;
}

export interface GetCampaignAnalyticsByDateParams {
  campaign_id: number;
  start_date: string;
  end_date: string;
}

export interface GetCampaignSequenceAnalyticsParams {
  campaign_id: number;
  start_date: string;
  end_date: string;
  time_zone?: string;
}

// Type guards
export function isCreateCampaignParams(args: unknown): args is CreateCampaignParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as { name: unknown }).name === 'string'
  );
}

export function isUpdateCampaignScheduleParams(args: unknown): args is UpdateCampaignScheduleParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number'
  );
}

export function isUpdateCampaignSettingsParams(args: unknown): args is UpdateCampaignSettingsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number'
  );
}

export function isUpdateCampaignStatusParams(args: unknown): args is UpdateCampaignStatusParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number' &&
    'status' in args &&
    typeof (args as { status: unknown }).status === 'string' &&
    ['PAUSED', 'STOPPED', 'START'].includes((args as { status: string }).status)
  );
}

export function isGetCampaignParams(args: unknown): args is GetCampaignParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number'
  );
}

export function isGetCampaignSequenceParams(args: unknown): args is GetCampaignSequenceParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number'
  );
}

export function isListCampaignsParams(args: unknown): args is ListCampaignsParams {
  if (typeof args !== 'object' || args === null) {
    return false;
  }

  const params = args as ListCampaignsParams;
  
  // Optional limit must be a number if present
  if (params.limit !== undefined && typeof params.limit !== 'number') {
    return false;
  }
  
  // Optional offset must be a number if present
  if (params.offset !== undefined && typeof params.offset !== 'number') {
    return false;
  }
  
  return true;
}

export function isSaveCampaignSequenceParams(args: unknown): args is SaveCampaignSequenceParams {
  if (
    typeof args !== 'object' ||
    args === null ||
    !('campaign_id' in args) ||
    typeof (args as { campaign_id: unknown }).campaign_id !== 'number' ||
    !('sequence' in args) ||
    !Array.isArray((args as { sequence: unknown }).sequence)
  ) {
    return false;
  }

  const sequence = (args as { sequence: unknown[] }).sequence;
  return sequence.every(isValidSequenceItem);
}

// New type guards for the remaining campaign management endpoints
export function isGetCampaignsByLeadParams(args: unknown): args is GetCampaignsByLeadParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'lead_id' in args &&
    typeof (args as { lead_id: unknown }).lead_id === 'number'
  );
}

export function isExportCampaignLeadsParams(args: unknown): args is ExportCampaignLeadsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number'
  );
}

export function isDeleteCampaignParams(args: unknown): args is DeleteCampaignParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number'
  );
}

export function isGetCampaignAnalyticsByDateParams(args: unknown): args is GetCampaignAnalyticsByDateParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number' &&
    'start_date' in args &&
    typeof (args as { start_date: unknown }).start_date === 'string' &&
    'end_date' in args &&
    typeof (args as { end_date: unknown }).end_date === 'string'
  );
}

export function isGetCampaignSequenceAnalyticsParams(args: unknown): args is GetCampaignSequenceAnalyticsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as { campaign_id: unknown }).campaign_id === 'number' &&
    'start_date' in args &&
    typeof (args as { start_date: unknown }).start_date === 'string' &&
    'end_date' in args &&
    typeof (args as { end_date: unknown }).end_date === 'string'
  );
}

function isValidSequenceItem(item: unknown): boolean {
  return (
    typeof item === 'object' &&
    item !== null &&
    'seq_number' in item &&
    typeof (item as { seq_number: unknown }).seq_number === 'number' &&
    'seq_delay_details' in item &&
    typeof (item as { seq_delay_details: unknown }).seq_delay_details === 'object' &&
    (item as { seq_delay_details: unknown }).seq_delay_details !== null &&
    'delay_in_days' in (item as { seq_delay_details: { delay_in_days: unknown } }).seq_delay_details &&
    typeof (item as { seq_delay_details: { delay_in_days: unknown } }).seq_delay_details.delay_in_days === 'number' &&
    'variant_distribution_type' in item &&
    typeof (item as { variant_distribution_type: unknown }).variant_distribution_type === 'string' &&
    'seq_variants' in item &&
    Array.isArray((item as { seq_variants: unknown[] }).seq_variants) &&
    (item as { seq_variants: unknown[] }).seq_variants.every(
      (variant) =>
        typeof variant === 'object' &&
        variant !== null &&
        'subject' in variant &&
        typeof (variant as { subject: unknown }).subject === 'string' &&
        'email_body' in variant &&
        typeof (variant as { email_body: unknown }).email_body === 'string' &&
        'variant_label' in variant &&
        typeof (variant as { variant_label: unknown }).variant_label === 'string'
    )
  );
} 