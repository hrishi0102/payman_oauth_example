# Payman OAuth Demo - React + Express

A simple React + Express application demonstrating Payman OAuth integration with a working login flow.

## ✨ Features

- 🔐 Secure OAuth login with Payman
- ⚛️ React frontend with React Router
- 🚀 Express backend API
- 💳 Authenticated API calls to fetch wallet info
- 📱 Responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Payman developer account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd payman-oauth-demo
npm install
cd frontend && npm install && cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PAYMAN_CLIENT_ID=your_client_id_here
PAYMAN_CLIENT_SECRET=your_client_secret_here
PORT=3001
```

### 3. Update Client ID

In `frontend/src/components/LoginPage.jsx`, update line 8:

```javascript
const CLIENT_ID = "your_actual_client_id_here"; // Replace with your real client ID
```

### 4. Configure Payman OAuth

In your [Payman Dashboard](https://app.paymanai.com) OAuth settings:

- **Redirect URLs**: `http://localhost:5173`
- **Originating Domains**: `http://localhost:5173`, `https://app.paymanai.com`
- **Scopes**: `read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet`

### 5. Start the App

```bash
npm run dev
```

This starts:

- Express server on `http://localhost:3001`
- React app on `http://localhost:5173`

### 6. Test the Flow

1. Visit `http://localhost:5173`
2. Click "Connect with Payman"
3. Complete OAuth flow in popup
4. See authenticated dashboard with wallet info

## 📁 Project Structure

```
payman-oauth-demo/
├── backend/
│   └── server.js          # Express server with OAuth endpoints
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginPage.jsx      # Login page with Payman OAuth
│   │   │   ├── CallbackPage.jsx   # OAuth callback handler
│   │   │   └── DashboardPage.jsx  # Protected dashboard
│   │   ├── App.jsx        # Main React app with routing
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # React entry point
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── package.json           # Root package.json with dev scripts
├── .env                   # Environment variables
└── README.md
```

## 🔧 Available Scripts

```bash
npm run dev          # Start both frontend and backend in development
npm run server       # Start only the Express server
npm run client       # Start only the React app (from frontend directory)
```

## 🔄 OAuth Flow

1. **Login**: User clicks "Connect with Payman" button
2. **Authorization**: Popup opens to Payman OAuth page
3. **Callback**: User grants permissions, popup closes with auth code
4. **Token Exchange**: Frontend sends code to backend, gets access token
5. **Dashboard**: User sees authenticated content with wallet info

## 🛠️ API Endpoints

- `POST /api/oauth/token` - Exchange OAuth code for access token
- `GET /api/user/info` - Get authenticated user's wallet information
- `GET /api/health` - Health check

## 🐛 Troubleshooting

### Common Issues

- **OAuth popup blocked**: Make sure popup blockers are disabled
- **No message received**: Verify redirect URI matches exactly: `http://localhost:5173`
- **Token exchange fails**: Check that your client secret is correct in `.env`
- **CORS errors**: Ensure backend is running on port 3001

### Debug Steps

1. Check browser console for errors
2. Verify your Payman OAuth config matches the URLs above
3. Check that both servers are running
4. Ensure your `.env` file has the correct credentials

## 🔐 Security Notes

- Client secret is only used in backend (never exposed to frontend)
- Tokens are stored in localStorage (consider HTTP-only cookies for production)
- OAuth uses popup strategy for better UX

## 📚 Learn More

- [Payman Documentation](https://docs.paymanai.com)
- [Payman OAuth Guide](https://docs.paymanai.com/oauth)

## 📄 License

MIT License - see LICENSE file for details
