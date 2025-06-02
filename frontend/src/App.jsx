import { useState, useEffect } from "react";
import PaymanButton from "./PaymanButton";

function App() {
  const [user, setUser] = useState(null);
  const [response, setResponse] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Check for OAuth code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !user) {
      exchangeCodeForToken(code);
    }
  }, [user]);

  const exchangeCodeForToken = async (code) => {
    const response = await fetch("http://localhost:8080/api/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    setUser(data);

    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const sendQuery = async () => {
    const response = await fetch(
      `http://localhost:8080/api/payman/${user.userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();
    setResponse(data.response);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-6">Payman OAuth Demo</h1>
          <PaymanButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Payman Dashboard</h1>
          <p className="text-gray-600">
            Connected successfully! User ID: {user.userId}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Try Payman Operations</h2>

          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setQuery("list all test wallets and their balances")
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Get Wallets
              </button>
              <button
                onClick={() => setQuery("list all test payees")}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Get Payees
              </button>
              <button
                onClick={() => setQuery("show my last 5 transactions")}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Get Transactions
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your Payman query..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendQuery}
                className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Send
              </button>
            </div>
          </div>

          {response && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Response:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
