// interact.js — Example: write and read journal entries on Status Network
// Usage: node interact.js
// Requires: npm install ethers

const { ethers } = require("ethers");

// ── Config ────────────────────────────────────────────────────────────────────
const RPC_URL = "https://public.sepolia.rpc.status.network";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // set after deploying
const PRIVATE_KEY = process.env.PRIVATE_KEY;           // your wallet private key

const ABI = [
  "function addEntry(string raw, string summary) external",
  "function getEntryCount(address author) external view returns (uint256)",
  "function getEntry(address author, uint256 index) external view returns (string raw, string summary, uint256 timestamp)",
  "function getAllSummaries(address author) external view returns (string[])"
];

// ── Setup ─────────────────────────────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

// ── Write Entry (gasless) ─────────────────────────────────────────────────────
async function writeEntry(rawInput, aiSummary) {
  console.log("📝 Writing entry to Status Network (gasless)...");

  const tx = await contract.addEntry(rawInput, aiSummary, {
    gasPrice: 0  // gasless — this is the magic of Status Network
  });

  console.log("⏳ Waiting for confirmation...");
  const receipt = await tx.wait();

  console.log("✅ Entry stored permanently!");
  console.log(`🔗 https://sepoliascan.status.network/tx/${tx.hash}`);
  return tx.hash;
}

// ── Read All Entries ──────────────────────────────────────────────────────────
async function readEntries(address) {
  const count = await contract.getEntryCount(address);
  console.log(`\n📖 Found ${count} journal entries for ${address}\n`);

  for (let i = 0; i < count; i++) {
    const [raw, summary, timestamp] = await contract.getEntry(address, i);
    const date = new Date(Number(timestamp) * 1000).toLocaleString();
    console.log(`── Entry ${i + 1} [${date}]`);
    console.log(`   Raw:     ${raw}`);
    console.log(`   Summary: ${summary}`);
    console.log();
  }
}

// ── Demo ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌐 Connected to Status Network Testnet");
  console.log(`👛 Wallet: ${wallet.address}\n`);

  // Example: write an entry
  const raw = "today was really rough, had a bad meeting and couldn't focus all day";
  const summary = "Challenging day — a difficult meeting disrupted focus and productivity throughout.";

  await writeEntry(raw, summary);

  // Read all entries back
  await readEntries(wallet.address);
}

main().catch(console.error);
