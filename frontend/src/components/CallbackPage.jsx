import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CallbackPage = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false); // Prevent multiple executions

  useEffect(() => {
    // Prevent multiple executions in React StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        console.log("Callback - Code:", code?.substring(0, 20) + "...");
        console.log("Callback - Error:", error);

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("No authorization code received");
        }

        console.log("🔄 Exchanging code for token...");
        setIsLoading(true);

        // Exchange code for access token
        const response = await fetch("/api/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        console.log("Token response status:", response.status);
        const data = await response.json();
        console.log("Token response data:", data);

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to exchange code for token");
        }

        console.log("✅ Token exchange successful!");

        // Call the onLogin callback with the token
        onLogin(data.accessToken);

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("❌ Callback error:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, onLogin, navigate]);

  if (error) {
    return (
      <div className="callback-container">
        <div className="callback-card error">
          <h2>❌ Authentication Failed</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/login")} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="callback-container">
      <div className="callback-card">
        {isLoading ? (
          <>
            <div className="spinner"></div>
            <h2>🔄 Completing Authentication</h2>
            <p>Please wait while we securely connect your account...</p>
          </>
        ) : (
          <>
            <h2>✅ Success!</h2>
            <p>Redirecting to your dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;
