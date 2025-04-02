import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email!");

    try {
      const response = await axios.post("/api/auth/forgot-password", { email });

      if (response.status === 200) {
        toast.success("Reset link sent! Check your email.");
      } else {
        toast.error("Failed to send reset link.");
      }
    } catch {
      toast.error("Something went wrong! Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="w-100 max-w-md bg-white p-8 rounded-lg">
        <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">Forgot Password?</h2>
        <p className="text-center text-gray-600 mb-4">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="peer w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-transparent placeholder-transparent"
              placeholder="Email Address"
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 bg-white px-1 transition-all 
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 
                peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-blue-500"
            >
              Email Address
            </label>
          </div>

          <button
            type="submit"
            className="w-full h-10 py-3 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition"
          >
            Reset Password
          </button>
        </form>

        <div className="text-center mt-4 text-gray-600">
          <p>
            Need help?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Contact us!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;