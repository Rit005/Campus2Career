import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import OAuthButtons from "../components/ui/OAuthButtons";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      const role = result.data?.user?.role;

      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "recruiter") navigate("/recruiter/dashboard", { replace: true });
      else if (role === "student") navigate("/student/dashboard", { replace: true });
      else navigate("/choose-dashboard", { replace: true });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Layout title="Welcome back" subtitle="Sign in to your account">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto px-4 sm:px-0 space-y-5"
      >
        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Password</label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[42px] text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>

        <div className="pt-2">
          <OAuthButtons
            onGoogleClick={loginWithGoogle}
            onGithubClick={loginWithGithub}
            loading={loading}
          />
        </div>

        <p className="text-center text-sm text-gray-600 pt-2">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-primary-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </Layout>
  );
};

export default Login;