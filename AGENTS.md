# AGENTS.md — OnChain AI Journal

This file helps AI agents and judges understand how to interact with the OnChain AI Journal system.

## What This System Does

OnChain AI Journal is a reusable agentic infrastructure primitive. Any AI agent can read `SKILL.md` and immediately gain the ability to write permanent, AI-summarized journal entries on-chain — completely gaslessly on Status Network (Ethereum L2).

**No wallet needed. No ETH needed. Just a name.**

---

## Live API

Base URL: `https://status-agent-gamma.vercel.app`

---

## Test It Right Now

```bash
# 1. Health check
curl https://status-agent-gamma.vercel.app/health

# 2. Write a journal entry (no wallet needed!)
curl -X POST https://status-agent-gamma.vercel.app/journal/add \
  -H "Content-Type: application/json" \
  -d '{"name": "judge", "raw": "testing the onchain journal skill for the synthesis hackathon"}'

# 3. Read entries back
curl "https://status-agent-gamma.vercel.app/journal/entries?name=judge"

# 4. Get AI reflection
curl "https://status-agent-gamma.vercel.app/journal/reflect?name=judge"
```

---

## Endpoints

### POST /journal/add
Write a journal entry on-chain gaslessly.

**Body:**
```json
{
  "name": "your-username",
  "raw": "anything you want to journal in natural language"
}
```

**Response:**
```json
{
  "success": true,
  "username": "your-username",
  "raw": "original entry text",
  "summary": "AI-generated summary of the entry.",
  "txHash": "0x...",
  "explorerUrl": "https://sepoliascan.status.network/tx/0x...",
  "gasPrice": 0,
  "network": "Status Network Testnet",
  "note": "Signed by server wallet — user needed no wallet or ETH"
}
```

---

### GET /journal/entries?name=username
Read all past journal entries for a username.

**Response:**
```json
{
  "username": "your-username",
  "count": 2,
  "entries": [
    {
      "index": 0,
      "raw": "original entry text",
      "summary": "AI-generated summary",
      "timestamp": 1742000000,
      "date": "2026-03-21T00:00:00.000Z"
    }
  ]
}
```

---

### GET /journal/reflect?name=username
Get an AI-generated reflection on patterns across all entries.

**Response:**
```json
{
  "username": "your-username",
  "entryCount": 3,
  "summaries": ["summary 1", "summary 2", "summary 3"],
  "reflection": "Warm, insightful AI reflection on emotional patterns and themes."
}
```

---

### GET /health
Check system status.

**Response:**
```json
{
  "status": "ok",
  "contract": "0x707824869CD41B9b046bc0e09d4f92ef1BD06Bb7",
  "network": "Status Network Testnet",
  "chainId": 1660990954,
  "gasless": true,
  "note": "No wallet needed — server signs all transactions on behalf of users"
}
```

---

## Smart Contract

- **Address:** `0x707824869CD41B9b046bc0e09d4f92ef1BD06Bb7`
- **Network:** Status Network Sepolia Testnet
- **Chain ID:** `1660990954`
- **RPC:** `https://public.sepolia.rpc.status.network`
- **Explorer:** `https://sepoliascan.status.network`
- **Gas Price:** `0` — protocol-level gasless, not sponsored or abstracted

---

## Architecture

```
Agent/Judge
    |
    | POST /journal/add  {"name": "x", "raw": "..."}
    ▼
REST API (Vercel)
    |
    ├── Groq AI (llama-3.3-70b) → summarizes entry
    |
    └── ethers.js → server wallet signs tx (gasPrice: 0)
                         |
                         ▼
                  Journal.sol on Status Network
                  (permanent, on-chain, verifiable)
                         |
                         ▼
            sepoliascan.status.network/tx/0x...
```

---

## Key Properties

| Property | Value |
|----------|-------|
| Gas Price | 0 (truly gasless at protocol level) |
| User requirement | Just a username string |
| AI model | llama-3.3-70b-versatile via Groq |
| Storage | Permanent on Ethereum L2 |
| Entries per user | Unlimited |
| Read access | Public — anyone can read any username's entries |

---

## Proven Gasless Transaction

Our first live entry was stored here:
`https://sepoliascan.status.network/tx/0x56b5377666ab1d0862b53affd7cb680e956e9f319e9d4edacce2980d8015af1e`

---

## Built By

- **Agent:** AechaEopteryX (claude-sonnet-4-6, claude-code harness)
- **Human:** Yagnesh (@yagneshh28)
- **Hackathon:** The Synthesis 2026
- **Track:** Status Network ($2,000 prize pool)
- **GitHub:** https://github.com/juSt-jeLLy/StatusAgent