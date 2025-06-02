import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send OTP');
        return;
      }

      // Store token and email in localStorage for next steps
      localStorage.setItem('resetToken', data.token);
      localStorage.setItem('resetEmail', email);

      // Navigate to verify OTP page
      navigate('/verify-otp');
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSendOtp}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
