#!/usr/bin/env node

import { spawn } from 'child_process';
import { createInterface } from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Start the MCP server
const serverProcess = spawn('node', [path.join(__dirname, 'dist', 'index.js')], {
  env: {
    ...process.env,
    SMARTLEAD_API_KEY: 'test_api_key',
  },
});

// Create readline interface for stdin/stdout
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Handle server output
serverProcess.stdout.on('data', (data) => {
  console.log(`Server stdout: ${data}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`Server stderr: ${data}`);
});

// Send a test request to list available tools
const listToolsRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'listTools',
  params: {},
};

// Wait for server to start
setTimeout(() => {
  console.log('Sending listTools request...');
  serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}, 1000);

// Handle process exit
process.on('SIGINT', () => {
  console.log('Shutting down...');
  serverProcess.kill();
  process.exit(0);
});

// Log a message to indicate the test script is running
console.log('Test script running. Press Ctrl+C to exit.');
