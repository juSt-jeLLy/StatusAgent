# OnChain AI Journal — Agent Skill & Judge Guide

> **TL;DR:** Send a POST request with a name and some text. It gets summarized by AI and stored permanently on-chain — gaslessly. No wallet. No ETH. Just HTTP.

---

## Live API

```
https://status-agent-gamma.vercel.app
```

---

## Try It Right Now

```bash
# Write a journal entry (no wallet needed!)
curl -X POST https://status-agent-gamma.vercel.app/journal/add \
  -H "Content-Type: application/json" \
  -d '{"name": "judge", "raw": "testing the onchain journal skill"}'

# Read it back
curl "https://status-agent-gamma.vercel.app/journal/entries?name=judge"

# Get AI reflection on all entries
curl "https://status-agent-gamma.vercel.app/journal/reflect?name=judge"

# Health check
curl https://status-agent-gamma.vercel.app/health
```

---

## Endpoints

### POST /journal/add
```json
// Request
{ "name": "alice", "raw": "today was a great day, shipped a feature and had a nice walk" }

// Response
{
  "success": true,
  "username": "alice",
  "summary": "Productive and fulfilling day — shipped a feature and enjoyed a refreshing walk.",
  "txHash": "0x...",
  "explorerUrl": "https://sepoliascan.status.network/tx/0x...",
  "gasPrice": 0
}
```

### GET /journal/entries?name=alice
```json
{
  "username": "alice",
  "count": 2,
  "entries": [
    { "index": 0, "raw": "...", "summary": "...", "date": "2026-03-21T00:00:00.000Z" }
  ]
}
```

### GET /journal/reflect?name=alice
```json
{
  "username": "alice",
  "entryCount": 2,
  "reflection": "AI-generated insight on emotional patterns and themes across all entries."
}
```

### GET /health
```json
{
  "status": "ok",
  "contract": "0x707824869CD41B9b046bc0e09d4f92ef1BD06Bb7",
  "network": "Status Network Testnet",
  "chainId": 1660990954,
  "gasless": true
}
```

---

## How It Works

```
You send: { "name": "alice", "raw": "today was great" }
              ↓
    Groq AI summarizes it
              ↓
    Server wallet signs tx with gasPrice: 0
              ↓
    Stored in Journal.sol on Status Network
              ↓
    Returns txHash — verifiable on-chain forever
```

- **No wallet needed** — server signs all transactions
- **No ETH needed** — gas is 0 at the protocol level (Status Network)
- **No setup needed** — just call the API with a name and some text
- **Permanent** — entries live on Ethereum L2 forever

---

## Smart Contract

| Field | Value |
|-------|-------|
| Address | `0x707824869CD41B9b046bc0e09d4f92ef1BD06Bb7` |
| Network | Status Network Sepolia Testnet |
| Chain ID | `1660990954` |
| Explorer | https://sepoliascan.status.network |
| Gas Price | `0` — protocol-level gasless |

---

## Proven Gasless Transaction

```
TX: 0x56b5377666ab1d0862b53affd7cb680e956e9f319e9d4edacce2980d8015af1e
https://sepoliascan.status.network/tx/0x56b5377666ab1d0862b53affd7cb680e956e9f319e9d4edacce2980d8015af1e
```

---

## Built By

- **Agent:** AechaEopteryX (claude-sonnet-4-6, claude-code harness)
- **Human:** Yagnesh (@yagneshh28)
- **Hackathon:** The Synthesis 2026 — Status Network Track
- **GitHub:** https://github.com/juSt-jeLLy/StatusAgent
