import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { Button } from '@headlessui/react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await api.post('/api/auth/register', formData);
      console.log('Register Response:', response);

      // Show success message and ask for email verification
      setMessage('Registration successful. Please check your email to verify your account.');
      
      // Redirect to login after a short delay
      setTimeout(() => navigate('/login'), 3000);
      
    } catch (err) {
      console.error('Registration Error:', err);
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="p-5 max-w-lg mx-auto bg-blue shadow-md">
      <h2 className="text-5xl font-bold mb-4">Register</h2>
      
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" name="name" placeholder="Name" value={formData.name} 
          onChange={handleChange} required className="w-full p-2 mb-3 border rounded" 
        />
        
        <input 
          type="email" name="email" placeholder="Email" value={formData.email} 
          onChange={handleChange} required className="w-full p-2 mb-3 border rounded" 
        />

        <input 
          type="password" name="password" placeholder="Password" value={formData.password} 
          onChange={handleChange} required className="w-full p-2 mb-3 border rounded" 
        />

        <Button type="submit" className="inline-flex items-center gap-2 rounded-md bg-blue-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-green-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
          Register
        </Button>
      </form>
      <div>
        <p>Already have an account? <a href="/login">Log In</a></p> 
      </div>
    </div>
  );
};

export default RegisterPage;