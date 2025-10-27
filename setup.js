#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

const CONFIG_PATHS = {
  claude: {
    darwin: join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
    linux: join(homedir(), '.config', 'claude', 'claude_desktop_config.json'),
    win32: join(homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json')
  }
};

const PLATFORM = process.platform;

function getConfigPath(client) {
  const paths = CONFIG_PATHS[client];
  if (!paths) {
    throw new Error(`Unsupported MCP client: ${client}`);
  }
  
  const path = paths[PLATFORM];
  if (!path) {
    throw new Error(`Unsupported platform: ${PLATFORM}`);
  }
  
  return path;
}

function readConfig(configPath) {
  if (!existsSync(configPath)) {
    return { mcpServers: {} };
  }
  
  try {
    const content = readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading config file: ${error.message}`);
    return { mcpServers: {} };
  }
}

function writeConfig(configPath, config) {
  const dir = dirname(configPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function setupClaudeDesktop() {
  const configPath = getConfigPath('claude');
  const config = readConfig(configPath);
  
  // Add or update bitcoin-mcp configuration
  config.mcpServers = config.mcpServers || {};
  config.mcpServers['bitcoin-mcp'] = {
    command: 'npx',
    args: ['@jamesanz/bitcoin-mcp']
  };
  
  writeConfig(configPath, config);
  console.log(`✅ Claude Desktop configuration updated at: ${configPath}`);
  console.log('🔄 Please restart Claude Desktop to load the Bitcoin MCP server.');
}

function showManualInstructions() {
  console.log('\n📋 Manual Configuration Instructions:');
  console.log('\n1. Install the package globally:');
  console.log('   npm install -g @jamesanz/bitcoin-mcp');
  console.log('\n2. Add to your MCP client configuration:');
  console.log('   {\n     "mcpServers": {\n       "bitcoin-mcp": {\n         "command": "npx",\n         "args": ["@jamesanz/bitcoin-mcp"]\n       }\n     }\n   }');
  console.log('\n3. Restart your MCP client');
}

function main() {
  console.log('🚀 Bitcoin MCP Server Setup');
  console.log('============================\n');
  
  const args = process.argv.slice(2);
  const client = args[0];
  
  if (!client) {
    console.log('Usage: node setup.js <client>');
    console.log('\nSupported clients:');
    console.log('  claude    - Claude Desktop');
    console.log('  manual    - Show manual instructions');
    console.log('\nExample: node setup.js claude');
    process.exit(1);
  }
  
  try {
    switch (client) {
      case 'claude':
        setupClaudeDesktop();
        break;
      case 'manual':
        showManualInstructions();
        break;
      default:
        console.error(`❌ Unsupported client: ${client}`);
        console.log('\nSupported clients: claude, manual');
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Setup failed: ${error.message}`);
    console.log('\nFalling back to manual instructions:');
    showManualInstructions();
    process.exit(1);
  }
}

main();
