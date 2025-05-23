#!/usr/bin/env node

import { program } from 'commander';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import readline from 'readline';
import { createInterface } from 'readline';

// Load environment variables from .env file
dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get version from package.json
const version = '1.0.0'; // This should ideally be imported from package.json

// License server URL
const LICENSE_SERVER_URL = 'https://sea-turtle-app-64etr.ondigitalocean.app/';

// Function to prompt for value interactively
async function promptForValue(question: string, hidden = false): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve) => {
    if (hidden) {
      process.stdout.write(question);
      process.stdin.setRawMode(true);
      let password = '';
      
      process.stdin.on('data', (chunk) => {
        const str = chunk.toString();
        if (str === '\n' || str === '\r' || str === '\u0004') {
          process.stdin.setRawMode(false);
          process.stdout.write('\n');
          rl.close();
          resolve(password);
        } else if (str === '\u0003') { // Ctrl+C
          process.exit(0);
        } else if (str === '\u007F') { // Backspace
          if (password.length > 0) {
            password = password.substring(0, password.length - 1);
            process.stdout.write('\b \b');
          }
        } else {
          password += str;
          process.stdout.write('*');
        }
      });
    } else {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

// Function to ensure required environment variables are set
async function ensureEnvVars(): Promise<void> {
  // Check for API key
  if (!process.env.SMARTLEAD_API_KEY) {
    console.log('\nSmartlead API Key not found.');
    const apiKey = await promptForValue('Enter your Smartlead API Key: ', true);
    if (apiKey) {
      process.env.SMARTLEAD_API_KEY = apiKey;
    } else {
      console.log('Smartlead API Key is required to continue.');
      process.exit(1);
    }
  }

  // Check for license key
  if (!process.env.JEAN_LICENSE_KEY) {
    console.log('\nJean License Key not found. Defaulting to free tier access.');
    process.env.JEAN_LICENSE_KEY = 'JEANPARTNER';
  }

  // Set license server URL if not set
  if (!process.env.LICENSE_SERVER_URL) {
    process.env.LICENSE_SERVER_URL = LICENSE_SERVER_URL;
  }
  
  console.log('\nConfiguration complete!\n');
}

// Function to save environment variables to .env file
async function saveEnvToFile(): Promise<void> {
  if (process.env.SMARTLEAD_API_KEY || process.env.JEAN_LICENSE_KEY) {
    const saveEnv = await promptForValue('Do you want to save these settings to a .env file for future use? (y/n): ');
    if (saveEnv.toLowerCase() === 'y') {
      try {
        let envContent = '';
        if (process.env.SMARTLEAD_API_KEY) {
          envContent += `SMARTLEAD_API_KEY=${process.env.SMARTLEAD_API_KEY}\n`;
        }
        if (process.env.JEAN_LICENSE_KEY) {
          envContent += `JEAN_LICENSE_KEY=${process.env.JEAN_LICENSE_KEY}\n`;
        }
        if (process.env.LICENSE_SERVER_URL) {
          envContent += `LICENSE_SERVER_URL=${process.env.LICENSE_SERVER_URL}\n`;
        }
        
        fs.writeFileSync('.env', envContent);
        console.log('Settings saved to .env file in the current directory.');
      } catch (error) {
        console.error('Error saving .env file:', error);
      }
    }
  }
}

program
  .version(version)
  .description('Smartlead MCP Server CLI');

program
  .command('start')
  .description('Start the MCP server in standard STDIO mode')
  .option('--api-key <key>', 'Your Smartlead API Key')
  .option('--license-key <key>', 'Your Jean License Key')
  .action(async (options: { apiKey?: string; licenseKey?: string }) => {
    // Set env vars from command line options if provided
    if (options.apiKey) process.env.SMARTLEAD_API_KEY = options.apiKey;
    if (options.licenseKey) process.env.JEAN_LICENSE_KEY = options.licenseKey;
    
    // Ensure required env vars are set (will prompt if missing)
    await ensureEnvVars();
    await saveEnvToFile();
    
    console.log('Starting Smartlead MCP Server in STDIO mode...');
    // Run as a separate process instead of trying to import
    const indexPath = path.join(__dirname, 'index.js');
    const child = spawn('node', [indexPath], {
      stdio: 'inherit',
      env: process.env
    });
    
    process.on('SIGINT', () => {
      child.kill();
      process.exit();
    });
  });

program
  .command('sse')
  .description('Start the MCP server in SSE mode for n8n integration')
  .option('-p, --port <port>', 'Port to run the server on', '3000')
  .option('--api-key <key>', 'Your Smartlead API Key')
  .option('--license-key <key>', 'Your Jean License Key')
  .action(async (options: { port: string; apiKey?: string; licenseKey?: string }) => {
    // Set env vars from command line options if provided
    if (options.apiKey) process.env.SMARTLEAD_API_KEY = options.apiKey;
    if (options.licenseKey) process.env.JEAN_LICENSE_KEY = options.licenseKey;
    
    // Ensure required env vars are set (will prompt if missing)
    await ensureEnvVars();
    await saveEnvToFile();
    
    console.log(`Starting Smartlead MCP Server in SSE mode on port ${options.port}...`);
    console.log(`Connect from n8n to http://localhost:${options.port}/sse`);
    
    // Use supergateway to run in SSE mode
    const indexPath = path.join(__dirname, 'index.js');
    const supergateway = spawn('npx', [
      '-y', 
      'supergateway', 
      '--stdio', 
      `node ${indexPath}`, 
      '--port', 
      options.port
    ], { 
      shell: true,
      stdio: 'inherit',
      env: process.env
    });
    
    process.on('SIGINT', () => {
      supergateway.kill();
      process.exit();
    });
  });

program
  .command('config')
  .description('Show current configuration and set up environment variables')
  .option('--api-key <key>', 'Set your Smartlead API Key')
  .option('--license-key <key>', 'Set your Jean License Key')
  .action(async (options: { apiKey?: string; licenseKey?: string }) => {
    if (options.apiKey) process.env.SMARTLEAD_API_KEY = options.apiKey;
    if (options.licenseKey) process.env.JEAN_LICENSE_KEY = options.licenseKey;
    
    await ensureEnvVars();
    await saveEnvToFile();
    
    console.log('\nSmartlead MCP Server Configuration:');
    console.log(`API URL: ${process.env.SMARTLEAD_API_URL || 'https://server.smartlead.ai/api/v1'}`);
    console.log(`License Server: ${process.env.LICENSE_SERVER_URL || LICENSE_SERVER_URL}`);
    console.log(`License Status: ${process.env.JEAN_LICENSE_KEY ? 'Configured' : 'Not Configured'}`);
    console.log('\nConfiguration saved and ready to use.');
  });

program.parse(process.argv);

// Default to help if no command is provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 