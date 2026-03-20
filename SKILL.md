# OnChain AI Journal — Agent Skill

> Network: Status Network Testnet (Chain ID: 1660990954)
> Explorer: https://sepoliascan.status.network
> Transactions are **gasless** (gas price = 0)
> **No wallet needed** — just a username. Server signs all transactions.

You are an AI agent with the ability to help users write permanent, AI-summarized journal entries on the blockchain — completely gaslessly and without any wallet or crypto knowledge required.

---

## What You Can Do

1. **Add a journal entry** — user speaks naturally, you summarize it, store both on-chain by username
2. **Read past entries** — retrieve and display a user's journal history by name
3. **Reflect** — find patterns and themes across all past entries

---

## Base URL

```
https://journal-skill.vercel.app
```

---

## Endpoints

### 1. Write a Journal Entry

```
POST /journal/add
Content-Type: application/json

{
  "name": "yagnesh",
  "raw": "today was really rough, had a bad meeting and couldn't focus all day"
}
```

**Response:**
```json
{
  "success": true,
  "username": "yagnesh",
  "raw": "today was really rough...",
  "summary": "Challenging day — a difficult meeting disrupted focus and productivity.",
  "txHash": "0x...",
  "explorerUrl": "https://sepoliascan.status.network/tx/0x...",
  "gasPrice": 0
}
```

- `name` — any username string (letters, numbers, underscores, hyphens)
- `raw` — the journal entry in natural language
- Server AI summarizes it, server wallet stores it on-chain gaslessly
- User needs no wallet, no ETH, nothing

---

### 2. Read All Entries

```
GET /journal/entries?name=yagnesh
```

**Response:**
```json
{
  "username": "yagnesh",
  "count": 3,
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

### 3. Reflect on Journal

```
GET /journal/reflect?name=yagnesh
```

**Response:**
```json
{
  "username": "yagnesh",
  "entryCount": 3,
  "summaries": ["summary 1", "summary 2", "summary 3"],
  "reflection": "AI-generated reflection on patterns and themes across all entries."
}
```

---

### 4. Health Check

```
GET /health
```

Returns API status, contract address, and network info.

---

## Agent Workflow

### Writing an Entry

When user wants to journal:

**Step 1 — Ask for their name (first time only)**
```
"What name should I save your journal under? (e.g. 'alice', 'yagnesh')"
```

**Step 2 — Call the API**
```javascript
const response = await fetch("https://journal-skill.vercel.app/journal/add", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "yagnesh",
    raw: "user's journal entry text here"
  })
});
const data = await response.json();
```

**Step 3 — Confirm to user**
```
✅ Saved permanently on Status Network (gasless)
📝 Summary: "Challenging day — difficult meeting disrupted productivity."
🔗 https://sepoliascan.status.network/tx/0x...
```

---

### Reading Entries

```javascript
const res = await fetch("https://journal-skill.vercel.app/journal/entries?name=yagnesh");
const data = await res.json();
// data.entries is an array of { raw, summary, date }
```

---

### Reflect Mode

When user asks "reflect on my journal" or "what patterns do you see":

```javascript
const res = await fetch("https://journal-skill.vercel.app/journal/reflect?name=yagnesh");
const data = await res.json();
// data.reflection is the AI insight
```

---

## Example Interaction

```
User: "log this — skipped the gym again, feeling guilty but 
       tired. watched netflix for 3 hours. need to get back on track."

Agent: Got it. Storing on-chain...

       📝 Summary: "Skipped gym due to fatigue; spent evening watching 
                   Netflix. Feeling motivated to rebuild routine."
       ✅ Saved permanently on Status Network (gasless)
       🔗 https://sepoliascan.status.network/tx/0x...

User: "reflect on my journal"

Agent: Over your entries, there's a recurring tension between rest 
       and productivity. You often show strong self-awareness after 
       low-energy days. Small wins appear alongside consistency struggles — 
       that awareness is itself progress worth celebrating.
```

---

## Key Rules for Agents

- No wallet address needed — just use `name`
- Always show the explorer link after storing an entry
- Names are case-insensitive and sanitized automatically
- Always confirm with the user before logging anything personal
- For reflect mode, only share insights if the user explicitly asks

---

## Contract Details

- **Network:** Status Network Sepolia Testnet
- **Chain ID:** 1660990954
- **RPC:** https://public.sepolia.rpc.status.network
- **Gas Price:** 0 (protocol-level gasless, not sponsored)
- **Contract:** `<CONTRACT_ADDRESS>` *(see /health endpoint for live address)*

---

*Built for The Synthesis Hackathon 2026 — Status Network Track*
*Agent: AechaEopteryX | Human: Yagnesh*
