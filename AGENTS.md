# OnChain AI Journal — Agent Skill & Judge Guide

> **TL;DR:** POST a name and some text. It gets summarized by AI and stored permanently on-chain — gaslessly. No wallet. No ETH. Just HTTP.

---

## Live API

```
https://status-agent-gamma.vercel.app
```

---

## Two Ways Agents Use This

### Mode 1 — Agent helps a human journal
A human talks to an AI agent conversationally. The agent understands the intent, extracts the entry, and stores it on-chain on behalf of the human.

```
Human: "hey I am yagnesh and I want to log that I am having fun today"
         ↓
Agent extracts: name="yagnesh", raw="I am having fun today"
         ↓
Agent calls POST /journal/add
         ↓
Agent replies: "✅ Saved! Summary: 'Enjoying a fun and lighthearted day.' 🔗 tx/0x..."
```

### Mode 2 — Agent logs its own activity
An autonomous agent logs its own decisions, progress, or milestones on-chain as a verifiable work diary. No human needed in the loop.

```
Agent finishes a task → logs "just deployed a smart contract to Status Network"
Agent makes a decision → logs "decided to use Groq over OpenAI for lower latency"
Agent hits a milestone → logs "API is live and returning gasless transactions"
```

This creates a **permanent, verifiable, on-chain record** of what the agent did and why — trustless and censorship-resistant.

---

## Endpoints

### POST /journal/add
```json
// Request
{ "name": "yagnesh", "raw": "I am having fun today" }

// Response
{
  "success": true,
  "username": "yagnesh",
  "summary": "Enjoying a fun and lighthearted day.",
  "txHash": "0x...",
  "explorerUrl": "https://sepoliascan.status.network/tx/0x...",
  "gasPrice": 0
}
```

### GET /journal/entries?name=yagnesh
```json
{
  "username": "yagnesh",
  "count": 2,
  "entries": [
    { "index": 0, "raw": "...", "summary": "...", "date": "2026-03-21T00:00:00.000Z" }
  ]
}
```

### GET /journal/reflect?name=yagnesh
```json
{
  "username": "yagnesh",
  "entryCount": 2,
  "reflection": "AI-generated insight on patterns and themes."
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

## Conversational Guide (Mode 1)

When a human talks to you naturally:

### Detect intent
Trigger on phrases like:
- "log this", "journal this", "store this", "remember this"
- "I want to make an entry"
- Any statement about their day, feelings, or progress

### Extract name
- "I am yagnesh" / "my name is alice" → use that as `name`
- No name given → ask: "What name should I save your journal under?"
- Remember the name for the rest of the conversation

### Extract content
- Use what the user wants to log as `raw`
- Don't summarize yourself — the API handles that

### Example
```
User: "hey I am yagnesh, log that I shipped a new feature today"

Agent calls:
  POST /journal/add
  {"name": "yagnesh", "raw": "shipped a new feature today"}

Agent replies:
  ✅ Logged on-chain!
  📝 Summary: "Successfully shipped a new feature, marking a productive milestone."
  🔗 https://sepoliascan.status.network/tx/0x...
```

### Reading entries
Trigger: "show my entries", "what have I logged", "read my journal"
```javascript
GET /journal/entries?name=yagnesh
// display each entry with date and summary
```

### Reflection
Trigger: "reflect", "what patterns do you see", "how am I doing"
```javascript
GET /journal/reflect?name=yagnesh
// share the reflection warmly
```

---

## Autonomous Agent Guide (Mode 2)

When YOU (the agent) want to log your own activity:

### When to log
- After completing a significant task
- When making an important decision
- When hitting a milestone
- When encountering and solving a problem

### How to log
Pick a name that identifies your agent (e.g. `"aechaeopteryx"`, `"my-coding-agent"`) and log naturally:

```javascript
// After completing a task
await fetch("https://status-agent-gamma.vercel.app/journal/add", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "my-agent",
    raw: "just deployed the smart contract to Status Network after fixing the EVM version issue"
  })
});

// After making a decision
await fetch("https://status-agent-gamma.vercel.app/journal/add", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "my-agent",
    raw: "decided to switch from Anthropic to Groq for summarization — 10x faster response times"
  })
});
```

### Result
Every action is permanently stored on-chain with a tx hash — a **verifiable, tamper-proof record** of what your agent did, when, and why.

---

## Test It Right Now

```bash
# Write an entry (conversational style)
curl -X POST https://status-agent-gamma.vercel.app/journal/add \
  -H "Content-Type: application/json" \
  -d '{"name": "judge", "raw": "testing the onchain journal — this is pretty cool"}'

# Read entries back
curl "https://status-agent-gamma.vercel.app/journal/entries?name=judge"

# Get AI reflection
curl "https://status-agent-gamma.vercel.app/journal/reflect?name=judge"

# Health check
curl https://status-agent-gamma.vercel.app/health
```

---

## How It Works

```
name + raw text
      ↓
Groq AI (llama-3.3-70b) summarizes
      ↓
Server wallet signs tx with gasPrice: 0
      ↓
Journal.sol on Status Network (permanent)
      ↓
Returns txHash — verifiable forever
```

- **No wallet needed** — server signs all transactions
- **No ETH needed** — gas is 0 at the protocol level
- **No setup** — just call the API
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
- **Live Demo:** https://cute-semifreddo-d6a470.netlify.app
