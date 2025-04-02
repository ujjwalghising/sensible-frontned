import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import SearchResults from "./pages/SearchResults";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import VerifyPage from './pages/VerifyPage';
import ForgotPassword from './pages/ForgotPassword';
import ProductDetails from './pages/ProductDetails';

const AppRoutes = () => {
  const { token } = useAuth() ?? {};  // Prevents destructuring error

  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />  {/* ✅ Fixed path */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/search" element={<SearchResults />} />

      {/* Auth Routes */}
      <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/profile" />} />
      <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/profile" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/login" />} />
      <Route path="/verify" element={<VerifyPage />} />

      {/* Dynamic Category Route */}
      <Route path="/products/category/:categoryName?" element={<Products />} />

      {/* Not Found & Redirect */}
      <Route path="*" element={<Navigate to="/not-found" replace />} />
      <Route path="/not-found" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
