import axios from 'axios';

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
    n8nIntegration: false,
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
  // Use the license key from the specific env var first
  const apiKey = process.env.SMARTLEAD_LICENSE_KEY;
  
  // Check if we have a cached result that's still valid
  const now = Date.now();
  if (cachedValidation && (now - lastValidationTime < LICENSING_CACHE_TTL)) {
    return cachedValidation;
  }
  
  // Check if the License Server URL is configured
  if (!LICENSE_SERVER_URL) {
     console.error('LICENSE_SERVER_URL is not configured in environment variables.');
     return createValidationResult(LicenseLevel.FREE, false, 'Licensing service is not configured.');
  }
  
  // Default to free tier if no key provided
  if (!apiKey) {
    return createValidationResult(LicenseLevel.FREE, false, 'No API key provided. Running in free mode with limited features.');
  }
  
  // If LICENSE_LEVEL_OVERRIDE is set, use it for testing/development
  const overrideLevel = process.env.LICENSE_LEVEL_OVERRIDE as LicenseLevel;
  if (overrideLevel && Object.values(LicenseLevel).includes(overrideLevel)) {
    console.log(`Using license override: ${overrideLevel}`);
    return createValidationResult(overrideLevel, true, `Using license override: ${overrideLevel}`);
  }
  
  try {
    // Call license validation API to validate the key against Supabase
    // Use the configured LICENSE_SERVER_URL
    const response = await axios.get(`${LICENSE_SERVER_URL}/validate`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-Client-Id': getMachineId()
      },
      timeout: 5000 // 5 second timeout
    });
    
    if (response.data.valid) {
      // License is valid
      const level = response.data.level as LicenseLevel;
      const usage = response.data.usage || 0;
      
      // Get the feature token for server-side validation
      cachedFeatureToken = {
        token: response.data.featureToken,
        expires: now + (response.data.tokenExpires || 3600000) // Default 1 hour
      };
      
      // Cache the result
      cachedValidation = createValidationResult(
        level, 
        true, 
        `License validated: ${level} tier`,
        usage
      );
      
      lastValidationTime = now;
      return cachedValidation;
    } else {
      // License is invalid
      return createValidationResult(
        LicenseLevel.FREE, 
        false, 
        response.data.message || 'Invalid license key'
      );
    }
  } catch (error) {
    // If API call fails, degrade gracefully to offline mode
    console.error('License validation service unavailable:', error);
    
    // If we have a cached validation, use it even if expired
    if (cachedValidation) {
      return {
        ...cachedValidation,
        message: 'Using cached license information (offline mode)'
      };
    }
    
    // Otherwise, default to free mode
    return createValidationResult(
      LicenseLevel.FREE, 
      false, 
      'License validation service unavailable. Running in limited mode.'
    );
  }
}

/**
 * Get a token for server-side feature validation
 * This adds security since critical operations will need server validation
 */
export async function getFeatureToken(): Promise<FeatureRequestToken | null> {
  // Ensure we have a valid license first
  await validateLicense();
  
  // Check if we have a valid cached token
  if (cachedFeatureToken && Date.now() < cachedFeatureToken.expires) {
    return cachedFeatureToken;
  }
  
  return null;
}

/**
 * Track usage for a license
 * @param licenseKey The license key
 * @param toolName The tool being used
 */
export async function trackUsage(licenseKey?: string, toolName = 'unknown'): Promise<void> {
  const apiKey = licenseKey || process.env.YOUR_SERVICE_API_KEY;
  if (!apiKey) return;
  
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
        'Authorization': `Bearer ${apiKey}`
      }
    }).catch(() => {
      // Silently fail - we don't want to impact performance
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
  const validation = await validateLicense();
  return validation.features[feature] === true;
}

/**
 * Check if a category is available in the current license
 * @param category The category to check
 * @returns Whether the category is available
 */
export async function isCategoryEnabled(category: string): Promise<boolean> {
  const validation = await validateLicense();
  return validation.features.allowedCategories.includes(category);
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