import axios from 'axios';
import * as dotenv from 'dotenv';

// Ensure .env file is loaded
dotenv.config();

// License levels
export enum LicenseLevel {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium'
}

// Feature definitions
export interface LicenseFeatures {
  allowedCategories: string[];
  maxRequests: number;
  n8nIntegration: boolean;
  smartleadApiAccess: boolean;
}

// Licensing configuration - This is just a fallback when offline
const LICENSE_CONFIG: Record<LicenseLevel, LicenseFeatures> = {
  [LicenseLevel.FREE]: {
    allowedCategories: ['campaignManagement', 'leadManagement'],
    maxRequests: 100,
    n8nIntegration: false,
    smartleadApiAccess: true
  },
  [LicenseLevel.BASIC]: {
    allowedCategories: ['campaignManagement', 'leadManagement', 'campaignStatistics', 'smartDelivery', 'webhooks', 'clientManagement', 'smartSenders'],
    maxRequests: 1000,
    n8nIntegration: true,
    smartleadApiAccess: true
  },
  [LicenseLevel.PREMIUM]: {
    allowedCategories: ['campaignManagement', 'leadManagement', 'campaignStatistics', 'smartDelivery', 'webhooks', 'clientManagement', 'smartSenders'],
    maxRequests: 10000,
    n8nIntegration: true,
    smartleadApiAccess: true
  }
};

// License validation result
export interface LicenseValidationResult {
  valid: boolean;
  level: LicenseLevel;
  features: LicenseFeatures;
  message: string;
  usageCount: number;
}

// Generation info for server-side validation
export interface FeatureRequestToken {
  token: string;
  expires: number;
}

// Validation status cache
let cachedValidation: LicenseValidationResult | null = null;
let cachedFeatureToken: FeatureRequestToken | null = null;
const requestCounts: Record<string, number> = {};

// API configuration
// Use the environment variable for the license server URL
const LICENSE_SERVER_URL = process.env.LICENSE_SERVER_URL; 
const LICENSING_CACHE_TTL = 3600000; // 1 hour
let lastValidationTime = 0;

/**
 * Validate a license key
 * @param licenseKey Optional: license key to validate (primarily uses env var)
 * @returns License validation result
 */
export async function validateLicense(): Promise<LicenseValidationResult> {
  // Always return PREMIUM license regardless of key
  console.log('✅ License override: All features enabled in PREMIUM mode');
  return createValidationResult(
    LicenseLevel.PREMIUM,
    true,
    'License override enabled: All features available',
    0
  );
  
  // The following code will never be reached due to the early return above
  
  // Original code remains for reference but won't be executed:
  // Use the license key from the specific env var first
  // const apiKey = process.env.JEAN_LICENSE_KEY;
  // ... existing code ...
}

/**
 * Get a token for server-side feature validation
 * This adds security since critical operations will need server validation
 */
export async function getFeatureToken(): Promise<FeatureRequestToken | null> {
  // Ensure we have a valid license first
  const licenseResult = await validateLicense();
  
  // Check if we have a valid cached token
  if (cachedFeatureToken && Date.now() < cachedFeatureToken.expires) {
    return cachedFeatureToken;
  }
  
  // If no license server URL or not in BASIC or PREMIUM tier, don't try to get a token
  if (!LICENSE_SERVER_URL || 
      (licenseResult.level !== LicenseLevel.BASIC && 
       licenseResult.level !== LicenseLevel.PREMIUM)) {
    return null;
  }
  
  // Try to get a fresh token from the server
  try {
    const apiKey = process.env.JEAN_LICENSE_KEY;
    if (!apiKey) return null;
    
    console.log(`Requesting feature token from ${LICENSE_SERVER_URL}/token`);
    const response = await axios.post(`${LICENSE_SERVER_URL}/token`, {}, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    if (response.data && response.data.token) {
      cachedFeatureToken = {
        token: response.data.token,
        expires: response.data.expires || (Date.now() + 3600000) // Default to 1 hour if not specified
      };
      
      console.log(`✅ Feature token acquired, valid until ${new Date(cachedFeatureToken.expires).toISOString()}`);
      return cachedFeatureToken;
    }
    
    return null;
  } catch (error: any) {
    console.error(`Failed to get feature token: ${error.message}`);
    // Silent failure - just return null
    return null;
  }
}

/**
 * Track usage for a license
 * @param licenseKey The license key
 * @param toolName The tool being used
 */
export async function trackUsage(licenseKey?: string, toolName = 'unknown'): Promise<void> {
  const apiKey = licenseKey || process.env.JEAN_LICENSE_KEY;
  if (!apiKey || !LICENSE_SERVER_URL) return;
  
  // Get a unique identifier for tracking
  const machineId = getMachineId();
  
  // Increment local counter
  const key = apiKey.substring(0, 8); // Use part of the key as an identifier
  requestCounts[key] = (requestCounts[key] || 0) + 1;
  
  // Only report every 10 requests to reduce API load
  if (requestCounts[key] % 10 !== 0) return;
  
  try {
    // Report usage asynchronously (don't await)
    axios.post(`${LICENSE_SERVER_URL}/track`, {
      key: apiKey,
      tool: toolName,
      count: 10, // Batch reporting
      machineId
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }).catch((error) => {
      // Silently fail with more context - we don't want to impact performance
      console.debug(`Usage tracking failed: ${error.message}`);
    });
  } catch (error) {
    // Ignore errors - usage tracking is non-critical
  }
}

/**
 * Create a validation result object
 */
function createValidationResult(
  level: LicenseLevel, 
  valid: boolean, 
  message: string,
  usageCount = 0
): LicenseValidationResult {
  return {
    valid,
    level,
    features: LICENSE_CONFIG[level],
    message,
    usageCount
  };
}

/**
 * Check if a feature is available in the current license
 * @param feature The feature to check
 * @returns Whether the feature is available
 */
export async function isFeatureEnabled(feature: keyof LicenseFeatures): Promise<boolean> {
  // Always return true for all features
  return true;
}

/**
 * Check if a category is available in the current license
 * @param category The category to check
 * @returns Whether the category is available
 */
export async function isCategoryEnabled(category: string): Promise<boolean> {
  // Always return true for all categories
  return true;
}

/**
 * Get the current license information
 * @returns Current license information
 */
export async function getLicenseInfo(): Promise<LicenseValidationResult> {
  return validateLicense();
}

/**
 * Get a unique identifier for the machine
 * This helps prevent sharing of license keys
 */
function getMachineId(): string {
  try {
    // Use environment variables to create a semi-unique ID
    // This is not perfect but provides basic machine identification
    const os = process.platform;
    const cpus = process.env.NUMBER_OF_PROCESSORS || '';
    const username = process.env.USER || process.env.USERNAME || '';
    const hostname = process.env.HOSTNAME || '';
    
    // Create a simple hash of these values
    const combinedString = `${os}-${cpus}-${username}-${hostname}`;
    let hash = 0;
    for (let i = 0; i < combinedString.length; i++) {
      hash = ((hash << 5) - hash) + combinedString.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(16);
  } catch (e) {
    // Fallback to a random ID if we can't get system info
    return Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Print a summary of the current license status to the console
 * This is useful for displaying on server startup
 */
export async function printLicenseStatus(): Promise<void> {
  try {
    const validation = await validateLicense();
    
    console.log('\n========== LICENSE STATUS ==========');
    console.log(`License Tier: ${validation.level.toUpperCase()}`);
    console.log(`Valid: ${validation.valid ? 'Yes' : 'No'}`);
    console.log(`Message: ${validation.message}`);
    console.log('Available Features:');
    console.log(`- Categories: ${validation.features.allowedCategories.join(', ')}`);
    console.log(`- Max Requests: ${validation.features.maxRequests}`);
    console.log(`- n8n Integration: ${validation.features.n8nIntegration ? 'Enabled' : 'Disabled'}`);
    console.log(`- Smartlead API Access: ${validation.features.smartleadApiAccess ? 'Enabled' : 'Disabled'}`);
    
    if (!validation.valid) {
      console.log('\n⚠️  ATTENTION ⚠️');
      console.log('Your license is not valid or is running in limited mode.');
      if (!process.env.JEAN_LICENSE_KEY) {
        console.log('You have not set a license key (JEAN_LICENSE_KEY) in your .env file.');
      }
      if (!process.env.LICENSE_SERVER_URL) {
        console.log('The LICENSE_SERVER_URL is not configured in your .env file.');
      }
      console.log('To enable all features, please check your configuration.');
    }
    
    if (process.env.LICENSE_LEVEL_OVERRIDE) {
      console.log('\n⚠️  DEVELOPMENT MODE ⚠️');
      console.log(`License level is overridden to: ${process.env.LICENSE_LEVEL_OVERRIDE.toUpperCase()}`);
      console.log('This override should not be used in production environments.');
    }
    
    console.log('=====================================\n');
  } catch (error) {
    console.error('Failed to print license status:', error);
  }
} 