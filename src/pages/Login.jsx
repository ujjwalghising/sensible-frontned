import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://sensible-backend.up.railway.app/api/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
        {/* Navigation Link to Register */}
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
