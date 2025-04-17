import axios from 'axios';
import { LicenseLevel, validateLicense, getFeatureToken } from '../licensing/index.js';

const N8N_CONFIG = {
  apiUrl: process.env.N8N_API_URL || 'https://n8n.yourservice.com/api/v1',
};

/**
 * Get workflows from n8n
 * This is a premium feature that requires server-side validation
 */
export async function getWorkflows() {
  // First check if n8n integration is available based on license
  const licenseInfo = await validateLicense();
  if (licenseInfo.level !== LicenseLevel.PREMIUM) {
    throw new Error(
      `N8n integration requires a Premium license. Your current license level is ${licenseInfo.level}. ` +
      'Please upgrade to access this feature.'
    );
  }
  
  // Get a feature token for server-side validation
  const featureToken = await getFeatureToken();
  if (!featureToken) {
    throw new Error('Unable to validate premium feature access. Please try again later.');
  }
  
  try {
    // Make the API call with the feature token
    const response = await axios.get(`${N8N_CONFIG.apiUrl}/workflows`, {
      headers: {
        'Authorization': `Bearer ${process.env.JEAN_LICENSE_KEY}`,
        'X-Feature-Token': featureToken.token
      }
    });
    
    return response.data;
  } catch (error) {
    // Handle API errors
    if (axios.isAxiosError(error) && error.response) {
      // If server rejected the feature token
      if (error.response.status === 403) {
        throw new Error('Premium feature access denied. Please check your license status.');
      }
      
      // Other API errors
      throw new Error(`Failed to fetch n8n workflows: ${error.response.data?.message || error.message}`);
    }
    
    // Generic error
    throw new Error(`Error accessing n8n integration: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Execute a workflow in n8n
 * This is a premium feature that requires server-side validation
 */
export async function executeWorkflow(workflowId: string, data: any) {
  // First check if n8n integration is available based on license
  const licenseInfo = await validateLicense();
  if (licenseInfo.level !== LicenseLevel.PREMIUM) {
    throw new Error(
      `N8n integration requires a Premium license. Your current license level is ${licenseInfo.level}. ` +
      'Please upgrade to access this feature.'
    );
  }
  
  // Get a feature token for server-side validation
  const featureToken = await getFeatureToken();
  if (!featureToken) {
    throw new Error('Unable to validate premium feature access. Please try again later.');
  }
  
  try {
    // Make the API call with the feature token
    const response = await axios.post(
      `${N8N_CONFIG.apiUrl}/workflows/${workflowId}/execute`, 
      data,
      {
        headers: {
          'Authorization': `Bearer ${process.env.JEAN_LICENSE_KEY}`,
          'X-Feature-Token': featureToken.token,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    // Handle API errors
    if (axios.isAxiosError(error) && error.response) {
      // If server rejected the feature token
      if (error.response.status === 403) {
        throw new Error('Premium feature access denied. Please check your license status.');
      }
      
      // Other API errors
      throw new Error(`Failed to execute n8n workflow: ${error.response.data?.message || error.message}`);
    }
    
    // Generic error
    throw new Error(`Error accessing n8n integration: ${error instanceof Error ? error.message : String(error)}`);
  }
} 