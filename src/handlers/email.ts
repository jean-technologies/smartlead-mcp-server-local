import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
  isListEmailAccountsParams,
  isAddEmailToCampaignParams,
  isRemoveEmailFromCampaignParams,
  isFetchEmailAccountsParams,
  isCreateEmailAccountParams,
  isUpdateEmailAccountParams,
  isFetchEmailAccountByIdParams,
  isUpdateEmailWarmupParams,
  isReconnectEmailAccountParams,
  isUpdateEmailAccountTagParams,
  ListEmailAccountsParams,
  AddEmailToCampaignParams,
  RemoveEmailFromCampaignParams,
  FetchEmailAccountsParams,
  UpdateEmailAccountParams,
  FetchEmailAccountByIdParams,
  UpdateEmailWarmupParams,
  UpdateEmailAccountTagParams,
  CreateEmailAccountParams
} from '../types/email.js';

// Handler for email-related tools
export async function handleEmailTool(
  toolName: string,
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  switch (toolName) {
    case 'smartlead_list_email_accounts_campaign': {
      return handleListEmailAccountsCampaign(args, apiClient, withRetry);
    }
    case 'smartlead_add_email_to_campaign': {
      return handleAddEmailToCampaign(args, apiClient, withRetry);
    }
    case 'smartlead_remove_email_from_campaign': {
      return handleRemoveEmailFromCampaign(args, apiClient, withRetry);
    }
    case 'smartlead_fetch_email_accounts': {
      return handleFetchEmailAccounts(args, apiClient, withRetry);
    }
    case 'smartlead_create_email_account': {
      return handleCreateEmailAccount(args, apiClient, withRetry);
    }
    case 'smartlead_update_email_account': {
      return handleUpdateEmailAccount(args, apiClient, withRetry);
    }
    case 'smartlead_fetch_email_account_by_id': {
      return handleFetchEmailAccountById(args, apiClient, withRetry);
    }
    case 'smartlead_update_email_warmup': {
      return handleUpdateEmailWarmup(args, apiClient, withRetry);
    }
    case 'smartlead_reconnect_email_account': {
      return handleReconnectEmailAccount(args, apiClient, withRetry);
    }
    case 'smartlead_update_email_account_tag': {
      return handleUpdateEmailAccountTag(args, apiClient, withRetry);
    }
    default:
      throw new Error(`Unknown email tool: ${toolName}`);
  }
}

// Individual handlers for each tool
async function handleListEmailAccountsCampaign(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isListEmailAccountsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_list_email_accounts_campaign'
    );
  }

  const params = args as ListEmailAccountsParams;
  const { campaign_id, status, limit, offset } = params;

  if (!campaign_id) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'campaign_id is required for smartlead_list_email_accounts_campaign'
    );
  }

  // API endpoint: https://server.smartlead.ai/api/v1/campaigns/{campaign_id}/email-accounts
  try {
    const response = await withRetry(
      async () => apiClient.get(`/campaigns/${campaign_id}/email-accounts`),
      'list email accounts for campaign'
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

// Placeholder functions for the other handlers
// These will be implemented once we have the API documentation for these endpoints

async function handleAddEmailToCampaign(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isAddEmailToCampaignParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_add_email_to_campaign'
    );
  }

  const { campaign_id, email_account_id } = args as AddEmailToCampaignParams;

  // API endpoint: https://server.smartlead.ai/api/v1/campaigns/{campaign_id}/email-accounts
  try {
    const response = await withRetry(
      async () => apiClient.post(`/campaigns/${campaign_id}/email-accounts`, {
        email_account_ids: [email_account_id]
      }),
      'add email to campaign'
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

async function handleRemoveEmailFromCampaign(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isRemoveEmailFromCampaignParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_remove_email_from_campaign'
    );
  }

  const { campaign_id, email_account_id } = args as RemoveEmailFromCampaignParams;

  // API endpoint: https://server.smartlead.ai/api/v1/campaigns/{campaign_id}/email-accounts
  try {
    const response = await withRetry(
      async () => apiClient.delete(`/campaigns/${campaign_id}/email-accounts`, {
        data: {
          email_accounts_ids: [email_account_id]
        }
      }),
      'remove email from campaign'
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

async function handleFetchEmailAccounts(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isFetchEmailAccountsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_fetch_email_accounts'
    );
  }

  const { status, limit, offset, username, client_id } = args as FetchEmailAccountsParams;

  // Build query parameters
  const queryParams: Record<string, string | number> = {};
  if (limit !== undefined) queryParams.limit = limit;
  if (offset !== undefined) queryParams.offset = offset;
  if (username) queryParams.username = username;
  if (client_id) queryParams.client_id = client_id;

  // API endpoint: https://server.smartlead.ai/api/v1/email-accounts/
  try {
    const response = await withRetry(
      async () => apiClient.get('/email-accounts/', { params: queryParams }),
      'fetch all email accounts'
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

async function handleCreateEmailAccount(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isCreateEmailAccountParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_create_email_account'
    );
  }

  const createParams = args as CreateEmailAccountParams;

  // API endpoint: https://server.smartlead.ai/api/v1/email-accounts/save
  try {
    const response = await withRetry(
      async () => apiClient.post('/email-accounts/save', { 
        id: null, // Set null to create new email account
        from_name: createParams.from_name,
        from_email: createParams.from_email,
        user_name: createParams.user_name,
        password: createParams.password,
        smtp_host: createParams.smtp_host,
        smtp_port: createParams.smtp_port,
        imap_host: createParams.imap_host,
        imap_port: createParams.imap_port,
        max_email_per_day: createParams.max_email_per_day,
        custom_tracking_url: createParams.custom_tracking_url,
        bcc: createParams.bcc,
        signature: createParams.signature,
        warmup_enabled: createParams.warmup_enabled,
        total_warmup_per_day: createParams.total_warmup_per_day,
        daily_rampup: createParams.daily_rampup,
        reply_rate_percentage: createParams.reply_rate_percentage,
        client_id: createParams.client_id
      }),
      'create email account'
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

async function handleUpdateEmailAccount(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isUpdateEmailAccountParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_update_email_account'
    );
  }

  const { email_account_id, ...updateParams } = args as UpdateEmailAccountParams;

  // API endpoint: https://server.smartlead.ai/api/v1/email-accounts/{email_account_id}
  try {
    const response = await withRetry(
      async () => apiClient.post(`/email-accounts/${email_account_id}`, updateParams),
      'update email account'
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

async function handleFetchEmailAccountById(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isFetchEmailAccountByIdParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_fetch_email_account_by_id'
    );
  }

  const { email_account_id } = args as FetchEmailAccountByIdParams;

  // API endpoint: https://server.smartlead.ai/api/v1/email-accounts/{account_id}/
  try {
    const response = await withRetry(
      async () => apiClient.get(`/email-accounts/${email_account_id}/`),
      'fetch email account by id'
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

async function handleUpdateEmailWarmup(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isUpdateEmailWarmupParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_update_email_warmup'
    );
  }

  const { email_account_id, ...warmupParams } = args as UpdateEmailWarmupParams;

  // API endpoint: https://server.smartlead.ai/api/v1/email-accounts/{email_account_id}/warmup
  try {
    const response = await withRetry(
      async () => apiClient.post(`/email-accounts/${email_account_id}/warmup`, warmupParams),
      'update email warmup'
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

async function handleReconnectEmailAccount(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isReconnectEmailAccountParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_reconnect_email_account'
    );
  }

  // API endpoint: https://server.smartlead.ai/api/v1/email-accounts/reconnect-failed-email-accounts
  try {
    const response = await withRetry(
      async () => apiClient.post('/email-accounts/reconnect-failed-email-accounts', {}),
      'reconnect failed email accounts'
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

async function handleUpdateEmailAccountTag(
  args: unknown,
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isUpdateEmailAccountTagParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_update_email_account_tag'
    );
  }

  const { id, name, color } = args as UpdateEmailAccountTagParams;

  // API endpoint: https://server.smartlead.ai/api/v1/email-accounts/tag-manager
  try {
    const response = await withRetry(
      async () => apiClient.post('/email-accounts/tag-manager', {
        id,
        name,
        color
      }),
      'update email account tag'
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