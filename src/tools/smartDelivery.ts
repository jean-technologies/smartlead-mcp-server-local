import { CategoryTool, ToolCategory } from '../types/common.js';

// Smart Delivery Tools

export const GET_REGION_WISE_PROVIDERS_TOOL: CategoryTool = {
  name: 'smartlead_get_region_wise_providers',
  description: 'Retrieve the list of all Email Providers for spam testing classified by region/country. These provider IDs are required to create manual or automated spam tests.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      // This endpoint doesn't require any specific parameters beyond the API key
      // which is handled at the API client level
    },
    required: [],
  },
};

export const CREATE_MANUAL_PLACEMENT_TEST_TOOL: CategoryTool = {
  name: 'smartlead_create_manual_placement_test',
  description: 'Create a manual placement test using Smartlead mailboxes to test email deliverability across various email providers.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      test_name: {
        type: 'string',
        description: 'Name of your test',
      },
      description: {
        type: 'string',
        description: 'Description for your test to reference later',
      },
      spam_filters: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of spam filters to test across, e.g. ["spam_assassin"]',
      },
      link_checker: {
        type: 'boolean',
        description: 'Enable to check if domains for links in email body are blacklisted',
      },
      campaign_id: {
        type: 'integer',
        description: 'Campaign ID for which you want to select the sequence to test',
      },
      sequence_mapping_id: {
        type: 'integer',
        description: 'The ID of the sequence or variant you would like to test',
      },
      provider_ids: {
        type: 'array',
        items: { type: 'integer' },
        description: 'Array of provider IDs to send test emails to',
      },
      sender_accounts: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of email addresses to use as senders',
      },
      all_email_sent_without_time_gap: {
        type: 'boolean',
        description: 'Set true to send all emails simultaneously',
      },
      min_time_btwn_emails: {
        type: 'integer',
        description: 'Time gap between each email from each mailbox (if time gap enabled)',
      },
      min_time_unit: {
        type: 'string',
        description: 'Time unit for the time gap (minutes, hours, days)',
      },
      is_warmup: {
        type: 'boolean',
        description: 'Set true to receive positive intent responses and move emails from spam to inbox',
      },
    },
    required: ['test_name', 'spam_filters', 'link_checker', 'campaign_id', 'sequence_mapping_id', 'provider_ids', 'sender_accounts', 'all_email_sent_without_time_gap', 'min_time_btwn_emails', 'min_time_unit', 'is_warmup'],
  },
};

export const CREATE_AUTOMATED_PLACEMENT_TEST_TOOL: CategoryTool = {
  name: 'smartlead_create_automated_placement_test',
  description: 'Create an automated placement test that runs on a schedule using Smart Delivery.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      test_name: {
        type: 'string',
        description: 'Name of your test',
      },
      description: {
        type: 'string',
        description: 'Description for your test to reference later',
      },
      spam_filters: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of spam filters to test across, e.g. ["spam_assassin"]',
      },
      link_checker: {
        type: 'boolean',
        description: 'Enable to check if domains for links in email body are blacklisted',
      },
      campaign_id: {
        type: 'integer',
        description: 'Campaign ID for which you want to select the sequence to test',
      },
      sequence_mapping_id: {
        type: 'integer',
        description: 'The ID of the sequence or variant you would like to test',
      },
      provider_ids: {
        type: 'array',
        items: { type: 'integer' },
        description: 'Array of provider IDs to send test emails to',
      },
      sender_accounts: {
        type: 'array',
        items: { type: 'string' },
        description: 'Array of email addresses to use as senders',
      },
      all_email_sent_without_time_gap: {
        type: 'boolean',
        description: 'Set true to send all emails simultaneously',
      },
      min_time_btwn_emails: {
        type: 'integer',
        description: 'Time gap between each email from each mailbox (if time gap enabled)',
      },
      min_time_unit: {
        type: 'string',
        description: 'Time unit for the time gap (minutes, hours, days)',
      },
      is_warmup: {
        type: 'boolean',
        description: 'Set true to receive positive intent responses and move emails from spam to inbox',
      },
      schedule_start_time: {
        type: 'string',
        description: 'Start date and time to schedule or run the test (ISO format)',
      },
      test_end_date: {
        type: 'string',
        description: 'End date to stop running your test (YYYY-MM-DD format)',
      },
      every_days: {
        type: 'integer',
        description: 'Frequency of how often to run a new test',
      },
      tz: {
        type: 'string',
        description: 'Timezone for scheduling',
      },
      days: {
        type: 'array',
        items: { type: 'integer' },
        description: 'Days of the week to run the test (1-7, where 1 is Monday)',
      },
      starHour: {
        type: 'string',
        description: 'Test start time',
      },
      folder_id: {
        type: 'integer',
        description: 'Folder ID to assign the test to',
      },
    },
    required: ['test_name', 'spam_filters', 'link_checker', 'campaign_id', 'sequence_mapping_id', 'provider_ids', 'sender_accounts', 'all_email_sent_without_time_gap', 'min_time_btwn_emails', 'min_time_unit', 'is_warmup', 'schedule_start_time', 'test_end_date', 'every_days', 'tz', 'days'],
  },
};

export const GET_SPAM_TEST_DETAILS_TOOL: CategoryTool = {
  name: 'smartlead_get_spam_test_details',
  description: 'Retrieve details of a specific spam test by ID.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to retrieve details for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const DELETE_SMART_DELIVERY_TESTS_TOOL: CategoryTool = {
  name: 'smartlead_delete_smart_delivery_tests',
  description: 'Delete multiple Smart Delivery tests in bulk.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spamTestIds: {
        type: 'array',
        items: { type: 'integer' },
        description: 'Array of spam test IDs to delete',
      },
    },
    required: ['spamTestIds'],
  },
};

export const STOP_AUTOMATED_TEST_TOOL: CategoryTool = {
  name: 'smartlead_stop_automated_test',
  description: 'Stop an active automated test before its end date.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the automated test to stop',
      },
    },
    required: ['spam_test_id'],
  },
};

export const LIST_ALL_TESTS_TOOL: CategoryTool = {
  name: 'smartlead_list_all_tests',
  description: 'List all Smart Delivery tests, either manual or automated.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      testType: {
        type: 'string',
        enum: ['manual', 'auto'],
        description: 'Type of tests to list (manual or auto)',
      },
      limit: {
        type: 'integer',
        description: 'Number of tests to retrieve (default: 10)',
      },
      offset: {
        type: 'integer',
        description: 'Offset for pagination (default: 0)',
      },
    },
    required: ['testType'],
  },
};

export const GET_PROVIDER_WISE_REPORT_TOOL: CategoryTool = {
  name: 'smartlead_get_provider_wise_report',
  description: 'Get detailed report of a spam test sorted by email providers.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the provider-wise report for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_GROUP_WISE_REPORT_TOOL: CategoryTool = {
  name: 'smartlead_get_group_wise_report',
  description: 'Get detailed report of a spam test sorted by location (region/country).',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the group-wise report for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_SENDER_ACCOUNT_WISE_REPORT_TOOL: CategoryTool = {
  name: 'smartlead_get_sender_account_wise_report',
  description: 'Get detailed report of a spam test sorted by sender accounts with details of each email from each mailbox.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the sender account-wise report for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_SPAM_FILTER_DETAILS_TOOL: CategoryTool = {
  name: 'smartlead_get_spam_filter_details',
  description: 'Get spam filter report per sender mailbox showing each spam score with details leading to the score.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the spam filter details for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_DKIM_DETAILS_TOOL: CategoryTool = {
  name: 'smartlead_get_dkim_details',
  description: 'Check if DKIM authentication passed or failed for each sender mailbox and receiver account.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the DKIM details for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_SPF_DETAILS_TOOL: CategoryTool = {
  name: 'smartlead_get_spf_details',
  description: 'Check if SPF authentication passed or failed for the test.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the SPF details for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_RDNS_DETAILS_TOOL: CategoryTool = {
  name: 'smartlead_get_rdns_details',
  description: 'Check if rDNS was correct for an IP sending the email.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the rDNS details for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_SENDER_ACCOUNTS_TOOL: CategoryTool = {
  name: 'smartlead_get_sender_accounts',
  description: 'Get the list of all sender accounts selected for a specific spam test.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the sender accounts for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_BLACKLIST_TOOL: CategoryTool = {
  name: 'smartlead_get_blacklist',
  description: 'Get the list of all blacklists per IP per email sent.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the blacklist information for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_EMAIL_CONTENT_TOOL: CategoryTool = {
  name: 'smartlead_get_email_content',
  description: 'Get details for the email content (raw, HTML) along with campaign and sequence details.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the email content for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_IP_ANALYTICS_TOOL: CategoryTool = {
  name: 'smartlead_get_ip_analytics',
  description: 'Get total blacklist count identified in the test.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test to get the IP analytics for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_EMAIL_HEADERS_TOOL: CategoryTool = {
  name: 'smartlead_get_email_headers',
  description: 'Get details of the email headers for a specific email.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test',
      },
      reply_id: {
        type: 'integer',
        description: 'ID of the email received by the seed account',
      },
    },
    required: ['spam_test_id', 'reply_id'],
  },
};

export const GET_SCHEDULE_HISTORY_TOOL: CategoryTool = {
  name: 'smartlead_get_schedule_history',
  description: 'Get the list and summary of all tests that ran for a particular automated test.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the automated spam test to get the schedule history for',
      },
    },
    required: ['spam_test_id'],
  },
};

export const GET_IP_DETAILS_TOOL: CategoryTool = {
  name: 'smartlead_get_ip_details',
  description: 'Get the list of all blacklists per IP for a specific email.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      spam_test_id: {
        type: 'integer',
        description: 'ID of the spam test',
      },
      reply_id: {
        type: 'integer',
        description: 'ID of the email received by the seed account',
      },
    },
    required: ['spam_test_id', 'reply_id'],
  },
};

export const GET_MAILBOX_SUMMARY_TOOL: CategoryTool = {
  name: 'smartlead_get_mailbox_summary',
  description: 'Get the list of mailboxes used for any Smart Delivery test with overall performance across all tests.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'integer',
        description: 'Number of tests to retrieve (default: 10)',
      },
      offset: {
        type: 'integer',
        description: 'Offset for pagination (default: 0)',
      },
    },
  },
};

export const GET_MAILBOX_COUNT_TOOL: CategoryTool = {
  name: 'smartlead_get_mailbox_count',
  description: 'Get the count of all mailboxes used for any spam test.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {},
  },
};

export const GET_ALL_FOLDERS_TOOL: CategoryTool = {
  name: 'smartlead_get_all_folders',
  description: 'Get the list and details of all folders created in Smart Delivery along with tests inside each folder.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'integer',
        description: 'Number of folders to retrieve (default: 10)',
      },
      offset: {
        type: 'integer',
        description: 'Offset for pagination (default: 0)',
      },
      name: {
        type: 'string',
        description: 'Filter folders by name',
      },
    },
  },
};

export const CREATE_FOLDER_TOOL: CategoryTool = {
  name: 'smartlead_create_folder',
  description: 'Create a folder in Smart Delivery to organize tests.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the folder to create',
      },
    },
    required: ['name'],
  },
};

export const GET_FOLDER_BY_ID_TOOL: CategoryTool = {
  name: 'smartlead_get_folder_by_id',
  description: 'Get details of a specific folder by ID.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      folder_id: {
        type: 'integer',
        description: 'ID of the folder to retrieve',
      },
    },
    required: ['folder_id'],
  },
};

export const DELETE_FOLDER_TOOL: CategoryTool = {
  name: 'smartlead_delete_folder',
  description: 'Delete a folder from Smart Delivery.',
  category: ToolCategory.SMART_DELIVERY,
  inputSchema: {
    type: 'object',
    properties: {
      folder_id: {
        type: 'integer',
        description: 'ID of the folder to delete',
      },
    },
    required: ['folder_id'],
  },
};

// Export all tools as an array for easy registration
export const smartDeliveryTools = [
  GET_REGION_WISE_PROVIDERS_TOOL,
  CREATE_MANUAL_PLACEMENT_TEST_TOOL,
  CREATE_AUTOMATED_PLACEMENT_TEST_TOOL,
  GET_SPAM_TEST_DETAILS_TOOL,
  DELETE_SMART_DELIVERY_TESTS_TOOL,
  STOP_AUTOMATED_TEST_TOOL,
  LIST_ALL_TESTS_TOOL,
  GET_PROVIDER_WISE_REPORT_TOOL,
  GET_GROUP_WISE_REPORT_TOOL,
  GET_SENDER_ACCOUNT_WISE_REPORT_TOOL,
  GET_SPAM_FILTER_DETAILS_TOOL,
  GET_DKIM_DETAILS_TOOL,
  GET_SPF_DETAILS_TOOL,
  GET_RDNS_DETAILS_TOOL,
  GET_SENDER_ACCOUNTS_TOOL,
  GET_BLACKLIST_TOOL,
  GET_EMAIL_CONTENT_TOOL,
  GET_IP_ANALYTICS_TOOL,
  GET_EMAIL_HEADERS_TOOL,
  GET_SCHEDULE_HISTORY_TOOL,
  GET_IP_DETAILS_TOOL,
  GET_MAILBOX_SUMMARY_TOOL,
  GET_MAILBOX_COUNT_TOOL,
  GET_ALL_FOLDERS_TOOL,
  CREATE_FOLDER_TOOL,
  GET_FOLDER_BY_ID_TOOL,
  DELETE_FOLDER_TOOL,
];
