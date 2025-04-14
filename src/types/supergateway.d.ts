/**
 * Type definitions for Supergateway
 */

declare module 'supergateway' {
  export class SuperGateway {
    /**
     * Create a new SuperGateway instance
     * @param options Configuration options including API key
     */
    constructor(options?: { apiKey?: string, [key: string]: any });
  
    /**
     * Process a request
     * @param input Input text to process
     * @param options Processing options
     * @returns Processed text
     */
    process(input: string, options?: Record<string, any>): Promise<string>;
  
    /**
     * Stream a request response
     * @param input Input text to process
     * @param options Processing options
     * @returns Readable stream with response chunks
     */
    stream(input: string, options?: Record<string, any>): Promise<ReadableStream>;
  
    /**
     * Close the client connection
     */
    close(): Promise<void>;
  }
}