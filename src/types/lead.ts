import { CategoryTool, ToolCategory } from './common.js';

// Interface for listing leads
export interface ListLeadsParams {
  campaign_id?: number;
  status?: string;
  limit?: number;
  offset?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
}

// Interface for getting a single lead
export interface GetLeadParams {
  lead_id: number;
}

// Interface for adding a lead to a campaign
export interface AddLeadToCampaignParams {
  campaign_id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  title?: string;
  phone?: string;
  custom_fields?: Record<string, string>;
}

// Interface for updating a lead
export interface UpdateLeadParams {
  lead_id: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  title?: string;
  phone?: string;
  custom_fields?: Record<string, string>;
}

// Interface for updating lead status
export interface UpdateLeadStatusParams {
  lead_id: number;
  status: string;
}

// Interface for bulk importing leads
export interface BulkImportLeadsParams {
  campaign_id: number;
  leads: Array<{
    email: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    title?: string;
    phone?: string;
    custom_fields?: Record<string, string>;
  }>;
}

// Interface for deleting a lead
export interface DeleteLeadParams {
  lead_id: number;
}

// Type guards for params validation

export function isListLeadsParams(args: unknown): args is ListLeadsParams {
  if (typeof args !== 'object' || args === null) {
    return false;
  }

  const params = args as ListLeadsParams;
  
  // Optional campaign_id must be a number if present
  if (params.campaign_id !== undefined && typeof params.campaign_id !== 'number') {
    return false;
  }
  
  // Optional status must be a string if present
  if (params.status !== undefined && typeof params.status !== 'string') {
    return false;
  }
  
  // Optional limit must be a number if present
  if (params.limit !== undefined && typeof params.limit !== 'number') {
    return false;
  }
  
  // Optional offset must be a number if present
  if (params.offset !== undefined && typeof params.offset !== 'number') {
    return false;
  }
  
  // Optional search must be a string if present
  if (params.search !== undefined && typeof params.search !== 'string') {
    return false;
  }
  
  // Optional start_date must be a string if present
  if (params.start_date !== undefined && typeof params.start_date !== 'string') {
    return false;
  }
  
  // Optional end_date must be a string if present
  if (params.end_date !== undefined && typeof params.end_date !== 'string') {
    return false;
  }
  
  return true;
}

export function isGetLeadParams(args: unknown): args is GetLeadParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'lead_id' in args &&
    typeof (args as { lead_id: unknown }).lead_id === 'number'
  );
}

export function isAddLeadToCampaignParams(args: unknown): args is AddLeadToCampaignParams {
  if (
    typeof args !== 'object' ||
    args === null ||
    !('campaign_id' in args) ||
    !('email' in args) ||
    typeof (args as { campaign_id: unknown }).campaign_id !== 'number' ||
    typeof (args as { email: unknown }).email !== 'string'
  ) {
    return false;
  }
  
  const params = args as AddLeadToCampaignParams;
  
  // Optional fields validation
  if (params.first_name !== undefined && typeof params.first_name !== 'string') {
    return false;
  }
  if (params.last_name !== undefined && typeof params.last_name !== 'string') {
    return false;
  }
  if (params.company !== undefined && typeof params.company !== 'string') {
    return false;
  }
  if (params.title !== undefined && typeof params.title !== 'string') {
    return false;
  }
  if (params.phone !== undefined && typeof params.phone !== 'string') {
    return false;
  }
  if (
    params.custom_fields !== undefined && 
    (typeof params.custom_fields !== 'object' || params.custom_fields === null)
  ) {
    return false;
  }
  
  return true;
}

export function isUpdateLeadParams(args: unknown): args is UpdateLeadParams {
  if (
    typeof args !== 'object' ||
    args === null ||
    !('lead_id' in args) ||
    typeof (args as { lead_id: unknown }).lead_id !== 'number'
  ) {
    return false;
  }
  
  const params = args as UpdateLeadParams;
  
  // Optional fields validation
  if (params.email !== undefined && typeof params.email !== 'string') {
    return false;
  }
  if (params.first_name !== undefined && typeof params.first_name !== 'string') {
    return false;
  }
  if (params.last_name !== undefined && typeof params.last_name !== 'string') {
    return false;
  }
  if (params.company !== undefined && typeof params.company !== 'string') {
    return false;
  }
  if (params.title !== undefined && typeof params.title !== 'string') {
    return false;
  }
  if (params.phone !== undefined && typeof params.phone !== 'string') {
    return false;
  }
  if (
    params.custom_fields !== undefined && 
    (typeof params.custom_fields !== 'object' || params.custom_fields === null)
  ) {
    return false;
  }
  
  return true;
}

export function isUpdateLeadStatusParams(args: unknown): args is UpdateLeadStatusParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'lead_id' in args &&
    'status' in args &&
    typeof (args as { lead_id: unknown }).lead_id === 'number' &&
    typeof (args as { status: unknown }).status === 'string'
  );
}

export function isBulkImportLeadsParams(args: unknown): args is BulkImportLeadsParams {
  if (
    typeof args !== 'object' ||
    args === null ||
    !('campaign_id' in args) ||
    !('leads' in args) ||
    typeof (args as { campaign_id: unknown }).campaign_id !== 'number' ||
    !Array.isArray((args as { leads: unknown }).leads)
  ) {
    return false;
  }
  
  const params = args as BulkImportLeadsParams;
  
  // Validate each lead in the leads array
  for (const lead of params.leads) {
    if (
      typeof lead !== 'object' ||
      lead === null ||
      !('email' in lead) ||
      typeof lead.email !== 'string'
    ) {
      return false;
    }
    
    // Optional fields validation
    if (lead.first_name !== undefined && typeof lead.first_name !== 'string') {
      return false;
    }
    if (lead.last_name !== undefined && typeof lead.last_name !== 'string') {
      return false;
    }
    if (lead.company !== undefined && typeof lead.company !== 'string') {
      return false;
    }
    if (lead.title !== undefined && typeof lead.title !== 'string') {
      return false;
    }
    if (lead.phone !== undefined && typeof lead.phone !== 'string') {
      return false;
    }
    if (
      lead.custom_fields !== undefined && 
      (typeof lead.custom_fields !== 'object' || lead.custom_fields === null)
    ) {
      return false;
    }
  }
  
  return true;
}

export function isDeleteLeadParams(args: unknown): args is DeleteLeadParams {
  return (
    typeof args === 'object' &&
    args !== null &&
    'lead_id' in args &&
    typeof (args as { lead_id: unknown }).lead_id === 'number'
  );
} 