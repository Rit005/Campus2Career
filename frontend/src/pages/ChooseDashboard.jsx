import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/api';

const ChooseDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if user already has a role
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const handleRoleSelect = async (role) => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.selectRole({ role });
      
      if (response.data.success) {
        // Navigate to the appropriate dashboard
        navigate(response.data.data.redirectPath, { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Failed to select role. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Campus2Career
          </h1>
          <p className="text-lg text-gray-600">
            Choose your dashboard to continue
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Dashboard Card */}
          <div
            onClick={() => !loading && handleRoleSelect('student')}
            className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'border-transparent hover:border-primary-500'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              {/* Student Icon */}
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg 
                  className="w-12 h-12 text-primary-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 14l9-5-9-5-9 5 9 5z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 14v7m0 0l-3-2m3 2l3-2" 
                  />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Student Dashboard
              </h2>
              
              <p className="text-gray-600 mb-4">
                Access your job search tools, apply to positions, and track your career journey.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  Find Jobs
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  Build Profile
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  Track Applications
                </span>
              </div>
              
              <button
                disabled={loading}
                className="w-full py-3 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Select Student</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recruiter Dashboard Card */}
          <div
            onClick={() => !loading && handleRoleSelect('recruiter')}
            className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 ${
              loading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'border-transparent hover:border-primary-500'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              {/* Recruiter Icon */}
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <svg 
                  className="w-12 h-12 text-primary-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                  />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recruiter Dashboard
              </h2>
              
              <p className="text-gray-600 mb-4">
                Post jobs, review candidates, and build your talent pipeline for your organization.
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  Post Jobs
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  Review Candidates
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                  Manage Team
                </span>
              </div>
              
              <button
                disabled={loading}
                className="w-full py-3 px-6 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Select Recruiter</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>You can switch between dashboards later in your settings</p>
        </div>
      </div>
    </div>
  );
};

export default ChooseDashboard;

