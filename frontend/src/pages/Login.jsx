import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import OAuthButtons from '../components/ui/OAuthButtons';
import { Eye, EyeOff } from "lucide-react"; // 👈 ADD ICONS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 ADD STATE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, loginWithGoogle, loginWithGithub, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/choose-dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/choose-dashboard');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate(result.redirectPath || '/choose-dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleGithubLogin = () => {
    loginWithGithub();
  };

  return (
    <Layout title="Welcome back" subtitle="Sign in to your account">
      <form className="space-y-6" onSubmit={handleSubmit}>
        
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        {/* PASSWORD WITH EYE ICON */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="label">Password</label>
            <Link to="/forgot-password" className="text-sm link">
              Forgot password?
            </Link>
          </div>

          <Input
            id="password"
            type={showPassword ? "text" : "password"} // 👈 Toggle type
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          {/* EYE ICON BUTTON */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>

        <OAuthButtons
          onGoogleClick={handleGoogleLogin}
          onGithubClick={handleGithubLogin}
          loading={loading}
        />

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="link">Sign up</Link>
        </p>
      </form>
    </Layout>
  );
};

export default Login;
