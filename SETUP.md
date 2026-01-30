# Campus2Career - Authentication System Setup Guide

A complete, production-ready authentication system with Email/Password, Google OAuth, and GitHub OAuth.

## 📁 Project Structure

```
Campus2Career/
├── frontend/                 # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── api/             # API configuration
│   │   ├── components/       # Reusable components
│   │   │   ├── ui/          # UI components (Button, Input, Alert, etc.)
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/         # React Context (AuthContext)
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── backend/                  # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/          # Passport configuration
│   │   ├── controllers/     # Auth controllers
│   │   ├── middleware/      # Auth & error middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routes
│   │   └── server.js        # Express server entry
│   ├── .env.example
│   └── package.json
└── README.md
```

## 🚀 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Cloud Console account (for Google OAuth)
- GitHub Developer settings (for GitHub OAuth)

## 📦 Installation

### 1. Clone and Setup

```bash
# Navigate to project directory
cd Campus2Career

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/campus2career

# JWT Configuration (IMPORTANT: Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Google OAuth Configuration
# Get these from: https://console.cloud.google.com/
# 1. Create a project
# 2. Enable Google+ API
# 3. Create OAuth 2.0 credentials
# 4. Add authorized redirect URI: http://localhost:5000/auth/google/callback
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth Configuration
# Get these from: https://github.com/settings/developers
# 1. Create a new OAuth App
# 2. Add callback URL: http://localhost:5000/auth/github/callback
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Session Secret (for OAuth state verification)
SESSION_SECRET=your-session-secret-change-in-production
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Create `.env.local` file:
```bash
touch .env.local
```

3. Add frontend environment variables:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to APIs & Services > Credentials
4. Click "Create Credentials" > "OAuth client ID"
5. Configure the OAuth consent screen:
   - Application type: Web application
   - Application name: Campus2Career
   - Support email: your-email@example.com
6. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

### 4. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Campus2Career
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5000/auth/github/callback`
4. Click "Register application"
5. Copy Client ID and generate a new Client Secret

## 🏃 Running the Application

### Start MongoDB

Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or if using MongoDB Atlas, ensure your connection string is correct
```

### Start Backend

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔐 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/signup` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| POST | `/auth/logout` | Logout user | Public |
| GET | `/auth/me` | Get current user | Private |
| GET | `/auth/verify` | Verify JWT token | Public |
| GET | `/auth/google` | Initiate Google OAuth | Public |
| GET | `/auth/google/callback` | Google OAuth callback | Public |
| GET | `/auth/github` | Initiate GitHub OAuth | Public |
| GET | `/auth/github/callback` | GitHub OAuth callback | Public |

## 🎨 Frontend Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/signup` | Signup | Public |
| `/dashboard` | Dashboard | Protected |

## 🔧 Development vs Production

### Development
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campus2career
JWT_SECRET=your-dev-secret
FRONTEND_URL=http://localhost:5173
```

### Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-atlas-connection-string
JWT_SECRET=very-long-random-string-min-32-chars
FRONTEND_URL=https://your-production-domain.com
```

## 🧪 Testing OAuth

### Testing Google OAuth
1. Start both frontend and backend
2. Click "Continue with Google" on the login/signup page
3. You'll be redirected to Google for authorization
4. After approval, you'll be redirected back to the dashboard

### Testing GitHub OAuth
1. Start both frontend and backend
2. Click "Continue with GitHub" on the login/signup page
3. You'll be redirected to GitHub for authorization
4. After approval, you'll be redirected back to the dashboard

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP whitelist includes your IP

### CORS Errors
- Verify `FRONTEND_URL` matches your frontend URL
- Check that credentials are set to `true` in CORS config

### OAuth Callback Errors
- Ensure redirect URIs are exactly matching in OAuth provider settings
- Check that Client IDs and Secrets are correct in `.env`
- For production, ensure redirect URIs use HTTPS

### JWT Errors
- Ensure `JWT_SECRET` is set and consistent
- Clear browser cookies and local storage if token issues persist

## 📝 Additional Notes

### Security Best Practices
1. Always use HTTPS in production
2. Store secrets in environment variables, never in code
3. Use strong, unique secrets for JWT and session
4. Implement rate limiting for auth endpoints
5. Add email verification for production
6. Use httpOnly cookies for JWT storage

### Production Deployment
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas or managed MongoDB service
3. Configure proper CORS origins
4. Use environment-specific OAuth credentials
5. Set up proper logging and monitoring
6. Consider using a process manager like PM2

## 📚 Technologies Used

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- clsx & tailwind-merge

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- Passport.js (Google & GitHub strategies)
- JWT (jsonwebtoken)
- bcryptjs
- cookie-parser
- cors

---

## ✅ Quick Start Checklist

- [ ] Node.js installed (v18+)
- [ ] MongoDB installed/running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] `.env` file configured with secrets
- [ ] Google OAuth credentials created
- [ ] GitHub OAuth credentials created
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] OAuth redirect URIs configured
- [ ] Application tested end-to-end

Happy coding! 🎉

