import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const token = new URLSearchParams(location.search).get("token");

      try {
        await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        setMessage("Email verified successfully. You can now log in.");
        navigate("/login");
      } catch (error) {
        setMessage("Invalid or expired token.");
      }
    };

    verify();
  }, [navigate, location]);

  return <div>{message}</div>;
};

export default VerifyEmail;
