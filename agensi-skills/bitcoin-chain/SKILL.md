---
name: bitcoin-chain
description: Looks up Bitcoin addresses, transactions, UTXOs, and blocks through the connected Bitcoin MCP server. Use when the user asks for a Bitcoin address balance, transaction history, unspent outputs, a txid, or a block by height.
---

# Bitcoin chain lookups

The Bitcoin MCP server must already be connected. If `get-address-stats` is missing, stop and give the user the install block in README.md. Do not invent chain data.

## Workflow

1. For an address, call `get-address-stats` first.
2. Call `get-address-transactions` when they ask what an address sent or received. Call `get-address-utxos` when they ask what it can still spend.
3. For a txid, call `get-transaction`. For a block height, call `get-block`.
4. Read [references/tools.md](references/tools.md) when the user asks for a field those tools return and the workflow above does not name it.

## Output

- The address, txid, or block height that was queried
- The values, with units (BTC or sats, as the tool returned them)
- The tool that produced each value

## Boundaries

Do not tell the user to paste a seed phrase or private key. An address, txid, or block height is enough.
