import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import "./Auth.css";

const VerifyEmail = () => {
  const [status, setStatus] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("Invalid verification link.");
        setLoading(false);
        return;
      }

      try {
        // Changed to GET request with token as query parameter
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/verify-email?token=${token}`
        );

        if (response.status === 200) {
          setStatus("Email verified successfully! Redirecting to login...");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("Unexpected response. Please try again.");
        }
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 400:
              setStatus("Invalid or expired token.");
              break;
            case 404:
              setStatus("User not found.");
              break;
            case 500:
              setStatus("Server error. Please try again later.");
              break;
            default:
              setStatus(`Verification failed: ${error.response.data.error}`);
          }
        } else {
          setStatus("Network error. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Email Verification</h2>
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <p className={status.includes("successfully") ? "success" : "error"}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
