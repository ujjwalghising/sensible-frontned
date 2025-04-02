import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/api/auth/register", formData);
      setMessage("Registration successful! Please check your email to verify your account.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-100 max-w-md bg-white p-8 rounded-lg">
        <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">Register</h2>

        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {["name", "email", "password"].map((field) => (
            <div key={field} className="relative">
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="peer w-full h-10 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-transparent placeholder-transparent"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
              <label
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 bg-white px-1 transition-all 
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400
                  peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 
                  peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-500"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            </div>
          ))}

          <div className="text-right">
            <Link to="/forgot-password" className="text-sky-500 text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full h-10 py-3 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-4 text-gray-600">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-sky-500 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
