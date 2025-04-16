import { isCategoryEnabled } from '../licensing/index.js';

// Configuration for enabling/disabling feature categories
// These are the default values when license validation is unavailable
export const enabledCategories = {
  campaignManagement: true,
  emailAccountManagement: false,
  leadManagement: true,
  campaignStatistics: false,
  smartDelivery: false,
  webhooks: false,
  clientManagement: false,
  smartSenders: false
};

// Configuration for enabling/disabling individual tools
// This overrides category settings for specific tools
export const enabledTools: Record<string, boolean> = {
  // Override specific tools if needed
  // Example: To enable a specific tool in a disabled category:
  // smartlead_fetch_campaign_sequence: true,
};

// Feature flags for experimental features
export const featureFlags = {
  betaFeatures: process.env.ENABLE_BETA_FEATURES === 'true',
  extendedLogging: process.env.EXTENDED_LOGGING === 'true',
  n8nIntegration: false // Will be set by license validation
};

// Helper function to check if a tool should be enabled
export async function isToolEnabled(toolName: string, category: string): Promise<boolean> {
  // Check if the tool has a specific override
  if (enabledTools[toolName] !== undefined) {
    return enabledTools[toolName];
  }
  
  // Otherwise, check if the category is enabled by the license
  try {
    return await isCategoryEnabled(category);
  } catch (error) {
    // Fallback to default configuration if license check fails
    console.error(`License validation failed, using default configuration: ${error}`);
    const categoryKey = category as keyof typeof enabledCategories;
    return enabledCategories[categoryKey] || false;
  }
} 