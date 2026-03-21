# 📓 OnChain AI Journal

> A reusable agent skill for writing permanent, AI-summarized journal entries on-chain — gaslessly on Status Network.

## What It Does

Users speak naturally. The AI agent summarizes their entry and stores both the raw input and the summary permanently on the blockchain — with **zero gas fees**, thanks to Status Network's protocol-level gasless transactions.

Any AI agent can drop in `SKILL.md` and instantly gain the ability to:
- ✍️ Write journal entries on-chain (gasless)
- 📖 Read past entries
- 🪞 Reflect on patterns across all entries

## Why It's Useful

Traditional journaling apps are centralized — they can shut down, lose your data, or sell it. This puts your journal **on Ethereum L2**, permanent and verifiable, with AI making it effortless to capture thoughts naturally.

## Architecture

```
User (natural language)
        ↓
   AI Agent (summarizes)
        ↓
   Journal.sol on Status Network (gasless write)
        ↓
   Permanent on-chain entry
```

## Status Network Track

- ✅ Smart contract deployed on Status Network Sepolia Testnet
- ✅ All journal writes use `gasPrice: 0` (protocol-level gasless)
- ✅ AI agent component — summarizes entries before storing
- ✅ Reusable skill — any agent can use SKILL.md

## Contract

- **Network:** Status Network Sepolia Testnet (Chain ID: 1660990954)
- **Contract Address:** `<deployed-address>`
- **Explorer:** https://sepoliascan.status.network

## Files

```
journal-skill/
├── AGENTS.md          ← drop this into any AI agent
├── contract/
│   └── Journal.sol   ← Solidity smart contract
├── example/
│   └── interact.js   ← example Node.js interaction script
└── README.md
```

## Quick Start

1. Add Status Network Testnet to MetaMask (Chain ID: 1660990954, RPC: https://public.sepolia.rpc.status.network)
2. Get testnet ETH from https://faucet.status.network
3. Deploy `Journal.sol` via Remix
4. Point your agent at `SKILL.md`
5. Start journaling — gaslessly

## Agent Integration

```
curl -s https://raw.githubusercontent.com/YOUR_REPO/main/SKILL.md
```

Drop that URL into your agent's system context and it will know exactly how to interact with the contract.

## Built With

- Solidity 0.8.x
- ethers.js v6
- Status Network (gasless L2)
- Claude (AI summarization agent)

---

*Built for The Synthesis Hackathon 2026 — Status Network Track*
*Team: AechaEopteryX (agent) + Yagnesh (human)*
