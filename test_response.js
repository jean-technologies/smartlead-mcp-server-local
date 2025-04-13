import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

// Create a test request for the list_tools method
const request = {
  jsonrpc: '2.0',
  id: '1',
  method: 'tools/list',
  params: {}
};

// Create another test request for calling a specific tool
const callToolRequest = {
  jsonrpc: '2.0',
  id: '2',
  method: 'tools/call',
  params: {
    name: 'smartlead_list_campaigns',
    arguments: {}
  }
};

// Get campaign sequence request
const getCampaignSequenceRequest = {
  jsonrpc: '2.0',
  id: '3',
  method: 'tools/call',
  params: {
    name: 'smartlead_get_campaign_sequence',
    arguments: {
      campaign_id: 1784369 // The ID of your campaign
    }
  }
};

// Spawn the MCP server process with detailed debugging
const mcpProcess = spawn('node', ['dist/index.js'], {
  env: { 
    ...process.env, 
    SMARTLEAD_API_KEY: process.env.SMARTLEAD_API_KEY || 'your_api_key_here',
    DEBUG: 'true'
  }
});

// Set up data collection
let responseData = '';
let errorData = '';
let isDoneSendingRequests = false;

// Log and save server output to a file for debugging
mcpProcess.stdout.on('data', (data) => {
  const dataStr = data.toString();
  responseData += dataStr;
  console.log('SERVER OUTPUT:', dataStr);
  
  try {
    // Try to parse the response as JSON
    const response = JSON.parse(dataStr);
    if (response.id) {
      console.log(`Received response for id: ${response.id}`);
      
      // Process the response appropriately based on the ID
      if (response.id === 'init') {
        console.log('Initialization complete, sending initialized notification...');
        
        // Send an initialized notification
        setTimeout(() => {
          const initializedNotification = {
            jsonrpc: '2.0',
            method: 'initialized',
            params: {}
          };
          
          console.log('Sending initialized notification');
          mcpProcess.stdin.write(JSON.stringify(initializedNotification) + '\n');
          
          // Then send the tools/list request
          setTimeout(() => {
            console.log('Sending tools/list request');
            mcpProcess.stdin.write(JSON.stringify(request) + '\n');
          }, 500);
        }, 500);
      }
      else if (response.id === '1' && response.result && response.result.tools) {
        console.log(`Got list of tools: ${response.result.tools.length} tools found`);
        // Print the names of all tools
        console.log('Available tools:');
        response.result.tools.forEach((tool, i) => {
          console.log(`${i+1}. ${tool.name} - ${tool.description}`);
        });
        
        // If we find our new get_campaign_sequence tool, send a test request
        const hasSequenceTool = response.result.tools.some(
          tool => tool.name === 'smartlead_get_campaign_sequence'
        );
        
        if (hasSequenceTool) {
          console.log('Found smartlead_get_campaign_sequence tool, sending request...');
          setTimeout(() => {
            mcpProcess.stdin.write(JSON.stringify(getCampaignSequenceRequest) + '\n');
          }, 500);
        } else {
          console.log('New tool not found! Sending callTool request instead...');
          setTimeout(() => {
            mcpProcess.stdin.write(JSON.stringify(callToolRequest) + '\n');
          }, 500);
        }
      }
      else if (response.id === '2') {
        console.log('Got response for list_campaigns tool');
        isDoneSendingRequests = true;
      }
      else if (response.id === '3') {
        console.log('Got response for get_campaign_sequence tool');
        isDoneSendingRequests = true;
      }
    }
  } catch (e) {
    // Not complete JSON or other parsing error
    console.log('Parsing failed, not valid JSON or incomplete');
  }
});

mcpProcess.stderr.on('data', (data) => {
  errorData += data.toString();
  console.error('SERVER ERROR/DEBUG:', data.toString());
});

mcpProcess.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  writeFileSync('response.txt', responseData);
  writeFileSync('error.txt', errorData);
});

// Additionally handle protocol initialization
const initializeRequest = {
  jsonrpc: '2.0',
  id: 'init',
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: {
        listTools: true,
        callTool: true
      }
    },
    clientInfo: {
      name: "test-client",
      version: "1.0.0"
    }
  }
};

// Give the server a moment to start up
setTimeout(() => {
  console.log('Starting protocol initialization...');
  mcpProcess.stdin.write(JSON.stringify(initializeRequest) + '\n');
}, 1000);

// Prevent the script from exiting early
process.on('SIGINT', () => {
  if (!isDoneSendingRequests) {
    console.log('Test not finished yet. Press Ctrl+C again to force exit.');
    isDoneSendingRequests = true;
    return;
  }
  console.log('Exiting test script');
  writeFileSync('response.txt', responseData);
  writeFileSync('error.txt', errorData);
  mcpProcess.kill();
  process.exit(0);
}); 