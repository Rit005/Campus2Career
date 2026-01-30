import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, handleOAuthCallback, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle OAuth callback token
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleOAuthCallback(token);
    }
  }, [searchParams, handleOAuthCallback]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case "google":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case "github":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              C2C
            </div>
            <span className="text-xl font-bold">Campus2Career</span>
          </div>

          <div>
            {!user ? (
              <button
                onClick={() => navigate("/login")}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto p-6">
        {user && (
          <>
            {/* Welcome */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex items-center gap-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary-600">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user.name.split(" ")[0]} 👋
                </h1>
                <p className="text-gray-600">Glad to see you again</p>
              </div>
            </div>

            {/* Profile + Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Profile</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {getProviderIcon(user.provider)}
                    </div>
                    <span className="capitalize">{user.provider || "local"}</span>
                  </div>
                  <p><strong>Email:</strong> {user.email}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full bg-primary-50 hover:bg-primary-100 p-3 rounded-lg">📚 Browse Courses</button>
                  <button className="w-full bg-primary-50 hover:bg-primary-100 p-3 rounded-lg">💼 Job Opportunities</button>
                  <button className="w-full bg-primary-50 hover:bg-primary-100 p-3 rounded-lg">🎯 Career Goals</button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
