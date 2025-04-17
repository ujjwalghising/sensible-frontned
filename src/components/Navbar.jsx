import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faShoppingBag,
  faBars,
  faRightFromBracket,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
const categories = [
  "Clothing",
  "Accessories",
  "Footwear",
  "Jewellery",
  "+ more",
];

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  let timeoutId = null;

  // Handle logout
  const handleLogout = () => {
    if (isAuthenticated) {
      logout(); // Clears cookie + user state
      toast.success("Logged out successfully!", {
        autoClose: 800,
      });
      navigate("/login"); // Soft redirect via React Router
    } else {
      toast.info("You're already logged out.", {
        autoClose: 800,
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
      <div className="bg-gray-100 px-6 py-1.5 flex justify-between items-center relative z-50">
        {/* Bars button - hidden when menu is open */}
        {!showMenu && (
          <button
            className="text-gray-700 text-xl z-50"
            onClick={() => setShowMenu(true)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}

        {/* Sidebar menu */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out z-40 ${
            showMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-bold text-lg">Categories</h2>
            <button
              onClick={() => setShowMenu(false)}
              className="text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <ul className="p-4 space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  to={`/products/category/${category.toLowerCase()}`}
                  onClick={() => setShowMenu(false)}
                  className="block px-2 py-2 rounded hover:bg-gray-100 text-gray-700"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Backdrop overlay */}
        {showMenu && (
          <div
            className="fixed inset-0 bg-black/80 z-30 transition-opacity duration-300"
            onClick={() => setShowMenu(false)}
          />
        )}
        {/* Marquee message (hidden on small screens) */}
        <div className="w-full mx-6 overflow-hidden hidden sm:block">
          <p className="whitespace-nowrap animate-marquee text-orange-600 font-extrabold text-xl">
            🚀 Zoom zoom! Free Shipping over $50 🛒 • 😎 Need us? We're up 24/7
            ☕ • 🌸 Spring's got drip – don’t miss it! 💃🛍️
          </p>
        </div>

        {/* Cart icon */}
        <Link to="/cart" className="text-gray-700 text-xl z-50">
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
            className="bg-yellow-500 px-4 py-2 rounded-r-md text-white hover:bg-orange-500"
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

              {!isAuthenticated && (
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
