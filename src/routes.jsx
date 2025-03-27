import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import PrivateRoute from "./components/PrivateRoute";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/products/category/:categoryName?" element={<Products />} />

    {/* ✅ Profile route protected via PrivateRoute */}
    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

    {/* ✅ Default route to home if no match */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;
