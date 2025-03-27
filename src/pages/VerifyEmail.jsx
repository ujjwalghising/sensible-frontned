import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import "./Auth.css";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setError("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/verify-email`,
          { token }
        );
        setMessage(res.data.message);
        setTimeout(() => navigate("/login"), 3000);
      } catch (error) {
        setError(error.response?.data?.error || "Verification failed.");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  // ✅ Add Resend Verification Function
  const resendVerification = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    try {
      const res = await axios.post("/api/resend-verification", { email });
      setMessage(res.data.message);
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to resend verification email.");
      setMessage("");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Email Verification</h2>
        {error ? <p className="error">{error}</p> : <p className="success">{message}</p>}

        {/* ✅ Add Input Field for Resending Email */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button onClick={resendVerification}>Resend Verification Email</button>
      </div>
    </div>
  );
};

export default VerifyEmail;
