import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/axios';

const VerifyPage = () => {
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const status = searchParams.get('status');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

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

    // Display appropriate messages based on status
    switch (status) {
      case 'success':
        setMessage('Email verified successfully. Redirecting...');
        setTimeout(() => navigate('/login'), 3000);
        break;
      case 'already-verified':
        setMessage('Email already verified. Redirecting...');
        setTimeout(() => navigate('/login'), 3000);
        break;
      case 'failed':
        setMessage('Invalid or expired token.');
        break;
      case 'error':
        setMessage('An error occurred during verification.');
        break;
      default:
        if (token) {
          verifyEmail();
        }
    }
  }, [token, status, navigate]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold">Email Verification</h2>
      <p>{message}</p>
    </div>
  );
};

export default VerifyPage;