import { AxiosInstance } from 'axios';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { 
  isGetRegionWiseProvidersParams,
  isCreateManualPlacementTestParams,
  isCreateAutomatedPlacementTestParams,
  isGetSpamTestDetailsParams,
  isDeleteSmartDeliveryTestsParams,
  isStopAutomatedTestParams,
  isListAllTestsParams,
  isProviderWiseReportParams,
  isGroupWiseReportParams,
  isSenderAccountWiseReportParams,
  isSpamFilterDetailsParams,
  isDkimDetailsParams,
  isSpfDetailsParams,
  isRdnsDetailsParams,
  isSenderAccountsParams,
  isBlacklistParams,
  isEmailContentParams,
  isIpAnalyticsParams,
  isEmailHeadersParams,
  isScheduleHistoryParams,
  isIpDetailsParams,
  isMailboxSummaryParams,
  isMailboxCountParams,
  isGetAllFoldersParams,
  isCreateFolderParams,
  isGetFolderByIdParams,
  isDeleteFolderParams
} from '../types/smartDelivery.js';

// SmartDelivery API base URL
const SMART_DELIVERY_API_URL = 'https://smartdelivery.smartlead.ai/api/v1';

// Handler for SmartDelivery-related tools
export async function handleSmartDeliveryTool(
  toolName: string, 
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  switch (toolName) {
    case 'smartlead_get_region_wise_providers': {
      return handleGetRegionWiseProviders(args, apiClient, withRetry);
    }
    case 'smartlead_create_manual_placement_test': {
      return handleCreateManualPlacementTest(args, apiClient, withRetry);
    }
    case 'smartlead_create_automated_placement_test': {
      return handleCreateAutomatedPlacementTest(args, apiClient, withRetry);
    }
    case 'smartlead_get_spam_test_details': {
      return handleGetSpamTestDetails(args, apiClient, withRetry);
    }
    case 'smartlead_delete_smart_delivery_tests': {
      return handleDeleteSmartDeliveryTests(args, apiClient, withRetry);
    }
    case 'smartlead_stop_automated_test': {
      return handleStopAutomatedTest(args, apiClient, withRetry);
    }
    case 'smartlead_list_all_tests': {
      return handleListAllTests(args, apiClient, withRetry);
    }
    case 'smartlead_get_provider_wise_report': {
      return handleGetProviderWiseReport(args, apiClient, withRetry);
    }
    case 'smartlead_get_group_wise_report': {
      return handleGetGroupWiseReport(args, apiClient, withRetry);
    }
    case 'smartlead_get_sender_account_wise_report': {
      return handleGetSenderAccountWiseReport(args, apiClient, withRetry);
    }
    case 'smartlead_get_spam_filter_details': {
      return handleGetSpamFilterDetails(args, apiClient, withRetry);
    }
    case 'smartlead_get_dkim_details': {
      return handleGetDkimDetails(args, apiClient, withRetry);
    }
    case 'smartlead_get_spf_details': {
      return handleGetSpfDetails(args, apiClient, withRetry);
    }
    case 'smartlead_get_rdns_details': {
      return handleGetRdnsDetails(args, apiClient, withRetry);
    }
    case 'smartlead_get_sender_accounts': {
      return handleGetSenderAccounts(args, apiClient, withRetry);
    }
    case 'smartlead_get_blacklist': {
      return handleGetBlacklist(args, apiClient, withRetry);
    }
    case 'smartlead_get_email_content': {
      return handleGetEmailContent(args, apiClient, withRetry);
    }
    case 'smartlead_get_ip_analytics': {
      return handleGetIpAnalytics(args, apiClient, withRetry);
    }
    case 'smartlead_get_email_headers': {
      return handleGetEmailHeaders(args, apiClient, withRetry);
    }
    case 'smartlead_get_schedule_history': {
      return handleGetScheduleHistory(args, apiClient, withRetry);
    }
    case 'smartlead_get_ip_details': {
      return handleGetIpDetails(args, apiClient, withRetry);
    }
    case 'smartlead_get_mailbox_summary': {
      return handleGetMailboxSummary(args, apiClient, withRetry);
    }
    case 'smartlead_get_mailbox_count': {
      return handleGetMailboxCount(args, apiClient, withRetry);
    }
    case 'smartlead_get_all_folders': {
      return handleGetAllFolders(args, apiClient, withRetry);
    }
    case 'smartlead_create_folder': {
      return handleCreateFolder(args, apiClient, withRetry);
    }
    case 'smartlead_get_folder_by_id': {
      return handleGetFolderById(args, apiClient, withRetry);
    }
    case 'smartlead_delete_folder': {
      return handleDeleteFolder(args, apiClient, withRetry);
    }
    default:
      throw new Error(`Unknown SmartDelivery tool: ${toolName}`);
  }
}

// Create a modified client for SmartDelivery API with the correct base URL
function createSmartDeliveryClient(apiClient: AxiosInstance) {
  return {
    get: (url: string, config?: any) => 
      apiClient.get(`${SMART_DELIVERY_API_URL}${url}`, config),
    post: (url: string, data?: any, config?: any) => 
      apiClient.post(`${SMART_DELIVERY_API_URL}${url}`, data, config),
    put: (url: string, data?: any, config?: any) => 
      apiClient.put(`${SMART_DELIVERY_API_URL}${url}`, data, config),
    delete: (url: string, config?: any) => 
      apiClient.delete(`${SMART_DELIVERY_API_URL}${url}`, config)
  };
}

// Individual handlers for each tool
async function handleGetRegionWiseProviders(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetRegionWiseProvidersParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_region_wise_providers'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    
    const response = await withRetry(
      async () => smartDeliveryClient.get('/spam-test/seed/providers'),
      'get region wise providers'
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

async function handleCreateManualPlacementTest(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isCreateManualPlacementTestParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_create_manual_placement_test'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    
    const response = await withRetry(
      async () => smartDeliveryClient.post('/spam-test/manual', args),
      'create manual placement test'
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

async function handleCreateAutomatedPlacementTest(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isCreateAutomatedPlacementTestParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_create_automated_placement_test'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    
    const response = await withRetry(
      async () => smartDeliveryClient.post('/spam-test/schedule', args),
      'create automated placement test'
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

async function handleGetSpamTestDetails(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetSpamTestDetailsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_spam_test_details'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/${spam_test_id}`),
      'get spam test details'
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

async function handleDeleteSmartDeliveryTests(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isDeleteSmartDeliveryTestsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_delete_smart_delivery_tests'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    
    const response = await withRetry(
      async () => smartDeliveryClient.post('/spam-test/delete', args),
      'delete smart delivery tests'
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

async function handleStopAutomatedTest(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isStopAutomatedTestParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_stop_automated_test'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.put(`/spam-test/${spam_test_id}/stop`),
      'stop automated test'
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

async function handleListAllTests(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isListAllTestsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_list_all_tests'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { testType, limit = 10, offset = 0 } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.post(`/spam-test/report?testType=${testType}`, { limit, offset }),
      'list all tests'
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

async function handleGetProviderWiseReport(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isProviderWiseReportParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_provider_wise_report'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.post(`/spam-test/report/${spam_test_id}/providerwise`),
      'get provider wise report'
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

async function handleGetGroupWiseReport(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGroupWiseReportParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_group_wise_report'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.post(`/spam-test/report/${spam_test_id}/groupwise`),
      'get group wise report'
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

async function handleGetSenderAccountWiseReport(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isSenderAccountWiseReportParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_sender_account_wise_report'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/sender-account-wise`),
      'get sender account wise report'
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

async function handleGetSpamFilterDetails(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isSpamFilterDetailsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_spam_filter_details'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/spam-filter-details`),
      'get spam filter details'
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

async function handleGetDkimDetails(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isDkimDetailsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_dkim_details'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/dkim-details`),
      'get DKIM details'
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

async function handleGetSpfDetails(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isSpfDetailsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_spf_details'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/spf-details`),
      'get SPF details'
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

async function handleGetRdnsDetails(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isRdnsDetailsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_rdns_details'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/rdns-details`),
      'get rDNS details'
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

async function handleGetSenderAccounts(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isSenderAccountsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_sender_accounts'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/sender-accounts`),
      'get sender accounts'
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

async function handleGetBlacklist(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isBlacklistParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_blacklist'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/blacklist`),
      'get blacklist'
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

async function handleGetEmailContent(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isEmailContentParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_email_content'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/email-content`),
      'get email content'
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

async function handleGetIpAnalytics(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isIpAnalyticsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_ip_analytics'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/ip-analytics`),
      'get IP analytics'
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

async function handleGetEmailHeaders(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isEmailHeadersParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_email_headers'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id, reply_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/sender-account-wise/${reply_id}/email-headers`),
      'get email headers'
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

async function handleGetScheduleHistory(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isScheduleHistoryParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_schedule_history'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/schedule-history`),
      'get schedule history'
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

async function handleGetIpDetails(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isIpDetailsParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_ip_details'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { spam_test_id, reply_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/${spam_test_id}/sender-account-wise/${reply_id}/ip-details`),
      'get IP details'
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

async function handleGetMailboxSummary(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isMailboxSummaryParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_mailbox_summary'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { limit = 10, offset = 0 } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/report/mailboxes-summary?limit=${limit}&offset=${offset}`),
      'get mailbox summary'
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

async function handleGetMailboxCount(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isMailboxCountParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_mailbox_count'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    
    const response = await withRetry(
      async () => smartDeliveryClient.get('/spam-test/report/mailboxes-count'),
      'get mailbox count'
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

async function handleGetAllFolders(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetAllFoldersParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_all_folders'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { limit = 10, offset = 0, name = '' } = args;
    
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('offset', offset.toString());
    if (name) {
      queryParams.append('name', name);
    }
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/folder?${queryParams.toString()}`),
      'get all folders'
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

async function handleCreateFolder(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isCreateFolderParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_create_folder'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { name } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.post('/spam-test/folder', { name }),
      'create folder'
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

async function handleGetFolderById(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isGetFolderByIdParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_get_folder_by_id'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { folder_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.get(`/spam-test/folder/${folder_id}`),
      'get folder by ID'
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

async function handleDeleteFolder(
  args: unknown, 
  apiClient: AxiosInstance,
  withRetry: <T>(operation: () => Promise<T>, context: string) => Promise<T>
) {
  if (!isDeleteFolderParams(args)) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'Invalid arguments for smartlead_delete_folder'
    );
  }

  try {
    const smartDeliveryClient = createSmartDeliveryClient(apiClient);
    const { folder_id } = args;
    
    const response = await withRetry(
      async () => smartDeliveryClient.delete(`/spam-test/folder/${folder_id}`),
      'delete folder'
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