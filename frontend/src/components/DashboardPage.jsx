import { useState, useEffect } from "react";

const DashboardPage = ({ onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("payman_access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await fetch("/api/user/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch user info");
      }

      setUserInfo(data);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card error">
          <h2>❌ Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={handleLogout} className="btn-primary">
            Go Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <header className="dashboard-header">
          <div>
            <h1>🎉 Welcome to Your Dashboard!</h1>
            <p>You've successfully connected to Payman</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </header>

        <div className="dashboard-content">
          <div className="success-message">
            <h2>✅ Authentication Successful!</h2>
            <p>{userInfo?.message}</p>
          </div>

          <div className="wallet-info">
            <h3>💰 Your Wallet Information</h3>
            <div className="info-card">
              <pre>{JSON.stringify(userInfo?.wallets, null, 2)}</pre>
            </div>
          </div>

          <div className="features-available">
            <h3>🚀 What You Can Do Now</h3>
            <div className="features-grid">
              <div className="feature-card">
                <h4>💳 View Balances</h4>
                <p>Check your wallet balances across all currencies</p>
              </div>
              <div className="feature-card">
                <h4>👥 Manage Payees</h4>
                <p>View and create new payment recipients</p>
              </div>
              <div className="feature-card">
                <h4>💸 Send Payments</h4>
                <p>Transfer money to your payees securely</p>
              </div>
              <div className="feature-card">
                <h4>📊 Transaction History</h4>
                <p>Review your past payment activities</p>
              </div>
            </div>
          </div>

          <div className="next-steps">
            <h3>🔮 Next Steps</h3>
            <p>
              Now that you're authenticated, you can extend this app to add:
            </p>
            <ul>
              <li>Payment form to send money</li>
              <li>Payee management interface</li>
              <li>Transaction history viewer</li>
              <li>Wallet balance dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
