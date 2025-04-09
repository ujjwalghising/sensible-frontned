// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/user/profile", { withCredentials: true });
      setUser(response.data);
    } catch (err) {
      // Check if it's an auth error
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.warn("User not authenticated");
        setUser(null);
      } else {
        console.error("Failed to fetch user profile:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const login = async () => {
    await fetchProfile(); // 👈 fetch and set user after login
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout"); // ✅ correct path
      setUser(null);
      isAuthenticated(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  
  
useEffect(() => {
    fetchProfile();
  }, []);
  const isAuthenticated = !!user; // Check if the user is authenticated based on the token

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
  
};
export const useAuth = () => useContext(AuthContext);