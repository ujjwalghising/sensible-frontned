import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import SearchResults from "./pages/SearchResults";
import PrivateRoute from "./components/PrivateRoute";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/products/category/:categoryName?" element={<Products />} />
  </Routes>
);

export default AppRoutes;
