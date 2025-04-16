import express from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// License levels
const LicenseLevel = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium'
};

// Feature mappings
const LicenseFeatures = {
  [LicenseLevel.FREE]: {
    allowedCategories: ['campaignManagement', 'leadManagement'],
    maxRequests: 100,
    n8nIntegration: false,
    smartleadApiAccess: true
  },
  [LicenseLevel.BASIC]: {
    allowedCategories: ['campaignManagement', 'leadManagement', 'campaignStatistics', 'smartDelivery'],
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

// Generate a secure license key
function generateLicenseKey() {
  return crypto.randomBytes(24).toString('hex');
}

// Generate a temporary feature token
function generateFeatureToken() {
  return {
    token: crypto.randomBytes(32).toString('hex'),
    expires: Date.now() + 3600000 // 1 hour
  };
}

// API Routes

// Validate a license key
app.post('/validate', async (req, res) => {
  try {
    const { Authorization } = req.headers;
    const apiKey = Authorization ? Authorization.replace('Bearer ', '') : null;
    const machineId = req.headers['x-client-id'];
    
    if (!apiKey) {
      return res.json({
        valid: false,
        level: LicenseLevel.FREE,
        message: 'No API key provided'
      });
    }
    
    // Query license in Supabase
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('key', apiKey)
      .single();
    
    if (error || !data) {
      return res.json({
        valid: false,
        level: LicenseLevel.FREE,
        message: 'Invalid license key'
      });
    }
    
    // Check if license is expired
    if (data.expires && new Date(data.expires) < new Date()) {
      return res.json({
        valid: false,
        level: LicenseLevel.FREE,
        message: 'License expired'
      });
    }
    
    // Check if this machine is authorized
    if (data.machine_ids && data.machine_ids.length > 0) {
      if (!machineId || !data.machine_ids.includes(machineId)) {
        // If this is a new machine, check if we've reached the limit
        if (data.machine_ids.length >= data.max_machines) {
          return res.json({
            valid: false,
            level: LicenseLevel.FREE,
            message: 'Maximum number of machines reached'
          });
        }
        
        // Otherwise add this machine to the authorized list
        const updatedMachines = [...data.machine_ids, machineId];
        await supabase
          .from('licenses')
          .update({ machine_ids: updatedMachines })
          .eq('id', data.id);
      }
    } else {
      // Initialize the machine_ids array with this machine
      await supabase
        .from('licenses')
        .update({ machine_ids: [machineId] })
        .eq('id', data.id);
    }
    
    // Generate a feature token for server-side validation
    const featureToken = generateFeatureToken();
    
    // Track usage
    await supabase
      .from('license_usage')
      .insert({
        license_id: data.id,
        machine_id: machineId,
        timestamp: new Date().toISOString()
      });
    
    // Increment usage count
    const { count } = await supabase
      .from('license_usage')
      .select('count', { count: 'exact' })
      .eq('license_id', data.id);
    
    return res.json({
      valid: true,
      level: data.level,
      usage: count || 0,
      featureToken: featureToken.token,
      tokenExpires: 3600, // 1 hour in seconds
      message: 'License validated successfully'
    });
  } catch (error) {
    console.error('License validation error:', error);
    return res.status(500).json({
      valid: false,
      level: LicenseLevel.FREE,
      message: 'Server error during validation'
    });
  }
});

// Validate an installation
app.post('/validate-install', async (req, res) => {
  try {
    const { apiKey, machineId, version, installPath } = req.body;
    
    if (!apiKey) {
      return res.json({
        success: false,
        message: 'No API key provided'
      });
    }
    
    // Query license in Supabase
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('key', apiKey)
      .single();
    
    if (error || !data) {
      return res.json({
        success: false,
        message: 'Invalid license key'
      });
    }
    
    // Check if license is expired
    if (data.expires && new Date(data.expires) < new Date()) {
      return res.json({
        success: false,
        message: 'License expired'
      });
    }
    
    // Record installation info
    await supabase
      .from('installations')
      .insert({
        license_id: data.id,
        machine_id: machineId,
        version,
        install_path: installPath,
        installed_at: new Date().toISOString()
      });
    
    // Return license details
    return res.json({
      success: true,
      level: data.level,
      features: LicenseFeatures[data.level].allowedCategories,
      expires: data.expires,
      message: 'Installation validated successfully'
    });
  } catch (error) {
    console.error('Installation validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during installation validation'
    });
  }
});

// Generate a feature token (used for server-side validation)
app.post('/token', async (req, res) => {
  try {
    const { Authorization } = req.headers;
    const apiKey = Authorization ? Authorization.replace('Bearer ', '') : null;
    
    if (!apiKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Verify the license is valid
    const { data, error } = await supabase
      .from('licenses')
      .select('level')
      .eq('key', apiKey)
      .single();
    
    if (error || !data) {
      return res.status(401).json({ error: 'Invalid license' });
    }
    
    // Generate a new token
    const featureToken = generateFeatureToken();
    
    // Store the token in Supabase with expiration
    await supabase
      .from('feature_tokens')
      .insert({
        token: featureToken.token,
        license_key: apiKey,
        expires_at: new Date(featureToken.expires).toISOString()
      });
    
    return res.json({
      token: featureToken.token,
      expires: featureToken.expires
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Handle Stripe webhook
app.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get the product details to determine license level
        const product = await stripe.products.retrieve(
          subscription.items.data[0].plan.product
        );
        
        // Get license level from product metadata
        const level = product.metadata.license_level || LicenseLevel.BASIC;
        
        // Generate a license key
        const licenseKey = generateLicenseKey();
        
        // Get the customer email
        const customer = await stripe.customers.retrieve(customerId);
        
        // Store the license in Supabase
        await supabase
          .from('licenses')
          .upsert({
            key: licenseKey,
            customer_id: customerId,
            customer_email: customer.email,
            level,
            created_at: new Date().toISOString(),
            expires: subscription.current_period_end 
              ? new Date(subscription.current_period_end * 1000).toISOString() 
              : null,
            max_machines: level === LicenseLevel.PREMIUM ? 5 : 2, // Limit based on tier
            machine_ids: [],
            active: true
          }, { onConflict: 'customer_id' });
        
        // Update customer metadata with license key
        await stripe.customers.update(customerId, {
          metadata: { 
            license_key: licenseKey,
            license_level: level
          }
        });
        
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Find the license by customer ID
        const { data } = await supabase
          .from('licenses')
          .select('id')
          .eq('customer_id', customerId)
          .single();
        
        if (data) {
          // Downgrade the license to free tier
          await supabase
            .from('licenses')
            .update({ 
              level: LicenseLevel.FREE,
              expires: new Date().toISOString() // Expire now
            })
            .eq('id', data.id);
        }
        
        break;
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`License server running on port ${PORT}`);
}); 