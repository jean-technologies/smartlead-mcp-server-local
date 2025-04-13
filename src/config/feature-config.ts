// Configuration for enabling/disabling feature categories
export const enabledCategories = {
  campaignManagement: false,
  emailAccountManagement: false,
  leadManagement: false,
  campaignStatistics: true,
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
  extendedLogging: process.env.EXTENDED_LOGGING === 'true'
};

// Helper function to check if a tool should be enabled
export function isToolEnabled(toolName: string, category: string): boolean {
  // Check if the tool has a specific override
  if (enabledTools[toolName] !== undefined) {
    return enabledTools[toolName];
  }
  
  // Otherwise, check if the category is enabled
  const categoryKey = category as keyof typeof enabledCategories;
  return enabledCategories[categoryKey] || false;
} 