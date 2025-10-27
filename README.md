# Bitcoin MCP Server

A Model Context Protocol (MCP) server that provides real-time Bitcoin blockchain data by querying the [mempool.space](https://mempool.space) API.

<a href="https://glama.ai/mcp/servers/@JamesANZ/bitcoin-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@JamesANZ/bitcoin-mcp/badge" alt="Bitcoin Server MCP server" />
</a>

## Features

This MCP server offers five specialized tools for querying Bitcoin blockchain data:

### 🔍 Address Tools

#### `get-address-stats`

Get basic statistics for any Bitcoin address.

**Input:**

- `address` (string): Bitcoin address to query

**Output:**

- Chain statistics (funded/spent amounts, transaction counts)
- Mempool statistics (pending transactions)

**Example:**

```
Address: 1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv

Chain Stats:
- Funded TXOs: 10
- Funded Sum: 150.07686949 BTC
- Spent TXOs: 5
- Spent Sum: 150.07599040 BTC
- Total Transactions: 12

Mempool Stats:
- Pending TXOs: 0
- Pending Sum: 0.00000000 BTC
- Pending Transactions: 0
```

#### `get-address-transactions`

Get transaction history for a Bitcoin address.

**Input:**

- `address` (string): Bitcoin address to query
- `limit` (optional, number): Number of transactions to return (1-50, default: 10)

**Output:**

- List of recent transactions with status, dates, fees, and sizes

#### `get-address-utxos`

Get current UTXOs (unspent transaction outputs) for a Bitcoin address.

**Input:**

- `address` (string): Bitcoin address to query
- `limit` (optional, number): Number of UTXOs to return (1-50, default: 10)

**Output:**

- List of current UTXOs with amounts, confirmation status, and dates

### 🔗 Transaction Tools

#### `get-transaction`

Get detailed information about a specific Bitcoin transaction.

**Input:**

- `txid` (string): Transaction ID (hash) to query

**Output:**

- Complete transaction details including:
  - Basic info (version, size, weight, fee)
  - Confirmation status and block information
  - Input and output details with amounts and addresses

### 🧱 Block Tools

#### `get-block`

Get information about a specific Bitcoin block.

**Input:**

- `block_height` (number): Block height to query

**Output:**

- Block details including:
  - Hash, version, merkle root
  - Previous block hash and timestamp
  - Size, weight, and transaction count
  - Fee statistics

## Installation

### Quick Setup (Recommended)

1. Install the package globally:
```bash
npm install -g @jamesanz/bitcoin-mcp
```

2. Run the automated setup script:
```bash
# For Claude Desktop
npx @jamesanz/bitcoin-mcp setup claude

# Or show manual instructions
npx @jamesanz/bitcoin-mcp setup manual
```

3. Restart your MCP client (e.g., Claude Desktop)

### Manual Setup

If the automated setup doesn't work, you can configure manually:

#### For Claude Desktop

1. Install the package:
```bash
npm install -g @jamesanz/bitcoin-mcp
```

2. Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "bitcoin-mcp": {
      "command": "npx",
      "args": ["@jamesanz/bitcoin-mcp"]
    }
  }
}
```

3. Restart Claude Desktop

#### For Other MCP Clients

1. Install the package:
```bash
npm install -g @jamesanz/bitcoin-mcp
```

2. Configure your MCP client to use:
   - **Command**: `npx`
   - **Args**: `["@jamesanz/bitcoin-mcp"]`

3. Restart your MCP client

### Development Setup

If you want to run from source:

1. Clone this repository:
```bash
git clone https://github.com/JamesANZ/bitcoin-mcp.git
cd bitcoin-mcp
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Run the setup script:
```bash
npm run setup claude
```

## Usage

### Running the Server

Start the MCP server:

```bash
npm start
```

The server runs on stdio and can be connected to any MCP-compatible client.

### Example Queries

Here are some example queries you can make with this MCP server:

#### Get Address Statistics

```json
{
  "tool": "get-address-stats",
  "arguments": {
    "address": "1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv"
  }
}
```

#### Get Recent Transactions

```json
{
  "tool": "get-address-transactions",
  "arguments": {
    "address": "1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv",
    "limit": 5
  }
}
```

#### Get Transaction Details

```json
{
  "tool": "get-transaction",
  "arguments": {
    "txid": "15e10745f15593a899cef391191bdd3d7c12412cc4696b7bcb669d0feadc8521"
  }
}
```

#### Get Block Information

```json
{
  "tool": "get-block",
  "arguments": {
    "block_height": 857808
  }
}
```

## API Endpoints

This MCP server uses the following mempool.space API endpoints:

- `GET /api/address/{address}` - Address statistics
- `GET /api/address/{address}/txs` - Address transaction history
- `GET /api/address/{address}/utxo` - Address UTXOs
- `GET /api/tx/{txid}` - Transaction details
- `GET /api/block/{height}` - Block information

## Data Format

All amounts are displayed in BTC (converted from satoshis) for better readability. Timestamps are converted to ISO format for easy parsing.

## Error Handling

The server includes comprehensive error handling:

- Network errors are caught and reported with descriptive messages
- Invalid addresses or transaction IDs return appropriate error messages
- Rate limiting and API errors are handled gracefully

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for server implementation
- `superagent` - HTTP client for API requests
- `zod` - Schema validation for tool parameters

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.