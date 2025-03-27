import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        "https://sensible-backend.up.railway.app/api/login",
        formData
      );

      if (!res.data.isVerified) {
        setError("Your email is not verified. Please verify before logging in.");
        setShowResend(true);
        return;
      }

      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (error) {
      setError(error.response?.data?.error || "Login failed.");
    }
  };

  const handleResendVerification = async () => {
    try {
      await axios.post(
        "https://sensible-backend.up.railway.app/api/resend-verification",
        { email: formData.email }
      );
      setMessage("Verification email sent! Please check your inbox.");
      setShowResend(false);
    } catch (error) {
      setError("Failed to resend verification email. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>

        {showResend && (
          <button type="button" onClick={handleResendVerification}>
            Resend Verification Email
          </button>
        )}

        <p>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#4CAF50", textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
