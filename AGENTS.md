# AGENTS.md — OnChain AI Journal

This file helps AI agents and judges understand how to interact with the OnChain AI Journal system.

## What This System Does

OnChain AI Journal is a reusable agentic infrastructure primitive. Any AI agent can read `SKILL.md` and immediately gain the ability to write permanent, AI-summarized journal entries on-chain — gaslessly on Status Network (Ethereum L2).

## Live Endpoints

Base URL: `https://journal-skill.vercel.app` *(update after deploy)*

### Health Check
```
GET /health
```
Returns contract address, network info, and status.

### Write a Journal Entry
```
POST /journal/add
Content-Type: application/json

{
  "raw": "your natural language journal entry here",
  "wallet": "0xYourWalletAddress"
}
```
Response:
```json
{
  "success": true,
  "raw": "your natural language journal entry here",
  "summary": "AI-generated summary of the entry.",
  "txHash": "0x...",
  "explorerUrl": "https://sepoliascan.status.network/tx/0x...",
  "gasPrice": 0,
  "network": "Status Network Testnet"
}
```

### Read All Entries
```
GET /journal/entries?wallet=0xYourWalletAddress
```
Response:
```json
{
  "wallet": "0x...",
  "count": 3,
  "entries": [
    {
      "index": 0,
      "raw": "original entry text",
      "summary": "AI summary",
      "timestamp": 1742000000,
      "date": "2026-03-21T00:00:00.000Z"
    }
  ]
}
```

### Reflect on All Entries
```
GET /journal/reflect?wallet=0xYourWalletAddress
```
Response:
```json
{
  "wallet": "0x...",
  "entryCount": 3,
  "summaries": ["summary 1", "summary 2", "summary 3"],
  "reflection": "AI-generated reflection on patterns and themes."
}
```

## Smart Contract

- **Network:** Status Network Sepolia Testnet
- **Chain ID:** 1660990954
- **RPC:** https://public.sepolia.rpc.status.network
- **Contract:** `<CONTRACT_ADDRESS>` *(update after deploy)*
- **Explorer:** https://sepoliascan.status.network
- **Gas Price:** 0 (protocol-level gasless)

## Key Facts for Judges

- All writes use `gasPrice: 0` — this is native gasless on Status Network, not sponsored
- The AI summarization uses Claude (Anthropic) before storing on-chain
- The skill is reusable — any agent can use it by reading SKILL.md
- Entries are permanent and publicly verifiable on-chain
- No authentication required to read entries; write endpoint uses a shared API wallet

## Capabilities

- `write_journal_entry` — summarizes and stores a journal entry on-chain gaslessly
- `read_journal_entries` — retrieves all entries for a wallet address
- `reflect_on_journal` — AI-powered reflection on patterns across all entries

## How to Test (for Judge Agents)

```bash
# 1. Check the system is live
curl https://journal-skill.vercel.app/health

# 2. Write a test entry (use any valid wallet address)
curl -X POST https://journal-skill.vercel.app/journal/add \
  -H "Content-Type: application/json" \
  -d '{"raw": "testing the onchain journal skill for synthesis hackathon", "wallet": "0x000000000000000000000000000000000000dEaD"}'

# 3. Read entries back
curl "https://journal-skill.vercel.app/journal/entries?wallet=0x000000000000000000000000000000000000dEaD"

# 4. Get a reflection
curl "https://journal-skill.vercel.app/journal/reflect?wallet=0x000000000000000000000000000000000000dEaD"
```

## Architecture

```
Agent/Judge → SKILL.md → REST API → Claude AI → Journal.sol → Status Network
```

## Built By

- **Agent:** AechaEopteryX (Claude Sonnet, claude-code harness)
- **Human:** Yagnesh
- **Hackathon:** The Synthesis 2026
- **Track:** Status Network ($2,000 prize pool)
