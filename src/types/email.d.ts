// Type declarations for Email Account parameters
declare module '../types/email.js' {
  export function isListEmailAccountsParams(args: unknown): args is ListEmailAccountsParams;
  export function isAddEmailToCampaignParams(args: unknown): args is AddEmailToCampaignParams;
  export function isRemoveEmailFromCampaignParams(args: unknown): args is RemoveEmailFromCampaignParams;
  export function isFetchEmailAccountsParams(args: unknown): args is FetchEmailAccountsParams;
  export function isCreateEmailAccountParams(args: unknown): args is CreateEmailAccountParams;
  export function isUpdateEmailAccountParams(args: unknown): args is UpdateEmailAccountParams;
  export function isFetchEmailAccountByIdParams(args: unknown): args is FetchEmailAccountByIdParams;
  export function isUpdateEmailWarmupParams(args: unknown): args is UpdateEmailWarmupParams;
  export function isReconnectEmailAccountParams(args: unknown): args is ReconnectEmailAccountParams;
  export function isUpdateEmailAccountTagParams(args: unknown): args is UpdateEmailAccountTagParams;

  export interface ListEmailAccountsParams {
    campaign_id?: number;
    status?: string;
    limit?: number;
    offset?: number;
  }

  export interface AddEmailToCampaignParams {
    campaign_id: number;
    email_account_id: number;
  }

  export interface RemoveEmailFromCampaignParams {
    campaign_id: number;
    email_account_id: number;
  }

  export interface FetchEmailAccountsParams {
    status?: string;
    limit?: number;
    offset?: number;
    username?: string;
    client_id?: number;
  }

  export interface CreateEmailAccountParams {
    from_name: string;
    from_email: string;
    user_name: string;
    password: string;
    smtp_host: string;
    smtp_port: number;
    imap_host: string;
    imap_port: number;
    max_email_per_day?: number;
    custom_tracking_url?: string;
    bcc?: string;
    signature?: string;
    warmup_enabled?: boolean;
    total_warmup_per_day?: number;
    daily_rampup?: number;
    reply_rate_percentage?: number;
    client_id?: number;
  }

  export interface UpdateEmailAccountParams {
    email_account_id: number;
    max_email_per_day?: number;
    custom_tracking_url?: string;
    bcc?: string;
    signature?: string;
    client_id?: number | null;
    time_to_wait_in_mins?: number;
  }

  export interface FetchEmailAccountByIdParams {
    email_account_id: number;
  }

  export interface UpdateEmailWarmupParams {
    email_account_id: number;
    warmup_enabled: string;
    total_warmup_per_day?: number;
    daily_rampup?: number;
    reply_rate_percentage?: string;
    warmup_key_id?: string;
  }

  export interface ReconnectEmailAccountParams {
    email_account_id: number;
    connection_details?: {
      smtp_host?: string;
      smtp_port?: number;
      smtp_username?: string;
      smtp_password?: string;
      imap_host?: string;
      imap_port?: number;
      imap_username?: string;
      imap_password?: string;
      oauth_token?: string;
    };
  }

  export interface UpdateEmailAccountTagParams {
    id: number;
    name: string;
    color: string;
  }

  export interface EmailAccount {
    id: number;
    email: string;
    name?: string;
    provider: string;
    status: string;
    created_at: string;
    updated_at: string;
    last_checked_at?: string;
    warmup_enabled: boolean;
    daily_limit?: number;
    tags?: string[];
  }

  export interface EmailAccountResponse {
    success: boolean;
    data: EmailAccount;
    message?: string;
  }

  export interface EmailAccountListResponse {
    success: boolean;
    data: {
      accounts: EmailAccount[];
      total: number;
    };
    message?: string;
  }

  export interface EmailAccountActionResponse {
    success: boolean;
    message: string;
  }
} 