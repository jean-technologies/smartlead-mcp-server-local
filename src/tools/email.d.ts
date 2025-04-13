// Type declarations for Email tools
declare module './tools/email.js' {
  import { CategoryTool } from '../types/common.js';
  
  export const LIST_EMAIL_ACCOUNTS_CAMPAIGN_TOOL: CategoryTool;
  export const ADD_EMAIL_TO_CAMPAIGN_TOOL: CategoryTool;
  export const REMOVE_EMAIL_FROM_CAMPAIGN_TOOL: CategoryTool;
  export const FETCH_EMAIL_ACCOUNTS_TOOL: CategoryTool;
  export const CREATE_EMAIL_ACCOUNT_TOOL: CategoryTool;
  export const UPDATE_EMAIL_ACCOUNT_TOOL: CategoryTool;
  export const FETCH_EMAIL_ACCOUNT_BY_ID_TOOL: CategoryTool;
  export const UPDATE_EMAIL_WARMUP_TOOL: CategoryTool;
  export const RECONNECT_EMAIL_ACCOUNT_TOOL: CategoryTool;
  export const UPDATE_EMAIL_ACCOUNT_TAG_TOOL: CategoryTool;
  
  export const emailTools: CategoryTool[];
} 