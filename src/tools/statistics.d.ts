// Type declarations for Statistics tools
declare module './tools/statistics.js' {
  import { CategoryTool } from '../types/common.js';
  
  export const CAMPAIGN_STATISTICS_TOOL: CategoryTool;
  export const CAMPAIGN_STATISTICS_BY_DATE_TOOL: CategoryTool;
  export const WARMUP_STATS_BY_EMAIL_TOOL: CategoryTool;
  export const CAMPAIGN_TOP_LEVEL_ANALYTICS_TOOL: CategoryTool;
  export const CAMPAIGN_TOP_LEVEL_ANALYTICS_BY_DATE_TOOL: CategoryTool;
  export const CAMPAIGN_LEAD_STATISTICS_TOOL: CategoryTool;
  export const CAMPAIGN_MAILBOX_STATISTICS_TOOL: CategoryTool;
  
  export const statisticsTools: CategoryTool[];
} 