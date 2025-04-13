// Type definitions for Smart Senders functionality

// Get Vendors
export interface GetVendorsParams {
  // This endpoint doesn't require specific parameters beyond the API key
  // which is handled at the API client level
}

// Search Domain
export interface SearchDomainParams {
  domain_name: string;
  vendor_id: number;
}

// Mailbox details for auto-generate and order placement
export interface MailboxDetail {
  first_name: string;
  last_name: string;
  profile_pic?: string;
  mailbox?: string; // Required only for place-order
}

// Domain with mailbox details for auto-generate
export interface DomainWithMailboxes {
  domain_name: string;
  mailbox_details: MailboxDetail[];
}

// Auto-generate Mailboxes
export interface AutoGenerateMailboxesParams {
  vendor_id: number;
  domains: DomainWithMailboxes[];
}

// Place order for mailboxes
export interface PlaceOrderParams {
  vendor_id: number;
  forwarding_domain: string;
  domains: DomainWithMailboxes[];
}

// Get Domain List
export interface GetDomainListParams {
  // This endpoint doesn't require specific parameters beyond the API key
  // which is handled at the API client level
}

// Type guards
export function isGetVendorsParams(args: unknown): args is GetVendorsParams {
  // Since this endpoint doesn't require specific parameters beyond the API key
  // Any object is valid
  return typeof args === 'object' && args !== null;
}

export function isSearchDomainParams(args: unknown): args is SearchDomainParams {
  if (typeof args !== 'object' || args === null) return false;
  
  const params = args as Partial<SearchDomainParams>;
  
  return (
    typeof params.domain_name === 'string' &&
    typeof params.vendor_id === 'number'
  );
}

export function isMailboxDetail(obj: unknown): obj is MailboxDetail {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const detail = obj as Partial<MailboxDetail>;
  
  return (
    typeof detail.first_name === 'string' &&
    typeof detail.last_name === 'string' &&
    (detail.profile_pic === undefined || typeof detail.profile_pic === 'string') &&
    (detail.mailbox === undefined || typeof detail.mailbox === 'string')
  );
}

export function isDomainWithMailboxes(obj: unknown): obj is DomainWithMailboxes {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const domain = obj as Partial<DomainWithMailboxes>;
  
  return (
    typeof domain.domain_name === 'string' &&
    Array.isArray(domain.mailbox_details) &&
    domain.mailbox_details.every(detail => isMailboxDetail(detail))
  );
}

export function isAutoGenerateMailboxesParams(args: unknown): args is AutoGenerateMailboxesParams {
  if (typeof args !== 'object' || args === null) return false;
  
  const params = args as Partial<AutoGenerateMailboxesParams>;
  
  return (
    typeof params.vendor_id === 'number' &&
    Array.isArray(params.domains) &&
    params.domains.every(domain => isDomainWithMailboxes(domain))
  );
}

export function isPlaceOrderParams(args: unknown): args is PlaceOrderParams {
  if (typeof args !== 'object' || args === null) return false;
  
  const params = args as Partial<PlaceOrderParams>;
  
  // Check if domains have mailbox property in mailbox_details
  const domainsHaveMailboxes = Array.isArray(params.domains) && 
    params.domains.every(domain => 
      isDomainWithMailboxes(domain) && 
      domain.mailbox_details.every(detail => typeof detail.mailbox === 'string')
    );
  
  return (
    typeof params.vendor_id === 'number' &&
    typeof params.forwarding_domain === 'string' &&
    domainsHaveMailboxes
  );
}

export function isGetDomainListParams(args: unknown): args is GetDomainListParams {
  // Since this endpoint doesn't require specific parameters beyond the API key
  // Any object is valid
  return typeof args === 'object' && args !== null;
} 