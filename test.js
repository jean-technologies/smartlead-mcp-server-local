#!/usr/bin/env node

import { spawn } from 'child_process';
import { createInterface } from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect, test, describe, beforeAll, afterAll } from '@jest/globals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Smartlead MCP Server', () => {
  let serverProcess;
  let serverOutput = '';
  let serverError = '';

  beforeAll(() => {
    // Start the MCP server
    serverProcess = spawn('node', [path.join(__dirname, 'dist', 'index.js')], {
      env: {
        ...process.env,
        SMARTLEAD_API_KEY: 'test_api_key',
      },
    });

    // Collect server output
    serverProcess.stdout.on('data', (data) => {
      serverOutput += data.toString();
    });

    serverProcess.stderr.on('data', (data) => {
      serverError += data.toString();
    });

    // Wait for server to start (give it time to initialize)
    return new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(() => {
    // Clean up
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  test('Server starts successfully', () => {
    expect(serverError).toContain('Smartlead MCP Server initialized successfully');
  });

  test('Server is running on stdio', () => {
    expect(serverError).toContain('Smartlead MCP Server running on stdio');
  });
});

// If running this script directly (not through Jest)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Test script running. Press Ctrl+C to exit.');

  const serverProcess = spawn('node', [path.join(__dirname, 'dist', 'index.js')], {
    env: {
      ...process.env,
      SMARTLEAD_API_KEY: 'test_api_key',
    },
  });

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
}
