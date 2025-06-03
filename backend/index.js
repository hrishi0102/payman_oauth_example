import express from "express";
import cors from "cors";
import { PaymanClient } from "@paymanai/payman-ts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Validate required environment variables
if (!process.env.PAYMAN_CLIENT_ID || !process.env.PAYMAN_CLIENT_SECRET) {
  console.error(
    "ERROR: PAYMAN_CLIENT_ID and PAYMAN_CLIENT_SECRET environment variables are required"
  );
  process.exit(1);
}

// OAuth configuration
const config = {
  clientId: process.env.PAYMAN_CLIENT_ID,
  clientSecret: process.env.PAYMAN_CLIENT_SECRET,
};

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// OAuth token exchange endpoint
app.post("/api/oauth/token", async (req, res) => {
  try {
    const { code } = req.body;

    console.log("🔄 Received token exchange request");
    console.log(
      "Code received:",
      code ? code.substring(0, 20) + "..." : "No code"
    );

    if (!code) {
      console.error("No authorization code provided in request");
      return res.status(400).json({
        success: false,
        error: "Authorization code is required",
      });
    }

    console.log("🔄 Creating Payman client with auth code...");

    const client = PaymanClient.withAuthCode(
      {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
      },
      code
    );

    console.log("⏳ Waiting for client initialization...");
    // Wait for client initialization to complete
    await new Promise((resolve) => setTimeout(resolve, 7000));

    console.log("🔄 Getting access token...");
    // Get access token after initialization delay
    const tokenResponse = await client.getAccessToken();

    console.log("Token response received:", !!tokenResponse);

    if (!tokenResponse?.accessToken) {
      console.error("Invalid token response - no access token received");
      console.error("Token response:", tokenResponse);
      return res.status(500).json({
        success: false,
        error: "Invalid token response from Payman",
      });
    }

    console.log("✅ Token exchange successful");
    console.log("Access token length:", tokenResponse.accessToken.length);

    res.json({
      success: true,
      accessToken: tokenResponse.accessToken,
      expiresIn: tokenResponse.expiresIn,
    });
  } catch (error) {
    console.error("Token exchange failed:", error.message);
    console.error("Full error:", error);
    res.status(500).json({
      success: false,
      error: "Token exchange failed: " + error.message,
    });
  }
});

// Test authenticated endpoint
app.get("/api/user/info", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authorization header required",
      });
    }

    const accessToken = authHeader.split(" ")[1];

    const client = PaymanClient.withToken(config.clientId, {
      accessToken,
      expiresIn: 3600,
    });

    // Test the token by fetching wallet info
    const wallets = await client.ask("list all my wallets and their balances");

    res.json({
      success: true,
      message: "Successfully authenticated with Payman!",
      wallets: wallets,
    });
  } catch (error) {
    console.error("Failed to fetch user info:", error.message);
    res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Make sure your Payman OAuth config has:`);
  console.log(`Redirect URLs: http://localhost:5173/callback`);
  console.log(
    `Originating Domains: http://localhost:5173, https://app.paymanai.com`
  );
});
