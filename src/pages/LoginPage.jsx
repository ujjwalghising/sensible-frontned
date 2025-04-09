import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios";
import { Eye, EyeOff } from "lucide-react";


const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await api.post("/api/auth/login", formData, {
        withCredentials: true,
      });
  
      if (response.status === 403) {
        setError("Please verify your email before logging in.");
        return;
      }
  
      try {
        await login(); // fetch profile
        navigate("/profile");
      } catch (profileErr) {
        console.error("Error fetching profile:", profileErr);
        setError("Login succeeded but failed to fetch profile.");
      }
  
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-100 max-w-md bg-white p-8 rounded-lg">
        <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">Welcome Back</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
        {["email", "password"].map((field) => (
  <div key={field} className="relative">
    <input
      type={
        field === "password"
          ? showPassword
            ? "text"
            : "password"
          : "email"
      }
      name={field}
      value={formData[field]}
      onChange={handleChange}
      required
      className="peer w-full h-10 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-transparent placeholder-transparent"
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

    {field === "password" && (
      <div
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </div>
    )}
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
          >
            LOGIN
          </button>
        </form>

        <div className="text-center mt-4 text-gray-600">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-sky-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
