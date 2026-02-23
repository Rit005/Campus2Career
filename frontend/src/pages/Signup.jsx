import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import OAuthButtons from "../components/ui/OAuthButtons";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const { signup, loginWithGoogle, loginWithGithub, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (isAuthenticated) {
      if (!user?.role) {
        navigate("/choose-dashboard");
      } else if (user.role === "student") {
        navigate("/student/dashboard");
      } else if (user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);


  const validateForm = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Enter a valid email";
    if (!role) errors.role = "Please select a role";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be 6+ characters";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    const result = await signup(name, email, password, role);

    if (result.success) {
      navigate(result.redirectPath || "/choose-dashboard");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Layout title="Create your account" subtitle="Start your journey with Campus2Career">
      <form className="space-y-6" onSubmit={handleSubmit}>

        {error && (
          <Alert type="error" message={error} onClose={() => setError("")} />
        )}

        <Input
          label="Full name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          error={validationErrors.name}
        />

        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          error={validationErrors.email}
        />

        <div>
          <label className="label mb-1">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input w-full"
          >
            <option value="">-- Choose Role --</option>
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
            <option value="recruiter">Null</option>
          </select>
          {validationErrors.role && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.role}</p>
          )}
        </div>

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            error={validationErrors.password}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>

        <OAuthButtons
          onGoogleClick={loginWithGoogle}
          onGithubClick={loginWithGithub}
          loading={loading}
        />

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="link">Sign in</Link>
        </p>
      </form>
    </Layout>
  );
};

export default Signup;
