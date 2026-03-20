// api/index.js — OnChain AI Journal REST API
// Deploy to Vercel: vercel deploy
//
// KEY DESIGN: Server wallet signs ALL transactions.
// Users/agents only need a username — no wallet, no private key, no ETH needed.

const express = require("express");
const { ethers } = require("ethers");
const Groq = require("groq-sdk");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ── Config ────────────────────────────────────────────────────────────────────
const RPC_URL = "https://public.sepolia.rpc.status.network";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;       // server wallet — signs all txs
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const ABI = [
  "function addEntry(string username, string raw, string summary) external",
  "function getEntryCount(string username) external view returns (uint256)",
  "function getEntry(string username, uint256 index) external view returns (string raw, string summary, uint256 timestamp)",
  "function getAllSummaries(string username) external view returns (string[])",
  "function userHasEntries(string username) external view returns (bool)",
  "function getUserCount() external view returns (uint256)"
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getContract(withSigner = false) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  if (withSigner) {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
  }
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
}

function sanitizeUsername(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
}

async function summarize(raw) {
  const groq = new Groq({ apiKey: GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 150,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that summarizes journal entries. Summarize in 1-2 clear, empathetic sentences. Keep the emotional tone. Remove filler words. Keep it under 280 characters. Return ONLY the summary, nothing else."
      },
      {
        role: "user",
        content: `Summarize this journal entry: "${raw}"`
      }
    ]
  });
  return completion.choices[0].message.content.trim();
}

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check
// GET /health
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    contract: CONTRACT_ADDRESS,
    network: "Status Network Testnet",
    chainId: 1660990954,
    rpc: RPC_URL,
    explorer: "https://sepoliascan.status.network",
    gasless: true,
    note: "No wallet needed — server signs all transactions on behalf of users"
  });
});

// Add a journal entry
// POST /journal/add
// Body: { "name": "yagnesh", "raw": "today was rough..." }
// No wallet needed! Server wallet signs the tx gaslessly.
app.post("/journal/add", async (req, res) => {
  try {
    const { name, raw } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "'name' is required — just pick a username" });
    }
    if (!raw || typeof raw !== "string" || raw.trim().length === 0) {
      return res.status(400).json({ error: "'raw' journal entry text is required" });
    }

    const username = sanitizeUsername(name);
    if (username.length === 0) {
      return res.status(400).json({ error: "Username must contain letters or numbers" });
    }

    // Step 1: AI summarizes the entry
    const summary = await summarize(raw.trim());

    // Step 2: Server wallet stores on-chain gaslessly (user needs nothing)
    const contract = getContract(true);
    const tx = await contract.addEntry(username, raw.trim(), summary, {
      gasPrice: 0  // gasless on Status Network
    });
    await tx.wait();

    res.json({
      success: true,
      username,
      raw: raw.trim(),
      summary,
      txHash: tx.hash,
      explorerUrl: `https://sepoliascan.status.network/tx/${tx.hash}`,
      gasPrice: 0,
      network: "Status Network Testnet",
      note: "Signed by server wallet — user needed no wallet or ETH"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all entries for a username
// GET /journal/entries?name=yagnesh
app.get("/journal/entries", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "'name' query param is required" });

    const username = sanitizeUsername(name);
    const contract = getContract();
    const count = Number(await contract.getEntryCount(username));
    const entries = [];

    for (let i = 0; i < count; i++) {
      const [raw, summary, timestamp] = await contract.getEntry(username, i);
      entries.push({
        index: i,
        raw,
        summary,
        timestamp: Number(timestamp),
        date: new Date(Number(timestamp) * 1000).toISOString()
      });
    }

    res.json({ username, count, entries });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Reflect on all entries for a username
// GET /journal/reflect?name=yagnesh
app.get("/journal/reflect", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "'name' query param is required" });

    const username = sanitizeUsername(name);
    const contract = getContract();
    const summaries = await contract.getAllSummaries(username);

    if (summaries.length === 0) {
      return res.json({
        username,
        entryCount: 0,
        reflection: "No journal entries found for this username yet. Add some entries first!"
      });
    }

    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content: "You are an empathetic journaling coach. Identify emotional patterns, recurring themes, and give a short, warm, insightful reflection in 3-4 sentences. Return ONLY the reflection, nothing else."
        },
        {
          role: "user",
          content: `These are a user's journal entry summaries stored permanently on-chain. Reflect on them:\n\n${summaries.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
        }
      ]
    });

    res.json({
      username,
      entryCount: summaries.length,
      summaries,
      reflection: completion.choices[0].message.content.trim()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`OnChain AI Journal API running on port ${PORT}`);
  console.log(`Contract: ${CONTRACT_ADDRESS}`);
  console.log(`Network: Status Network Testnet (gasless)`);
  console.log(`Server wallet signs all txs — users need no wallet!`);
});

module.exports = app;
