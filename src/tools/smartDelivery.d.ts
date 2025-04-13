import { z } from 'zod';

// Tool schemas for Smart Delivery category
export const regionWiseProviderIdsSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const createManualPlacementTestSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const createAutomatedPlacementTestSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const getSpamTestDetailsSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const deleteSmartDeliveryTestsInBulkSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const stopAutomatedSmartDeliveryTestSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const listAllTestsSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const providerWiseReportSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const geoWiseReportSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const senderAccountWiseReportSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const spamFilterReportSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const dkimDetailsSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const spfDetailsSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const rdnsReportSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const senderAccountListSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const blacklistsSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const spamTestEmailContentSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const spamTestIpBlacklistCountSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const emailReplyHeadersSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const scheduleHistoryForAutomatedTestsSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const ipDetailsSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const mailboxSummarySchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const mailboxCountApiSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const getAllFoldersSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const createFoldersSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const getFolderByIdSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

export const deleteFolderSchema: {
  name: string;
  description: string;
  schema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
};

// Type declarations for Smart Delivery tools
declare module './tools/smartDelivery.js' {
  import { CategoryTool } from '../types/common.js';
  
  export const REGION_WISE_PROVIDER_IDS_TOOL: string;
  export const CREATE_MANUAL_PLACEMENT_TEST_TOOL: string;
  export const CREATE_AUTOMATED_PLACEMENT_TEST_TOOL: string;
  export const GET_SPAM_TEST_DETAILS_TOOL: string;
  export const DELETE_SMART_DELIVERY_TESTS_IN_BULK_TOOL: string;
  export const STOP_AUTOMATED_SMART_DELIVERY_TEST_TOOL: string;
  export const LIST_ALL_TESTS_TOOL: string;
  export const PROVIDER_WISE_REPORT_TOOL: string;
  export const GEO_WISE_REPORT_TOOL: string;
  export const SENDER_ACCOUNT_WISE_REPORT_TOOL: string;
  export const SPAM_FILTER_REPORT_TOOL: string;
  export const DKIM_DETAILS_TOOL: string;
  export const SPF_DETAILS_TOOL: string;
  export const RDNS_REPORT_TOOL: string;
  export const SENDER_ACCOUNT_LIST_TOOL: string;
  export const BLACKLISTS_TOOL: string;
  export const SPAM_TEST_EMAIL_CONTENT_TOOL: string;
  export const SPAM_TEST_IP_BLACKLIST_COUNT_TOOL: string;
  export const EMAIL_REPLY_HEADERS_TOOL: string;
  export const SCHEDULE_HISTORY_FOR_AUTOMATED_TESTS_TOOL: string;
  export const IP_DETAILS_TOOL: string;
  export const MAILBOX_SUMMARY_TOOL: string;
  export const MAILBOX_COUNT_API_TOOL: string;
  export const GET_ALL_FOLDERS_TOOL: string;
  export const CREATE_FOLDERS_TOOL: string;
  export const GET_FOLDER_BY_ID_TOOL: string;
  export const DELETE_FOLDER_TOOL: string;
  
  export const smartDeliveryTools: CategoryTool[];
} 