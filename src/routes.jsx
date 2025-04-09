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
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import ProductDetails from './pages/ProductDetails';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />  {/* ✅ Fixed path */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/search" element={<SearchResults />} />

      {/* Auth Routes */}
      <Route
  path="/login"
  element={
    loading ? (
      <div>Loading...</div>
    ) : !user ? (
      <LoginPage />
    ) : (
      <Navigate to="/profile" />
    )
  }
/>

<Route
  path="/register"
  element={
    loading ? (
      <div>Loading...</div>
    ) : !user ? (
      <RegisterPage />
    ) : (
      <Navigate to="/profile" />
    )
  }
/>

      <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage/>} />

      {/* Protected Routes */}
      <Route
  path="/profile"
  element={
    loading ? (
      <div>Loading...</div>
    ) : user ? (
      <ProfilePage />
    ) : (
      <Navigate to="/login" />
    )
  }
/>


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
