import { AxiosError } from 'axios';

// Type guards for Email Account parameters
export function isListEmailAccountsParams(args: unknown): args is ListEmailAccountsParams {
  if (!args || typeof args !== 'object') return false;
  return true;
}

export function isAddEmailToCampaignParams(args: unknown): args is AddEmailToCampaignParams {
  if (!args || typeof args !== 'object') return false;
  const { campaign_id, email_account_id } = args as Partial<AddEmailToCampaignParams>;
  return (
    typeof campaign_id === 'number' &&
    typeof email_account_id === 'number'
  );
}

export function isRemoveEmailFromCampaignParams(args: unknown): args is RemoveEmailFromCampaignParams {
  if (!args || typeof args !== 'object') return false;
  const { campaign_id, email_account_id } = args as Partial<RemoveEmailFromCampaignParams>;
  return (
    typeof campaign_id === 'number' &&
    typeof email_account_id === 'number'
  );
}

export function isFetchEmailAccountsParams(args: unknown): args is FetchEmailAccountsParams {
  if (!args || typeof args !== 'object') return false;
  return true;
}

export function isCreateEmailAccountParams(args: unknown): args is CreateEmailAccountParams {
  if (!args || typeof args !== 'object') return false;
  const { from_name, from_email, user_name, password, smtp_host, smtp_port, imap_host, imap_port } = args as Partial<CreateEmailAccountParams>;
  return (
    typeof from_name === 'string' &&
    typeof from_email === 'string' &&
    typeof user_name === 'string' &&
    typeof password === 'string' &&
    typeof smtp_host === 'string' &&
    typeof smtp_port === 'number' &&
    typeof imap_host === 'string' &&
    typeof imap_port === 'number'
  );
}

export function isUpdateEmailAccountParams(args: unknown): args is UpdateEmailAccountParams {
  if (!args || typeof args !== 'object') return false;
  const { email_account_id } = args as Partial<UpdateEmailAccountParams>;
  return typeof email_account_id === 'number';
}

export function isFetchEmailAccountByIdParams(args: unknown): args is FetchEmailAccountByIdParams {
  if (!args || typeof args !== 'object') return false;
  const { email_account_id } = args as Partial<FetchEmailAccountByIdParams>;
  return typeof email_account_id === 'number';
}

export function isUpdateEmailWarmupParams(args: unknown): args is UpdateEmailWarmupParams {
  if (!args || typeof args !== 'object') return false;
  const { email_account_id, warmup_enabled } = args as Partial<UpdateEmailWarmupParams>;
  return (
    typeof email_account_id === 'number' &&
    typeof warmup_enabled === 'string'
  );
}

export function isReconnectEmailAccountParams(args: unknown): args is ReconnectEmailAccountParams {
  if (!args || typeof args !== 'object') return false;
  const { email_account_id } = args as Partial<ReconnectEmailAccountParams>;
  return typeof email_account_id === 'number';
}

export function isUpdateEmailAccountTagParams(args: unknown): args is UpdateEmailAccountTagParams {
  if (!args || typeof args !== 'object') return false;
  const { id, name, color } = args as Partial<UpdateEmailAccountTagParams>;
  return (
    typeof id === 'number' &&
    typeof name === 'string' &&
    typeof color === 'string'
  );
}

// Interface definitions for Email Account parameters
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
  client_id?: number; // Required Client ID according to the docs
}

export interface CreateEmailAccountParams {
  from_name: string;         // User's name
  from_email: string;        // User email
  user_name: string;         // Username
  password: string;          // User's password
  smtp_host: string;         // Mail SMTP host
  smtp_port: number;         // Mail SMTP port
  imap_host: string;         // Imap host URL
  imap_port: number;         // Imap port
  max_email_per_day?: number; // Max number of emails per day
  custom_tracking_url?: string; // Custom email tracking url
  bcc?: string;              // Email BCC
  signature?: string;        // Email signature
  warmup_enabled?: boolean;  // Set true to enable warmup
  total_warmup_per_day?: number; // Total number of warmups per day
  daily_rampup?: number;     // Daily rampup number
  reply_rate_percentage?: number; // Reply rate in percentage
  client_id?: number;        // Client ID
}

export interface UpdateEmailAccountParams {
  email_account_id: number;          // ID of the email to update
  max_email_per_day?: number;        // Max number of emails per day
  custom_tracking_url?: string;      // Custom email tracking URL
  bcc?: string;                      // Email BCC
  signature?: string;                // Email signature
  client_id?: number | null;         // Client ID. Set to null if not needed
  time_to_wait_in_mins?: number;     // Minimum integer time (in minutes) to wait before sending next email
}

export interface FetchEmailAccountByIdParams {
  email_account_id: number;
}

export interface UpdateEmailWarmupParams {
  email_account_id: number;          // Email account ID
  warmup_enabled: string;            // Set false to disable warmup
  total_warmup_per_day?: number;     // Total number of warmups in a day
  daily_rampup?: number;             // Set this value to increase or decrease daily ramup in warmup emails
  reply_rate_percentage?: string;    // Reply rate in percentage
  warmup_key_id?: string;            // If passed will update the custom warmup-key identifier
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
  id: number;              // ID of the tag
  name: string;            // Name of the tag
  color: string;           // The color of the tag in HEX format
}

// Email Account response interfaces
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