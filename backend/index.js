import express from "express";
import cors from "cors";
import { PaymanClient } from "@paymanai/payman-ts";

const app = express();

app.use(cors());
app.use(express.json());

// Store tokens in memory (use database in production)
const userTokens = new Map();

// OAuth token exchange
app.post("/api/oauth/token", async (req, res) => {
  const { code } = req.body;

  const client = PaymanClient.withAuthCode(
    {
      clientId: process.env.PAYMAN_CLIENT_ID,
      clientSecret: process.env.PAYMAN_CLIENT_SECRET,
    },
    code
  );

  const tokenResponse = await client.getAccessToken();

  // Store token with a simple user ID
  const userId = "user_" + Date.now();
  userTokens.set(userId, {
    accessToken: tokenResponse.accessToken,
    expiresIn: tokenResponse.expiresIn,
  });

  res.json({
    userId,
    accessToken: tokenResponse.accessToken,
    expiresIn: tokenResponse.expiresIn,
  });
});

// Proxy endpoint for Payman operations
app.post("/api/payman/:userId", async (req, res) => {
  const { userId } = req.params;
  const { query } = req.body;

  const tokenData = userTokens.get(userId);

  const client = PaymanClient.withToken(process.env.PAYMAN_CLIENT_ID, {
    accessToken: tokenData.accessToken,
    expiresIn: tokenData.expiresIn,
  });

  const response = await client.ask(query);
  res.json({ response });
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
