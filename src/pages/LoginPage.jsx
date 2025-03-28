import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/api/auth/login', formData);

      // Handle unverified account
      if (response.status === 403) {
        setError('Please verify your email before logging in.');
        return;
      }

      login(response.data.token);
      navigate('/profile');

    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email" name="email" placeholder="Email"
          value={formData.email} onChange={handleChange}
          required className="w-full p-2 mb-3 border rounded"
        />
        
        <input
          type="password" name="password" placeholder="Password"
          value={formData.password} onChange={handleChange}
          required className="w-full p-2 mb-3 border rounded"
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
      <div>
        <p>Don't have an account? <a href="/register">Sign Up</a></p> 
      </div>
    </div>
  );
};

export default LoginPage;