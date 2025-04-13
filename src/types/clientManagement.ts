// Type definitions for Client Management functionality

// Client permission types
export type ClientPermission = 'reply_master_inbox' | 'full_access' | string;

// Add Client To System
export interface AddClientParams {
  name: string;
  email: string;
  permission: ClientPermission[];
  logo?: string;
  logo_url?: string | null;
  password: string;
}

// Fetch all clients
export interface FetchAllClientsParams {
  // This endpoint doesn't require specific parameters beyond the API key
  // which is handled at the API client level
}

// Type guards
export function isAddClientParams(args: unknown): args is AddClientParams {
  if (typeof args !== 'object' || args === null) return false;
  
  const params = args as Partial<AddClientParams>;
  
  return (
    typeof params.name === 'string' &&
    typeof params.email === 'string' &&
    Array.isArray(params.permission) &&
    params.permission.every(perm => typeof perm === 'string') &&
    typeof params.password === 'string' &&
    (params.logo === undefined || typeof params.logo === 'string') &&
    (params.logo_url === undefined || params.logo_url === null || typeof params.logo_url === 'string')
  );
}

export function isFetchAllClientsParams(args: unknown): args is FetchAllClientsParams {
  // Since this endpoint doesn't require specific parameters beyond the API key
  // Any object is valid
  return typeof args === 'object' && args !== null;
} 