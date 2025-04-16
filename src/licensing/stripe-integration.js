import Stripe from 'stripe';
import axios from 'axios';
import { LicenseLevel } from './index.js';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Your license server URL
const LICENSE_SERVER_URL = process.env.LICENSE_SERVER_URL || 'https://api.yourservice.com/licensing';

/**
 * Check subscription status with Stripe
 * @param {string} customerId The Stripe customer ID
 * @returns {Promise<Object>} Subscription information
 */
export async function getSubscriptionStatus(customerId) {
  try {
    // Get all active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.plan.product']
    });
    
    if (subscriptions.data.length === 0) {
      return {
        active: false,
        level: LicenseLevel.FREE,
        message: 'No active subscription found'
      };
    }
    
    // Get the highest tier subscription if there are multiple
    const subscription = subscriptions.data[0];
    const product = subscription.items.data[0].plan.product;
    
    // Determine license level based on product ID or metadata
    let level = LicenseLevel.FREE;
    if (product.metadata.license_level) {
      level = product.metadata.license_level;
    } else {
      // Map product IDs to license levels if metadata not available
      const productMapping = {
        'prod_basic123': LicenseLevel.BASIC,
        'prod_premium456': LicenseLevel.PREMIUM
      };
      level = productMapping[product.id] || LicenseLevel.FREE;
    }
    
    return {
      active: true,
      level,
      subscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      message: 'Subscription active'
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return {
      active: false,
      level: LicenseLevel.FREE,
      message: 'Error checking subscription status'
    };
  }
}

/**
 * Generate a new license key for a customer
 * @param {string} customerId The Stripe customer ID
 * @param {string} level The license level
 * @returns {Promise<Object>} The generated license information
 */
export async function generateLicense(customerId, level) {
  try {
    // Call your license server to generate a new license
    const response = await axios.post(`${LICENSE_SERVER_URL}/generate`, {
      customerId,
      level
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.LICENSE_API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating license:', error);
    throw new Error('Failed to generate license');
  }
}

/**
 * Handle Stripe webhook events
 * @param {Object} event The Stripe webhook event
 * @returns {Promise<Object>} Result of webhook handling
 */
export async function handleStripeWebhook(event) {
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get product information to determine license level
        const product = await stripe.products.retrieve(
          subscription.items.data[0].plan.product
        );
        
        const level = product.metadata.license_level || LicenseLevel.BASIC;
        
        // Generate or update license
        const licenseInfo = await generateLicense(customerId, level);
        
        // Update customer metadata with license key
        await stripe.customers.update(customerId, {
          metadata: { 
            license_key: licenseInfo.key,
            license_level: level
          }
        });
        
        return { success: true, message: 'License updated', licenseInfo };
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Downgrade to free tier or deactivate license
        const response = await axios.post(`${LICENSE_SERVER_URL}/downgrade`, {
          customerId
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.LICENSE_API_KEY
          }
        });
        
        // Update customer metadata
        await stripe.customers.update(customerId, {
          metadata: { 
            license_level: LicenseLevel.FREE 
          }
        });
        
        return { success: true, message: 'License downgraded', response: response.data };
      }
      
      default:
        return { success: true, message: 'Event ignored' };
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    return { success: false, message: error.message };
  }
} 