import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // or a spinner

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
