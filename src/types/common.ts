import { Tool } from '@modelcontextprotocol/sdk/types.js';

// Extended Tool type with category information
export interface CategoryTool extends Tool {
  category: string;
}

// Categories enum
export enum ToolCategory {
  CAMPAIGN_MANAGEMENT = 'campaignManagement',
  EMAIL_ACCOUNT_MANAGEMENT = 'emailAccountManagement',
  LEAD_MANAGEMENT = 'leadManagement',
  CAMPAIGN_STATISTICS = 'campaignStatistics',
  SMART_DELIVERY = 'smartDelivery',
  WEBHOOKS = 'webhooks',
  CLIENT_MANAGEMENT = 'clientManagement',
  SMART_SENDERS = 'smartSenders'
} 