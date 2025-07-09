import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import superagent from "superagent";

const MEMPOOL_API_BASE = "https://mempool.space/api";
const USER_AGENT = "bitcoin-mcp/1.0";

const server = new McpServer({
  name: "bitcoin-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

type AddressStats = {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
};

type Transaction = {
  txid: string;
  version: number;
  locktime: number;
  vin: any[];
  vout: any[];
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
};

type UTXO = {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  value: number;
};

async function getAddressStats(address: string): Promise<AddressStats> {
  const res = await superagent
    .get(`${MEMPOOL_API_BASE}/address/${address}`)
    .set("User-Agent", USER_AGENT);

  return res.body;
}

async function getAddressTransactions(address: string): Promise<Transaction[]> {
  const res = await superagent
    .get(`${MEMPOOL_API_BASE}/address/${address}/txs`)
    .set("User-Agent", USER_AGENT);

  return res.body;
}

async function getAddressUTXOs(address: string): Promise<UTXO[]> {
  const res = await superagent
    .get(`${MEMPOOL_API_BASE}/address/${address}/utxo`)
    .set("User-Agent", USER_AGENT);

  return res.body;
}

async function getTransaction(txid: string): Promise<Transaction> {
  const res = await superagent
    .get(`${MEMPOOL_API_BASE}/tx/${txid}`)
    .set("User-Agent", USER_AGENT);

  return res.body;
}

async function getBlock(blockHeight: number): Promise<any> {
  const res = await superagent
    .get(`${MEMPOOL_API_BASE}/block/${blockHeight}`)
    .set("User-Agent", USER_AGENT);

  return res.body;
}

server.tool(
  "get-address-stats",
  "Get basic statistics for a Bitcoin address",
  {
    address: z.string().describe("Bitcoin address to query"),
  },
  async ({ address }) => {
    try {
      const stats = await getAddressStats(address);

      let result = `**Address: ${address}**\n\n`;
      result += `**Chain Stats:**\n`;
      result += `- Funded TXOs: ${stats.chain_stats.funded_txo_count}\n`;
      result += `- Funded Sum: ${(stats.chain_stats.funded_txo_sum / 100000000).toFixed(8)} BTC\n`;
      result += `- Spent TXOs: ${stats.chain_stats.spent_txo_count}\n`;
      result += `- Spent Sum: ${(stats.chain_stats.spent_txo_sum / 100000000).toFixed(8)} BTC\n`;
      result += `- Total Transactions: ${stats.chain_stats.tx_count}\n\n`;

      result += `**Mempool Stats:**\n`;
      result += `- Pending TXOs: ${stats.mempool_stats.funded_txo_count}\n`;
      result += `- Pending Sum: ${(stats.mempool_stats.funded_txo_sum / 100000000).toFixed(8)} BTC\n`;
      result += `- Pending Transactions: ${stats.mempool_stats.tx_count}\n`;

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching address stats: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "get-address-transactions",
  "Get transaction history for a Bitcoin address",
  {
    address: z.string().describe("Bitcoin address to query"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .default(10)
      .describe("Number of transactions to return (max 50)"),
  },
  async ({ address, limit }) => {
    try {
      const transactions = await getAddressTransactions(address);

      let result = `**Transaction History for ${address}**\n\n`;
      result += `Found ${transactions.length} total transactions\n\n`;

      const displayTransactions = transactions.slice(0, limit);
      displayTransactions.forEach((tx, index) => {
        const status = tx.status.confirmed
          ? `Confirmed (Block ${tx.status.block_height})`
          : "Unconfirmed";
        const timestamp = tx.status.block_time
          ? new Date(tx.status.block_time * 1000).toISOString().split("T")[0]
          : "Pending";
        result += `${index + 1}. **${tx.txid.substring(0, 16)}...**\n`;
        result += `   Status: ${status}\n`;
        result += `   Date: ${timestamp}\n`;
        result += `   Fee: ${tx.fee} sats\n`;
        result += `   Size: ${tx.size} bytes\n\n`;
      });

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching address transactions: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "get-address-utxos",
  "Get current UTXOs (unspent transaction outputs) for a Bitcoin address",
  {
    address: z.string().describe("Bitcoin address to query"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .default(10)
      .describe("Number of UTXOs to return (max 50)"),
  },
  async ({ address, limit }) => {
    try {
      const utxos = await getAddressUTXOs(address);

      let result = `**Current UTXOs for ${address}**\n\n`;
      result += `Found ${utxos.length} total UTXOs\n\n`;

      const displayUTXOs = utxos.slice(0, limit);
      displayUTXOs.forEach((utxo, index) => {
        const status = utxo.status.confirmed
          ? `Confirmed (Block ${utxo.status.block_height})`
          : "Unconfirmed";
        const timestamp = utxo.status.block_time
          ? new Date(utxo.status.block_time * 1000).toISOString().split("T")[0]
          : "Pending";
        result += `${index + 1}. **${utxo.txid.substring(0, 16)}...:${utxo.vout}**\n`;
        result += `   Amount: ${(utxo.value / 100000000).toFixed(8)} BTC\n`;
        result += `   Status: ${status}\n`;
        result += `   Date: ${timestamp}\n\n`;
      });

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching address UTXOs: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "get-transaction",
  "Get detailed information about a Bitcoin transaction",
  {
    txid: z.string().describe("Transaction ID (hash) to query"),
  },
  async ({ txid }) => {
    try {
      const tx = await getTransaction(txid);

      let result = `**Transaction: ${tx.txid}**\n\n`;
      result += `**Basic Info:**\n`;
      result += `- Version: ${tx.version}\n`;
      result += `- Size: ${tx.size} bytes\n`;
      result += `- Weight: ${tx.weight} WU\n`;
      result += `- Fee: ${tx.fee} sats\n`;
      result += `- Locktime: ${tx.locktime}\n\n`;

      result += `**Status:**\n`;
      if (tx.status.confirmed) {
        result += `- Confirmed in block ${tx.status.block_height}\n`;
        result += `- Block hash: ${tx.status.block_hash}\n`;
        result += `- Block time: ${new Date(tx.status.block_time! * 1000).toISOString()}\n`;
      } else {
        result += `- Unconfirmed (in mempool)\n`;
      }
      result += "\n";

      result += `**Inputs (${tx.vin.length}):**\n`;
      tx.vin.forEach((input, index) => {
        if (input.prevout) {
          result += `${index + 1}. ${input.txid.substring(0, 16)}...:${input.vout} - ${(input.prevout.value / 100000000).toFixed(8)} BTC\n`;
        } else {
          result += `${index + 1}. Coinbase transaction\n`;
        }
      });
      result += "\n";

      result += `**Outputs (${tx.vout.length}):**\n`;
      tx.vout.forEach((output, index) => {
        result += `${index + 1}. ${(output.value / 100000000).toFixed(8)} BTC to ${output.scriptpubkey_address || "Unknown address"}\n`;
      });

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching transaction data: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

server.tool(
  "get-block",
  "Get information about a Bitcoin block",
  {
    block_height: z.number().int().min(0).describe("Block height to query"),
  },
  async ({ block_height }) => {
    try {
      const block = await getBlock(block_height);

      let result = `**Block ${block_height}**\n\n`;
      result += `**Basic Info:**\n`;
      result += `- Hash: ${block.id}\n`;
      result += `- Version: ${block.version}\n`;
      result += `- Merkle Root: ${block.merkle_root}\n`;
      result += `- Previous Block: ${block.previousblockhash}\n`;
      result += `- Timestamp: ${new Date(block.timestamp * 1000).toISOString()}\n`;
      result += `- Bits: ${block.bits}\n`;
      result += `- Nonce: ${block.nonce}\n\n`;

      result += `**Stats:**\n`;
      result += `- Size: ${block.size} bytes\n`;
      result += `- Weight: ${block.weight} WU\n`;
      result += `- Transaction Count: ${block.tx_count}\n`;
      result += `- Fee Range: ${block.fee_range?.join(" - ") || "N/A"} sats/vB\n`;
      result += `- Median Fee: ${block.median_fee || "N/A"} sats/vB\n`;

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching block data: ${error.message || "Unknown error"}`,
          },
        ],
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Bitcoin MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
