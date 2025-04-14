// Simple test for Supergateway integration
import { SuperGateway } from './dist/supergateway-mock.js';

async function testSupergateway() {
  console.log('Testing Supergateway mock integration...');
  
  // Create a Supergateway instance
  const gateway = new SuperGateway({
    apiKey: 'test_key'
  });
  
  // Test process method
  try {
    const result = await gateway.process('This is a test input for Supergateway.');
    console.log('Process result:', result);
  } catch (error) {
    console.error('Error testing process method:', error);
  }
  
  // Test stream method
  try {
    const stream = await gateway.stream('This is a test input for Supergateway streaming.');
    console.log('Stream created successfully.');
    
    // Read from the stream
    const reader = stream.getReader();
    let done = false;
    
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      
      if (value) {
        const text = new TextDecoder().decode(value);
        console.log('Stream chunk:', text);
      }
    }
    
    console.log('Stream completed.');
  } catch (error) {
    console.error('Error testing stream method:', error);
  }
  
  // Test close method
  try {
    await gateway.close();
    console.log('Connection closed successfully.');
  } catch (error) {
    console.error('Error testing close method:', error);
  }
}

// Run the test
testSupergateway(); 