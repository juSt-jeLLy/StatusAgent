# 📓 OnChain AI Journal

> A reusable agent skill for writing permanent, AI-summarized journal entries on-chain — gaslessly on Status Network.

## What It Does

Users speak naturally. The AI agent summarizes their entry and stores both the raw input and the summary permanently on the blockchain — with **zero gas fees**, thanks to Status Network's protocol-level gasless transactions (gas literally set to 0, not sponsored or abstracted).

Any AI agent can drop in `SKILL.md` and instantly gain the ability to:
- ✍️ Write journal entries on-chain (gasless, no wallet needed)
- 📖 Read past entries by username
- 🪞 Reflect on patterns across all entries using AI

---

## Status Network Track

**Track:** Go Gasless: Deploy & Transact on Status Network with Your AI Agent
**Prize Pool:** $2,000

### ✅ Qualifying Criteria Met

| Criteria | Proof |
|----------|-------|
| Smart contract deployed on Status Network Sepolia | `0x707824869CD41B9b046bc0e09d4f92ef1BD06Bb7` |
| Gasless transaction (gas = 0) executed | [View TX](https://sepoliascan.status.network/tx/0x56b5377666ab1d0862b53affd7cb680e956e9f319e9d4edacce2980d8015af1e) |
| AI agent component | Groq (llama-3.3-70b) summarizes entries before storing |
| README | You're reading it |

---

## Live Demo

**API:** `https://status-agent-gamma.vercel.app`
**Contract:** `0x707824869CD41B9b046bc0e09d4f92ef1BD06Bb7`
**Explorer:** `https://sepoliascan.status.network`

---

## Proven Gasless Transaction

Here's our first real entry stored on Status Network with `gasPrice: 0`:

**Input:**
```bash
curl -X POST https://status-agent-gamma.vercel.app/journal/add \
  -H "Content-Type: application/json" \
  -d '{"name": "yagnesh", "raw": "just deployed our first smart contract on Status Network, feeling pumped!"}'
```

**Output:**
```json
{
  "success": true,
  "username": "yagnesh",
  "raw": "just deployed our first smart contract on Status Network, feeling pumped!",
  "summary": "I'm thrilled to have deployed my first smart contract, feeling accomplished and excited.",
  "txHash": "0x56b5377666ab1d0862b53affd7cb680e956e9f319e9d4edacce2980d8015af1e",
  "explorerUrl": "https://sepoliascan.status.network/tx/0x56b5377666ab1d0862b53affd7cb680e956e9f319e9d4edacce2980d8015af1e",
  "gasPrice": 0,
  "network": "Status Network Testnet",
  "note": "Signed by server wallet — user needed no wallet or ETH"
}
```

🔗 **Verify on-chain:** https://sepoliascan.status.network/tx/0x56b5377666ab1d0862b53affd7cb680e956e9f319e9d4edacce2980d8015af1e

---

## Why It's Useful

Traditional journaling apps are centralized — they can shut down, lose your data, or sell it. This puts your journal **on Ethereum L2**, permanent and verifiable, with AI making it effortless to capture thoughts naturally.

More importantly — this is **agentic infrastructure**. Not just an app. Any AI agent in the world can read `SKILL.md` and immediately gain on-chain journaling ability. No wallet required on the agent's side.

---

## Architecture

```
User/Agent (natural language)
        ↓
REST API (Vercel)
        ↓
Groq AI (llama-3.3-70b) — summarizes entry
        ↓
Server wallet signs tx with gasPrice: 0
        ↓
Journal.sol on Status Network Testnet
(Chain ID: 1660990954, permanent, verifiable)
        ↓
sepoliascan.status.network/tx/0x...
```

---

## API Endpoints

### Write an Entry
```bash
POST https://status-agent-gamma.vercel.app/journal/add
{"name": "alice", "raw": "your journal entry here"}
```

### Read Entries
```bash
GET https://status-agent-gamma.vercel.app/journal/entries?name=alice
```

### AI Reflection
```bash
GET https://status-agent-gamma.vercel.app/journal/reflect?name=alice
```

### Health Check
```bash
GET https://status-agent-gamma.vercel.app/health
```

---

## Agent Skill

Any agent can use this by reading the skill file:

```bash
curl -s https://raw.githubusercontent.com/juSt-jeLLy/StatusAgent/main/SKILL.md
```

No wallet. No ETH. No setup. Just HTTP calls.

---

## Contract

- **Address:** `0x707824869CD41B9b046bc0e09d4f92ef1BD06Bb7`
- **Network:** Status Network Sepolia Testnet
- **Chain ID:** `1660990954`
- **RPC:** `https://public.sepolia.rpc.status.network`
- **Gas Price:** `0` — protocol-level gasless

---

## File Structure

```
StatusAgent/
├── SKILL.md          ← reusable agent skill
├── AGENTS.md         ← instructions for AI judges
├── README.md         ← this file
├── contract/
│   └── Journal.sol   ← Solidity smart contract
├── api/
│   ├── index.js      ← REST API (deployed on Vercel)
│   ├── package.json
│   └── .env.example
└── frontend/
    └── index.html    ← demo UI
```

---

## Built With

- Solidity 0.8.x — smart contract
- ethers.js v6 — blockchain interaction
- Groq (llama-3.3-70b) — AI summarization
- Express.js — REST API
- Vercel — API hosting
- Status Network — gasless Ethereum L2

---

*Built for The Synthesis Hackathon 2026 — Status Network Track*
*Agent: AechaEopteryX | Human: Yagnesh (@yagneshh28)*
*GitHub: https://github.com/juSt-jeLLy/StatusAgent*
