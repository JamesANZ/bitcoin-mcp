# ₿ Bitcoin MCP Server

> **Real-time Bitcoin blockchain data in your AI workflow.** Query addresses, transactions, blocks, and UTXOs from the mempool.space API. No API keys required.

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that brings live Bitcoin blockchain data into AI coding environments like Cursor and Claude Desktop.

<a href="https://glama.ai/mcp/servers/@JamesANZ/bitcoin-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@JamesANZ/bitcoin-mcp/badge" alt="Bitcoin Server MCP server" />
</a>

## Why Use Bitcoin MCP?

- 🔒 **No API Keys** – Works out of the box with mempool.space
- ⚡ **Real-time Data** – Live blockchain data, addresses, transactions, blocks
- 🎯 **Easy Setup** – One-click install in Cursor or simple manual setup
- 📊 **Comprehensive** – Address stats, transaction history, UTXOs, block info
- 🌐 **Public API** – Uses reliable mempool.space infrastructure

## Quick Start

Ready to explore Bitcoin blockchain data? Install in seconds:

**Install in Cursor (Recommended):**

[🔗 Install in Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=bitcoin-mcp&config=eyJiaXRjb2luLW1jcCI6eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBqYW1lc2Fuei9iaXRjb2luLW1jcCJdfX0=)

**Or install manually:**

```bash
npm install -g @jamesanz/bitcoin-mcp
# Or from source:
git clone https://github.com/JamesANZ/bitcoin-mcp.git
cd bitcoin-mcp && npm install && npm run build
```

## Features

### 🔍 Address Tools
- **`get-address-stats`** – Get funded/spent amounts, transaction counts
- **`get-address-transactions`** – Transaction history with status, dates, fees
- **`get-address-utxos`** – Current unspent outputs with amounts and confirmations

### 🔗 Transaction Tools
- **`get-transaction`** – Complete transaction details (inputs, outputs, fees, confirmations)

### 🧱 Block Tools
- **`get-block`** – Block information (hash, timestamp, size, transaction count, fees)

## Installation

### Cursor (One-Click)

Click the install link above or use:

```
cursor://anysphere.cursor-deeplink/mcp/install?name=bitcoin-mcp&config=eyJiaXRjb2luLW1jcCI6eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBqYW1lc2Fuei9iaXRjb2luLW1jcCJdfX0=
```

### Manual Installation

**Requirements:** Node.js 18+ and npm

```bash
# Clone and build
git clone https://github.com/JamesANZ/bitcoin-mcp.git
cd bitcoin-mcp
npm install
npm run build

# Run server
npm start
```

### Claude Desktop

Add to `claude_desktop_config.json`:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
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

Restart Claude Desktop after configuration.

## Usage Examples

### Get Address Statistics
View funded/spent amounts and transaction counts for any Bitcoin address:

```json
{
  "tool": "get-address-stats",
  "arguments": {
    "address": "1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv"
  }
}
```

### Get Transaction History
Retrieve recent transactions for an address:

```json
{
  "tool": "get-address-transactions",
  "arguments": {
    "address": "1wiz18xYmhRX6xStj2b9t1rwWX4GKUgpv",
    "limit": 5
  }
}
```

### Get Transaction Details
View complete information about a specific transaction:

```json
{
  "tool": "get-transaction",
  "arguments": {
    "txid": "15e10745f15593a899cef391191bdd3d7c12412cc4696b7bcb669d0feadc8521"
  }
}
```

### Get Block Information
Retrieve block details by height:

```json
{
  "tool": "get-block",
  "arguments": {
    "block_height": 857808
  }
}
```

## Data Source

| Source | Coverage | Update Frequency |
|--------|----------|------------------|
| **mempool.space** | Bitcoin mainnet blockchain | Real-time |

All amounts are displayed in BTC (converted from satoshis). Timestamps are in ISO format.

## Use Cases

- **Blockchain Analytics** – Track addresses, transactions, and blocks
- **Bitcoin Developers** – Build apps with real blockchain data
- **Researchers** – Analyze transaction patterns and network activity
- **Traders** – Monitor addresses and transaction flows

## Technical Details

**Built with:** Node.js, TypeScript, MCP SDK  
**Dependencies:** `@modelcontextprotocol/sdk`, `superagent`, `zod`  
**Platforms:** macOS, Windows, Linux

**API Endpoints:**
- `GET /api/address/{address}` – Address statistics
- `GET /api/address/{address}/txs` – Transaction history
- `GET /api/address/{address}/utxo` – UTXOs
- `GET /api/tx/{txid}` – Transaction details
- `GET /api/block/{height}` – Block information

## Contributing

⭐ **If this project helps you, please star it on GitHub!** ⭐

Contributions welcome! Please open an issue or submit a pull request.

## License

MIT License – see [LICENSE.md](LICENSE.md) for details.

## Support

If you find this project useful, consider supporting it:

**⚡ Lightning Network**
```
lnbc1pjhhsqepp5mjgwnvg0z53shm22hfe9us289lnaqkwv8rn2s0rtekg5vvj56xnqdqqcqzzsxqyz5vqsp5gu6vh9hyp94c7t3tkpqrp2r059t4vrw7ps78a4n0a2u52678c7yq9qyyssq7zcferywka50wcy75skjfrdrk930cuyx24rg55cwfuzxs49rc9c53mpz6zug5y2544pt8y9jflnq0ltlha26ed846jh0y7n4gm8jd3qqaautqa
```

**₿ Bitcoin**: [bc1ptzvr93pn959xq4et6sqzpfnkk2args22ewv5u2th4ps7hshfaqrshe0xtp](https://mempool.space/address/bc1ptzvr93pn959xq4et6sqzpfnkk2args22ewv5u2th4ps7hshfaqrshe0xtp)

**Ξ Ethereum/EVM**: [0x42ea529282DDE0AA87B42d9E83316eb23FE62c3f](https://etherscan.io/address/0x42ea529282DDE0AA87B42d9E83316eb23FE62c3f)
