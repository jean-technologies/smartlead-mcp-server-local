import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { ToolCategory } from '../types/common.js';

// Load environment variables
dotenv.config();

/**
 * Smartlead API configuration
 */
interface ApiConfig {
  key: string;
  url: string;
  retry: {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffFactor: number;
  };
}

/**
 * Standard mode configuration (STDIO)
 */
interface StandardModeConfig {
  enabled: boolean;
}

/**
 * SSE mode configuration (for n8n)
 */
interface SseModeConfig {
  enabled: boolean;
  port: number;
  useNgrok: boolean;
  ngrokAuthToken?: string;
}

/**
 * Feature category configuration
 */
interface FeatureConfig {
  enabledCategories: Record<string, boolean>;
  enabledTools: Record<string, boolean>;
  betaFeatures: boolean;
  extendedLogging: boolean;
}

/**
 * Server configuration
 */
interface ServerConfig {
  name: string;
  version: string;
  loggingLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Unified configuration interface
 */
export interface UnifiedConfig {
  api: ApiConfig;
  modes: {
    standard: StandardModeConfig;
    sse: SseModeConfig;
  };
  features: FeatureConfig;
  server: ServerConfig;
}

// Default configuration
const defaultConfig: UnifiedConfig = {
  api: {
    key: process.env.SMARTLEAD_API_KEY || '',
    url: process.env.SMARTLEAD_API_URL || 'https://server.smartlead.ai/api/v1',
    retry: {
      maxAttempts: Number(process.env.SMARTLEAD_RETRY_MAX_ATTEMPTS) || 3,
      initialDelay: Number(process.env.SMARTLEAD_RETRY_INITIAL_DELAY) || 1000,
      maxDelay: Number(process.env.SMARTLEAD_RETRY_MAX_DELAY) || 10000,
      backoffFactor: Number(process.env.SMARTLEAD_RETRY_BACKOFF_FACTOR) || 2,
    },
  },
  modes: {
    standard: {
      enabled: process.env.ENABLE_STANDARD_MODE !== 'false', // Enabled by default
    },
    sse: {
      enabled: process.env.USE_SSE === 'true' || process.env.USE_SUPERGATEWAY === 'true',
      port: Number(process.env.SSE_PORT) || 3001,
      useNgrok: process.env.USE_NGROK === 'true',
      ngrokAuthToken: process.env.NGROK_AUTH_TOKEN,
    },
  },
  features: {
    enabledCategories: {
      [ToolCategory.CAMPAIGN_MANAGEMENT]: true,
      [ToolCategory.EMAIL_ACCOUNT_MANAGEMENT]: true,
      [ToolCategory.LEAD_MANAGEMENT]: true,
      [ToolCategory.CAMPAIGN_STATISTICS]: true,
      [ToolCategory.SMART_DELIVERY]: true,
      [ToolCategory.WEBHOOKS]: true,
      [ToolCategory.CLIENT_MANAGEMENT]: true,
      [ToolCategory.SMART_SENDERS]: true
    },
    enabledTools: {},
    betaFeatures: process.env.ENABLE_BETA_FEATURES === 'true',
    extendedLogging: process.env.EXTENDED_LOGGING === 'true',
  },
  server: {
    name: 'smartlead-mcp',
    version: '1.0.0',
    loggingLevel: (process.env.LOGGING_LEVEL as any) || 'info',
  }
};

// Try to load config file if it exists
let fileConfig: Partial<UnifiedConfig> = {};
try {
  const configPath = path.resolve(process.cwd(), 'mcp_config.json');
  if (fs.existsSync(configPath)) {
    const configData = fs.readFileSync(configPath, 'utf-8');
    fileConfig = JSON.parse(configData);
    console.error('[CONFIG] Loaded configuration from mcp_config.json');
  }
} catch (error) {
  console.error(`[CONFIG] Error loading configuration file: ${error instanceof Error ? error.message : String(error)}`);
}

/**
 * Deep merge utility for combining configurations
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (source === null || typeof source !== 'object') return output;
  
  Object.keys(source).forEach(key => {
    const targetValue = (target as any)[key];
    const sourceValue = (source as any)[key];
    
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      (output as any)[key] = sourceValue;
    } else if (
      targetValue && typeof targetValue === 'object' &&
      sourceValue && typeof sourceValue === 'object'
    ) {
      (output as any)[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      (output as any)[key] = sourceValue;
    }
  });
  
  return output;
}

// Merge configurations
export const Config: UnifiedConfig = deepMerge(defaultConfig, fileConfig);

// Validate required settings
if (!Config.api.key) {
  console.error('[CONFIG] Error: SMARTLEAD_API_KEY is required');
  process.exit(1);
}

// Add helper functions
export function isToolEnabled(toolName: string, category: string): boolean {
  // Check if the tool has a specific override
  if (Config.features.enabledTools[toolName] !== undefined) {
    return Config.features.enabledTools[toolName];
  }
  
  // Otherwise, check if the category is enabled
  return Config.features.enabledCategories[category] || false;
}

// Export configuration
export default Config; 