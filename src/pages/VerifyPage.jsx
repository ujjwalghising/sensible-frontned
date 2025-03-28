import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/axios';

const VerifyPage = () => {
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/api/auth/verify?token=${token}`);
        setMessage(response.data.message || 'Email verified successfully');

        // Redirect to login after successful verification
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        console.error('Verification error:', error);
        setMessage('Invalid or expired token');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold">Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyPage;