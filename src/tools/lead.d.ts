// Type declarations for Lead tools
declare module './tools/lead.js' {
  import { CategoryTool } from '../types/common.js';
  
  export const LIST_LEADS_TOOL: CategoryTool;
  export const GET_LEAD_TOOL: CategoryTool;
  export const ADD_LEAD_TO_CAMPAIGN_TOOL: CategoryTool;
  export const UPDATE_LEAD_TOOL: CategoryTool;
  export const UPDATE_LEAD_STATUS_TOOL: CategoryTool;
  export const BULK_IMPORT_LEADS_TOOL: CategoryTool;
  export const DELETE_LEAD_TOOL: CategoryTool;
  
  export const leadTools: CategoryTool[];
} 