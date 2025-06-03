import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const CLIENT_ID = "pm-test-aaQzmXN2gToNlG-ukKQIJm_N"; // Your Payman client ID
  const SCOPES =
    "read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet";
  const REDIRECT_URI = "http://localhost:5173";

  useEffect(() => {
    // Listen for OAuth messages from Payman popup
    const handleMessage = (event) => {
      console.log("Received message:", event.data);

      if (event.data.type === "payman-oauth-redirect") {
        const url = new URL(event.data.redirectUri);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");

        console.log("OAuth code:", code);
        console.log("OAuth error:", error);

        if (code) {
          // Navigate to callback page with the code
          navigate(`/callback?code=${code}`);
        } else if (error) {
          console.error("OAuth error:", error);
          alert("OAuth authorization failed: " + error);
        }
      }
    };

    // Add event listener for messages
    window.addEventListener("message", handleMessage);

    // Load Payman OAuth script
    const script = document.createElement("script");
    script.src = "https://app.paymanai.com/js/pm.js";
    script.setAttribute("data-client-id", CLIENT_ID);
    script.setAttribute("data-scopes", SCOPES);
    script.setAttribute("data-redirect-uri", REDIRECT_URI);
    script.setAttribute("data-target", "#payman-connect");
    script.setAttribute("data-dark-mode", "false");
    script.setAttribute("strategy", "popup");
    script.setAttribute(
      "data-styles",
      JSON.stringify({
        borderRadius: "8px",
        fontSize: "16px",
        padding: "12px 24px",
      })
    );

    document.body.appendChild(script);

    return () => {
      // Cleanup
      window.removeEventListener("message", handleMessage);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h1>🚀 Welcome to Payman OAuth Demo</h1>
          <p>Connect your Payman account to get started</p>
        </header>

        <div className="login-content">
          <div className="features-list">
            <h3>What you can do after connecting:</h3>
            <ul>
              <li>✅ View your wallet balances</li>
              <li>✅ List your payees</li>
              <li>✅ Send payments</li>
              <li>✅ View transaction history</li>
            </ul>
          </div>

          <div className="connect-section">
            <p>Click below to securely connect with Payman:</p>
            <div id="payman-connect"></div>
          </div>

          <div className="security-note">
            <p>
              <strong>🔒 Secure OAuth Flow</strong>
            </p>
            <p>
              Your credentials are never stored on our servers. This demo uses
              Payman's official OAuth implementation for secure authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
