# Campus2Career Frontend

React frontend for Campus2Career authentication system built with Vite and Tailwind CSS.

## Features

- 🔐 Login & Signup with form validation
- 📧 Email/Password authentication
- 🔑 Google OAuth 2.0 login
- 🐙 GitHub OAuth login
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔄 Auth context for state management
- 🛡️ Protected routes
- ⚡ Fast refresh with Vite

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher)

### Installation

```bash
# Install dependencies
npm install

# Create environment file
touch .env.local

# Add API URL to .env.local
echo "VITE_API_URL=http://localhost:5000" > .env.local

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

## Project Structure

```
src/
├── api/
│   └── api.js             # Axios configuration & API calls
├── components/
│   ├── ui/
│   │   ├── Alert.jsx      # Alert component
│   │   ├── Button.jsx     # Button component
│   │   ├── Input.jsx      # Input component
│   │   └── OAuthButtons.jsx
│   ├── Layout.jsx         # Auth layout wrapper
│   └── ProtectedRoute.jsx # Route protection HOC
├── context/
│   └── AuthContext.jsx    # Authentication state
├── pages/
│   ├── Dashboard.jsx      # Protected dashboard
│   ├── Home.jsx           # Landing page
│   ├── Login.jsx          # Login page
│   └── Signup.jsx         # Signup page
├── App.jsx                # Main app with routes
└── main.jsx               # App entry point
```

## Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/signup` | Signup | Public |
| `/dashboard` | Dashboard | Protected |

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Tailwind CSS Configuration

Tailwind is configured with a custom color palette. The configuration is in `tailwind.config.js`.

### Custom Colors

- Primary: Blue palette (`primary-50` to `primary-950`)

## API Integration

The API is configured in `src/api/api.js` with:
- Base URL from environment variable
- Automatic JWT token injection
- Credentials (cookies) support
- Global error handling

## License

MIT

