import { SuperGateway as MockSuperGateway } from './supergateway-mock.js';

/**
 * Interface for SupergateWay options
 */
export interface SuperGatewayOptions {
  apiKey?: string;
  [key: string]: any;
}

/**
 * Interface for SuperGateway API
 */
export interface SuperGateway {
  process(input: string, options?: Record<string, any>): Promise<string>;
  stream(input: string, options?: Record<string, any>): Promise<ReadableStream>;
  close(): Promise<void>;
}

/**
 * Try to dynamically import Supergateway package
 */
export async function tryImportSupergateway(): Promise<any> {
  try {
    // First try to import the real package
    return await import('supergateway');
  } catch (error) {
    console.error(`Failed to import Supergateway: ${error instanceof Error ? error.message : String(error)}`);
    console.error('Falling back to mock Supergateway implementation');
    
    // Return our mock implementation as a fallback
    return {
      SuperGateway: MockSuperGateway
    };
  }
}

/**
 * Create a Supergateway instance
 */
export async function createSupergateway(apiKey?: string): Promise<SuperGateway | null> {
  try {
    // Try to dynamically import the Supergateway module
    const supergateModule = await tryImportSupergateway();
    
    if (!supergateModule) {
      console.error('Supergateway module not found.');
      return null;
    }
    
    // Check if API key is provided
    if (!apiKey) {
      console.error('SUPERGATEWAY_API_KEY not provided');
      return null;
    }
    
    // Create Supergateway instance
    const { SuperGateway } = supergateModule;
    const gateway = new SuperGateway({
      apiKey,
      // Additional configuration options can be added here
    });
    
    console.error('Supergateway initialized successfully');
    return gateway;
  } catch (error) {
    console.error(`Error initializing Supergateway: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}