import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faShoppingBag,
  faBars,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Navbar = () => {
  const { token, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  let timeoutId = null;

  // Handle logout
  const handleLogout = () => {
    if (token) {
      logout();
      toast.success("Logged out successfully!", {
        autoClose: 500,
        onClose: () => navigate("/login"),
      });
      
    } else {
      toast.info("You're already logged out.", {
        autoClose: 500,
      });
    }
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Dropdown hover logic
  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setShowProfileDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setShowProfileDropdown(false), 200);
  };

  return (
    <header className="w-full fixed top-0 z-50">
      {/* Top Navbar */}
      <div className="bg-gray-100 px-6 py-1.5 flex justify-between items-center relative">
        <button className="text-gray-700 text-xl">
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="w-full mx-6 overflow-hidden">
          <p className="whitespace-nowrap animate-marquee text-orange-600 font-extrabold text-xl">
            🚀 Zoom zoom! Free Shipping over $50 🛒 • 😎 Need us? We're up 24/7 ☕ • 🌸 Spring's got drip – don’t miss it! 💃🛍️
          </p>
        </div>
        <Link to="/cart" className="text-gray-700 text-xl">
          <FontAwesomeIcon icon={faShoppingBag} />
        </Link>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white px-6 py-2.5 flex items-center justify-between border-b border-gray-300 shadow-xs">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-gray-800 relative inline-block group transition-all duration-300"
        >
          Sensible
          <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-current transition-all duration-300 group-hover:w-full"></span>
        </Link>

        {/* Search Bar */}
        <div className="relative flex items-center w-1/2">
          <input
            type="text"
            className="w-full border border-gray-300 px-4 py-2 rounded-l-md text-gray-700 outline-none"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="bg-yellow-500 px-4 py-2 rounded-r-md text-white"
            onClick={handleSearch}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        {/* Profile Section */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="text-gray-700 text-xl">
            <FontAwesomeIcon icon={faUser} />
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-md transition-opacity duration-200 ease-in-out"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Profile
              </Link>

              {!token && (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Signup
                  </Link>
                </>
              )}

              {/* Always show Logout button */}
              <div className="group">
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-between items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Logout
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    className="ml-2 text-blue-500 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-700"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
