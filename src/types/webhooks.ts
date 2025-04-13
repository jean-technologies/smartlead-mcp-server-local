// Type definitions for Webhooks functionality

// Webhook event types
export enum WebhookEventType {
  EMAIL_SENT = 'EMAIL_SENT',
  EMAIL_OPEN = 'EMAIL_OPEN',
  EMAIL_LINK_CLICK = 'EMAIL_LINK_CLICK',
  EMAIL_REPLY = 'EMAIL_REPLY',
  LEAD_UNSUBSCRIBED = 'LEAD_UNSUBSCRIBED',
  LEAD_CATEGORY_UPDATED = 'LEAD_CATEGORY_UPDATED'
}

// Fetch Webhooks By Campaign ID
export interface FetchWebhooksByCampaignParams {
  campaign_id: string;
}

// Add / Update Campaign Webhook
export interface UpsertCampaignWebhookParams {
  campaign_id: string;
  id?: number | null; // Set to null to create a new webhook
  name: string;
  webhook_url: string;
  event_types: WebhookEventType[];
  categories?: string[];
}

// Delete Campaign Webhook
export interface DeleteCampaignWebhookParams {
  campaign_id: string;
  id: number; // Webhook ID to delete
}

// Get Webhooks Publish Summary [Private Beta]
export interface GetWebhooksPublishSummaryParams {
  campaign_id: string;
  fromTime?: string; // ISO 8601 date-time string
  toTime?: string; // ISO 8601 date-time string
}

// Retrigger Failed Events [Private Beta]
export interface RetriggerFailedEventsParams {
  campaign_id: string;
  fromTime: string; // ISO 8601 date-time string
  toTime: string; // ISO 8601 date-time string
}

// Type guards
export function isFetchWebhooksByCampaignParams(args: unknown): args is FetchWebhooksByCampaignParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as FetchWebhooksByCampaignParams).campaign_id === 'string'
  );
}

export function isUpsertCampaignWebhookParams(args: unknown): args is UpsertCampaignWebhookParams {
  if (typeof args !== 'object' || args === null) return false;
  
  const params = args as Partial<UpsertCampaignWebhookParams>;
  
  return (
    typeof params.campaign_id === 'string' &&
    typeof params.name === 'string' &&
    typeof params.webhook_url === 'string' &&
    Array.isArray(params.event_types) &&
    params.event_types.every(type => 
      Object.values(WebhookEventType).includes(type as WebhookEventType)
    ) &&
    (params.categories === undefined || 
      (Array.isArray(params.categories) && 
       params.categories.every(category => typeof category === 'string')
      )
    ) &&
    (params.id === undefined || params.id === null || typeof params.id === 'number')
  );
}

export function isDeleteCampaignWebhookParams(args: unknown): args is DeleteCampaignWebhookParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'campaign_id' in args &&
    typeof (args as DeleteCampaignWebhookParams).campaign_id === 'string' &&
    'id' in args &&
    typeof (args as DeleteCampaignWebhookParams).id === 'number'
  );
}

export function isGetWebhooksPublishSummaryParams(args: unknown): args is GetWebhooksPublishSummaryParams {
  if (typeof args !== 'object' || args === null) return false;
  
  const params = args as Partial<GetWebhooksPublishSummaryParams>;
  
  return (
    typeof params.campaign_id === 'string' &&
    (params.fromTime === undefined || typeof params.fromTime === 'string') &&
    (params.toTime === undefined || typeof params.toTime === 'string')
  );
}

export function isRetriggerFailedEventsParams(args: unknown): args is RetriggerFailedEventsParams {
  if (typeof args !== 'object' || args === null) return false;
  
  const params = args as Partial<RetriggerFailedEventsParams>;
  
  return (
    typeof params.campaign_id === 'string' &&
    typeof params.fromTime === 'string' &&
    typeof params.toTime === 'string'
  );
} 