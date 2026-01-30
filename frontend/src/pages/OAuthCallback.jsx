import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    handleOAuthCallback(token);
  }, [searchParams, handleOAuthCallback, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default OAuthCallback;
