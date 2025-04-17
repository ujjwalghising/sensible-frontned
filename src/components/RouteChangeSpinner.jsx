// src/components/RouteChangeSpinner.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const RouteChangeSpinner = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300); // Adjust delay as needed

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return loading ? <LoadingSpinner /> : null;
};

export default RouteChangeSpinner;
