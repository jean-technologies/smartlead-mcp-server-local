import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  isGetVendorsParams,
  isSearchDomainParams,
  isAutoGenerateMailboxesParams,
  isPlaceOrderParams,
  isGetDomainListParams
} from '../types/smartSenders.js';

// Smart Senders API base URL - different from the main SmartLead API
const SMART_SENDERS_API_URL = 'https://smart-senders.smartlead.ai/api/v1';

// Handler for Smart Senders-related tools
export async function handleSmartSendersTool(
  toolName: string,
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  switch (toolName) {
    case 'smartlead_get_vendors': {
      return handleGetVendors(args, apiClient, withRetry);
    }
    case 'smartlead_search_domain': {
      return handleSearchDomain(args, apiClient, withRetry);
    }
    case 'smartlead_auto_generate_mailboxes': {
      return handleAutoGenerateMailboxes(args, apiClient, withRetry);
    }
    case 'smartlead_place_order_mailboxes': {
      return handlePlaceOrderMailboxes(args, apiClient, withRetry);
    }
    case 'smartlead_get_domain_list': {
      return handleGetDomainList(args, apiClient, withRetry);
    }
    default:
      throw new Error(`Unknown Smart Senders tool: ${toolName}`);
  }
}

// Create a modified client for Smart Senders API with the correct base URL
function createSmartSendersClient(apiClient: AxiosInstance) {
  return {
    get: (url: string, config?: any) => 
      apiClient.get(`${SMART_SENDERS_API_URL}${url}`, config),
    post: (url: string, data?: any, config?: any) => 
      apiClient.post(`${SMART_SENDERS_API_URL}${url}`, data, config),
    put: (url: string, data?: any, config?: any) => 
      apiClient.put(`${SMART_SENDERS_API_URL}${url}`, data, config),
    delete: (url: string, config?: any) => 
      apiClient.delete(`${SMART_SENDERS_API_URL}${url}`, config)
  };
}

// Individual handlers for each tool
async function handleGetVendors(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetVendorsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_vendors'
    );
  }

  try {
    const smartSendersClient = createSmartSendersClient(apiClient);
    
    const response = await withRetry(
      async () => smartSendersClient.get('/smart-senders/get-vendors'),
      'get vendors'
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
}

async function handleSearchDomain(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isSearchDomainParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_search_domain'
    );
  }

  try {
    const smartSendersClient = createSmartSendersClient(apiClient);
    const { domain_name, vendor_id } = args;
    
    const response = await withRetry(
      async () => smartSendersClient.get(`/smart-senders/search-domain?domain_name=${domain_name}&vendor_id=${vendor_id}`),
      'search domain'
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
}

async function handleAutoGenerateMailboxes(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isAutoGenerateMailboxesParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_auto_generate_mailboxes'
    );
  }

  try {
    const smartSendersClient = createSmartSendersClient(apiClient);
    
    const response = await withRetry(
      async () => smartSendersClient.post('/smart-senders/auto-generate-mailboxes', args),
      'auto-generate mailboxes'
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
}

async function handlePlaceOrderMailboxes(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isPlaceOrderParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_place_order_mailboxes'
    );
  }

  try {
    const smartSendersClient = createSmartSendersClient(apiClient);
    
    const response = await withRetry(
      async () => smartSendersClient.post('/smart-senders/place-order', args),
      'place order for mailboxes'
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
}

async function handleGetDomainList(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetDomainListParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_domain_list'
    );
  }

  try {
    const smartSendersClient = createSmartSendersClient(apiClient);
    
    const response = await withRetry(
      async () => smartSendersClient.get('/smart-senders/get-domain-list'),
      'get domain list'
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error: any) {
    return {
      content: [{ 
        type: 'text', 
        text: `API Error: ${error.response?.data?.message || error.message}` 
      }],
      isError: true,
    };
  }
} 