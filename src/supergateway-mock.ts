 /**
 * Mock implementation of the SuperGateway client
 * This is used as a fallback when the real SuperGateway package is not available
 */

/**
 * SuperGateway client mock implementation
 */
export class SuperGateway {
  private apiKey: string | undefined;
  private options: Record<string, any>;

  /**
   * Create a new SuperGateway instance
   * @param options Configuration options
   */
  constructor(options: { apiKey?: string, [key: string]: any } = {}) {
    console.error('[Supergateway] Initialized with API key:', options.apiKey ? '[REDACTED]' : 'undefined');
    this.apiKey = options.apiKey;
    this.options = { ...options };
    
    // Remove apiKey from options to avoid logging it
    delete this.options.apiKey;
  }

  /**
   * Process a request
   * @param input Input text to process
   * @param options Processing options
   * @returns Processed text
   */
  async process(input: string, options?: Record<string, any>): Promise<string> {
    console.error('[Supergateway] Processing request');
    console.error('[Supergateway] Input:', input);
    console.error('[Supergateway] Options:', options);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return a processed response
    return `[Supergateway Mock] Processed: ${input.substring(0, 30)}...`;
  }

  /**
   * Stream a request response
   * @param input Input text to process
   * @param options Processing options
   * @returns Readable stream with response chunks
   */
  async stream(input: string, options?: Record<string, any>): Promise<ReadableStream> {
    console.error('[Supergateway] Streaming request');
    console.error('[Supergateway] Input:', input);
    console.error('[Supergateway] Options:', options);
    
    // Create a readable stream for the response
    return new ReadableStream({
      start(controller) {
        // Simulate streaming with delays
        const encoder = new TextEncoder();
        
        // Send chunks with delays
        setTimeout(() => {
          controller.enqueue(encoder.encode('[Supergateway] Stream started\n\n'));
        }, 100);
        
        setTimeout(() => {
          controller.enqueue(encoder.encode('Processing input...\n\n'));
        }, 500);
        
        setTimeout(() => {
          controller.enqueue(encoder.encode('Generating response...\n\n'));
        }, 1000);
        
        setTimeout(() => {
          controller.enqueue(encoder.encode('Completed processing\n\n'));
          controller.close();
        }, 1500);
      }
    });
  }

  /**
   * Close the client connection
   */
  async close(): Promise<void> {
    console.error('[Supergateway] Connection closed');
  }
}