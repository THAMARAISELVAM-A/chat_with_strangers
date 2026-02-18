const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are playing the role of a random stranger in a "chat with strangers" app (like Omegle).
You've been matched with someone. Be natural, friendly but a bit mysterious. Keep messages SHORT (1-3 sentences max).
Don't be too eager. Sometimes ask questions back. Occasionally mention interests.
Never reveal you're an AI. Be human-like, casual, sometimes use lowercase, abbreviations like "lol", "tbh", "ngl", "rn".
React naturally to what the user says. If they share interests, build on them.`;

app.post("/api/chat", async (req, res) => {
  const { messages, commonInterests } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  try {
    const contextPrompt = commonInterests?.length
      ? `\nYou share these interests with the user: ${commonInterests.join(", ")}. Bring them up naturally if relevant.`
      : "";

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 150,
      system: SYSTEM_PROMPT + contextPrompt,
      messages: messages.slice(-12),
    });

    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error("Anthropic error:", err.message);
    res.status(500).json({ error: "AI response failed", detail: err.message });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", apiKeySet: !!process.env.ANTHROPIC_API_KEY });
});

app.listen(PORT, () => {
  console.log(`\n✅ StrangerX backend running on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("⚠️  WARNING: ANTHROPIC_API_KEY not set in .env file!");
  } else {
    console.log("🔑 Anthropic API key loaded.");
  }
});
