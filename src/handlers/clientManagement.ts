import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  isAddClientParams,
  isFetchAllClientsParams
} from '../types/clientManagement.js';

// SmartLead API base URL
const SMARTLEAD_API_URL = 'https://server.smartlead.ai/api/v1';

// Handler for Client Management-related tools
export async function handleClientManagementTool(
  toolName: string,
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  switch (toolName) {
    case 'smartlead_add_client': {
      return handleAddClient(args, apiClient, withRetry);
    }
    case 'smartlead_fetch_all_clients': {
      return handleFetchAllClients(args, apiClient, withRetry);
    }
    default:
      throw new Error(`Unknown Client Management tool: ${toolName}`);
  }
}

// Create a modified client for SmartLead API with the correct base URL
function createSmartLeadClient(apiClient: AxiosInstance) {
  return {
    get: (url: string, config?: any) => 
      apiClient.get(`${SMARTLEAD_API_URL}${url}`, config),
    post: (url: string, data?: any, config?: any) => 
      apiClient.post(`${SMARTLEAD_API_URL}${url}`, data, config),
    put: (url: string, data?: any, config?: any) => 
      apiClient.put(`${SMARTLEAD_API_URL}${url}`, data, config),
    delete: (url: string, config?: any) => 
      apiClient.delete(`${SMARTLEAD_API_URL}${url}`, config)
  };
}

// Individual handlers for each tool
async function handleAddClient(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isAddClientParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_add_client'
    );
  }

  try {
    const smartLeadClient = createSmartLeadClient(apiClient);
    
    const response = await withRetry(
      async () => smartLeadClient.post('/client/save', args),
      'add client'
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

async function handleFetchAllClients(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isFetchAllClientsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_fetch_all_clients'
    );
  }

  try {
    const smartLeadClient = createSmartLeadClient(apiClient);
    
    const response = await withRetry(
      async () => smartLeadClient.get('/client/'),
      'fetch all clients'
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