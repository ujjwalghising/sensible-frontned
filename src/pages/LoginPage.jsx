import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const LoginPage = () => {
  const [formData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();


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
  
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      
  <h2 className="flex justify-self-center text-4xl font-bold">Login</h2>

  <form onSubmit="{handleSubmit}">
    
    <input type="email" name="email" placeholder="your@email.com" required className="emailcard" />
    <input type="password" name="password" placeholder="Password" required className="mb-3 w-full rounded border p-2" />

    <button type="submit" className="w-full rounded bg-sky-500 p-2 text-white hover:bg-green-500">Login</button>
  </form>
<div className="flex items-center justify-center bg-white">
  <p className="text-center font-semibold">
    Don't have an account?
    <a className="text-xl text-blue-500" href="/register">Sign Up</a>
  </p>
</div>
</div>
  );
};

export default LoginPage;