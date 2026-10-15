# Bitcoin chain

Looks up live Bitcoin addresses, transactions, UTXOs, and blocks from mempool.space. No API key.

Connect the server, then ask for an address, a txid, or a block height. The skill tells the agent which tool to call and how to report the result.

## Connect

```json
{
  "mcpServers": {
    "bitcoin-mcp": {
      "command": "npx",
      "args": ["-y", "@jamesanz/bitcoin-mcp"]
    }
  }
}
```

## Package this listing

From this directory's parent:

```bash
zip -r bitcoin-chain.zip bitcoin-chain -x "*.DS_Store"
```

The zip has one top-level folder, `bitcoin-chain/`, with `SKILL.md` inside it. Upload that zip in the Agensi creator dashboard. This repository does not submit the listing.
