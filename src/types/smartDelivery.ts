// Type definitions for SmartDelivery functionality

// Region wise Provider IDs response types
export interface SpamTestProvider {
  id: number;
  name: string;
  description?: string;
  region?: string;
  country?: string;
  is_active: boolean;
}

export interface RegionWiseProvidersResponse {
  success: boolean;
  data: {
    providers: SpamTestProvider[];
  };
  message?: string;
}

// Manual Placement Test types
export interface CreateManualPlacementTestParams {
  test_name: string;
  description?: string;
  spam_filters: string[];
  link_checker: boolean;
  campaign_id: number;
  sequence_mapping_id: number;
  provider_ids: number[];
  sender_accounts: string[];
  all_email_sent_without_time_gap: boolean;
  min_time_btwn_emails: number;
  min_time_unit: string;
  is_warmup: boolean;
}

// Automated Placement Test additional types
export interface CreateAutomatedPlacementTestParams extends CreateManualPlacementTestParams {
  schedule_start_time: string;
  test_end_date: string;
  every_days: number;
  tz: string;
  days: number[];
  starHour?: string;
  folder_id?: number;
  scheduler_cron_value?: {
    tz: string;
    days: number[];
  };
}

// Spam Test Details types
export interface GetSpamTestDetailsParams {
  spam_test_id: number;
}

// Delete Smart Delivery Tests types
export interface DeleteSmartDeliveryTestsParams {
  spamTestIds: number[];
}

// Stop Automated Test types
export interface StopAutomatedTestParams {
  spam_test_id: number;
}

// List all Tests types
export interface ListAllTestsParams {
  testType: 'manual' | 'auto';
  limit?: number;
  offset?: number;
}

// Provider wise report types
export interface ProviderWiseReportParams {
  spam_test_id: number;
}

// Geo wise report types
export interface GroupWiseReportParams {
  spam_test_id: number;
}

// Sender Account wise report types
export interface SenderAccountWiseReportParams {
  spam_test_id: number;
}

// Spam filter report types
export interface SpamFilterDetailsParams {
  spam_test_id: number;
}

// DKIM details types
export interface DkimDetailsParams {
  spam_test_id: number;
}

// SPF details types
export interface SpfDetailsParams {
  spam_test_id: number;
}

// rDNS report types
export interface RdnsDetailsParams {
  spam_test_id: number;
}

// Sender Account list types
export interface SenderAccountsParams {
  spam_test_id: number;
}

// Blacklists types
export interface BlacklistParams {
  spam_test_id: number;
}

// Spam test email content types
export interface EmailContentParams {
  spam_test_id: number;
}

// Spam test IP blacklist count types
export interface IpAnalyticsParams {
  spam_test_id: number;
}

// Email reply headers types
export interface EmailHeadersParams {
  spam_test_id: number;
  reply_id: number;
}

// Schedule history for automated tests types
export interface ScheduleHistoryParams {
  spam_test_id: number;
}

// IP details types
export interface IpDetailsParams {
  spam_test_id: number;
  reply_id: number;
}

// Mailbox summary types
export interface MailboxSummaryParams {
  limit?: number;
  offset?: number;
}

// Mailbox count API types
export interface MailboxCountParams {
  // This endpoint doesn't require any specific parameters
}

// Get all folders types
export interface GetAllFoldersParams {
  limit?: number;
  offset?: number;
  name?: string;
}

// Create folders types
export interface CreateFolderParams {
  name: string;
}

// Get folder by ID types
export interface GetFolderByIdParams {
  folder_id: number;
}

// Delete folder types
export interface DeleteFolderParams {
  folder_id: number;
}

// Tool parameter interfaces
export interface GetRegionWiseProvidersParams {
  // This endpoint doesn't require any specific parameters beyond the API key
  // which is handled at the API client level
}

// Type guards
export function isGetRegionWiseProvidersParams(args: unknown): args is GetRegionWiseProvidersParams {
  // Since this tool doesn't require specific parameters, any object is valid
  return typeof args === 'object' && args !== null;
}

export function isCreateManualPlacementTestParams(args: unknown): args is CreateManualPlacementTestParams {
  if (typeof args !== 'object' || args === null) return false;
  
  const params = args as Partial<CreateManualPlacementTestParams>;
  
  return (
    typeof params.test_name === 'string' &&
    Array.isArray(params.spam_filters) &&
    typeof params.link_checker === 'boolean' &&
    typeof params.campaign_id === 'number' &&
    typeof params.sequence_mapping_id === 'number' &&
    Array.isArray(params.provider_ids) &&
    Array.isArray(params.sender_accounts) &&
    typeof params.all_email_sent_without_time_gap === 'boolean' &&
    typeof params.min_time_btwn_emails === 'number' &&
    typeof params.min_time_unit === 'string' &&
    typeof params.is_warmup === 'boolean'
  );
}

export function isCreateAutomatedPlacementTestParams(args: unknown): args is CreateAutomatedPlacementTestParams {
  if (!isCreateManualPlacementTestParams(args)) return false;
  
  const params = args as Partial<CreateAutomatedPlacementTestParams>;
  
  return (
    typeof params.schedule_start_time === 'string' &&
    typeof params.test_end_date === 'string' &&
    typeof params.every_days === 'number' &&
    typeof params.tz === 'string' &&
    Array.isArray(params.days)
  );
}

export function isGetSpamTestDetailsParams(args: unknown): args is GetSpamTestDetailsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as GetSpamTestDetailsParams).spam_test_id === 'number'
  );
}

export function isDeleteSmartDeliveryTestsParams(args: unknown): args is DeleteSmartDeliveryTestsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spamTestIds' in args &&
    Array.isArray((args as DeleteSmartDeliveryTestsParams).spamTestIds) &&
    (args as DeleteSmartDeliveryTestsParams).spamTestIds.every(id => typeof id === 'number')
  );
}

export function isStopAutomatedTestParams(args: unknown): args is StopAutomatedTestParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as StopAutomatedTestParams).spam_test_id === 'number'
  );
}

export function isListAllTestsParams(args: unknown): args is ListAllTestsParams {
  if (typeof args !== 'object' || args === null) return false;
  
  const params = args as Partial<ListAllTestsParams>;
  
  return (
    params.testType === 'manual' || params.testType === 'auto'
  );
}

export function isProviderWiseReportParams(args: unknown): args is ProviderWiseReportParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as ProviderWiseReportParams).spam_test_id === 'number'
  );
}

export function isGroupWiseReportParams(args: unknown): args is GroupWiseReportParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as GroupWiseReportParams).spam_test_id === 'number'
  );
}

export function isSenderAccountWiseReportParams(args: unknown): args is SenderAccountWiseReportParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as SenderAccountWiseReportParams).spam_test_id === 'number'
  );
}

export function isSpamFilterDetailsParams(args: unknown): args is SpamFilterDetailsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as SpamFilterDetailsParams).spam_test_id === 'number'
  );
}

export function isDkimDetailsParams(args: unknown): args is DkimDetailsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as DkimDetailsParams).spam_test_id === 'number'
  );
}

export function isSpfDetailsParams(args: unknown): args is SpfDetailsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as SpfDetailsParams).spam_test_id === 'number'
  );
}

export function isRdnsDetailsParams(args: unknown): args is RdnsDetailsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as RdnsDetailsParams).spam_test_id === 'number'
  );
}

export function isSenderAccountsParams(args: unknown): args is SenderAccountsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as SenderAccountsParams).spam_test_id === 'number'
  );
}

export function isBlacklistParams(args: unknown): args is BlacklistParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as BlacklistParams).spam_test_id === 'number'
  );
}

export function isEmailContentParams(args: unknown): args is EmailContentParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as EmailContentParams).spam_test_id === 'number'
  );
}

export function isIpAnalyticsParams(args: unknown): args is IpAnalyticsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as IpAnalyticsParams).spam_test_id === 'number'
  );
}

export function isEmailHeadersParams(args: unknown): args is EmailHeadersParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as EmailHeadersParams).spam_test_id === 'number' &&
    'reply_id' in args &&
    typeof (args as EmailHeadersParams).reply_id === 'number'
  );
}

export function isScheduleHistoryParams(args: unknown): args is ScheduleHistoryParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as ScheduleHistoryParams).spam_test_id === 'number'
  );
}

export function isIpDetailsParams(args: unknown): args is IpDetailsParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'spam_test_id' in args &&
    typeof (args as IpDetailsParams).spam_test_id === 'number' &&
    'reply_id' in args &&
    typeof (args as IpDetailsParams).reply_id === 'number'
  );
}

export function isMailboxSummaryParams(args: unknown): args is MailboxSummaryParams {
  return typeof args === 'object' && args !== null;
}

export function isMailboxCountParams(args: unknown): args is MailboxCountParams {
  return typeof args === 'object' && args !== null;
}

export function isGetAllFoldersParams(args: unknown): args is GetAllFoldersParams {
  return typeof args === 'object' && args !== null;
}

export function isCreateFolderParams(args: unknown): args is CreateFolderParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'name' in args &&
    typeof (args as CreateFolderParams).name === 'string'
  );
}

export function isGetFolderByIdParams(args: unknown): args is GetFolderByIdParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'folder_id' in args &&
    typeof (args as GetFolderByIdParams).folder_id === 'number'
  );
}

export function isDeleteFolderParams(args: unknown): args is DeleteFolderParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'folder_id' in args &&
    typeof (args as DeleteFolderParams).folder_id === 'number'
  );
}
