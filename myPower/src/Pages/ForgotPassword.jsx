// src/Pages/ForgotPassword.jsx
import React, { useState } from "react";
import "../Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Reset Password
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    } else if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setSuccess("OTP sent successfully. Please check your email.");
        setStep(2);
      } else {
        setError(data.error || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setError("Failed to connect to the server. Please try again.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("OTP verified successfully.");
        setStep(3);
      } else {
        setError(data.error || "Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      setError("Failed to connect to the server. Please try again.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    } else if (!isValidPassword(newPassword)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Password updated successfully. You can now log in.");
        setTimeout(() => {
          window.location.href = "/"; // Redirect to login page
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setError("Failed to connect to the server. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-right">
        <form className="login-form" onSubmit={
          step === 1 ? handleSendOTP :
          step === 2 ? handleVerifyOTP :
          handleResetPassword
        }>
          <h2>
            {step === 1 ? "FORGOT PASSWORD" :
             step === 2 ? "VERIFY OTP" :
             "RESET PASSWORD"}
          </h2>
          {error && (
            <div
              className="login-error-message"
              style={{ marginBottom: "1rem", textAlign: "center" }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                marginBottom: "1rem",
                textAlign: "center",
                color: "green",
              }}
            >
              {success}
            </div>
          )}

          {step === 1 && (
            <div className={`form-group ${error ? "error" : ""}`}>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={email ? "filled" : ""}
                  placeholder="Email"
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={`form-group ${error ? "error" : ""}`}>
              <div className="input-wrapper">
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={otp ? "filled" : ""}
                  placeholder="Enter OTP"
                />
                <label htmlFor="otp">Enter OTP</label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={`form-group ${error ? "error" : ""}`}>
              <div className="input-wrapper">
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={newPassword ? "filled" : ""}
                  placeholder="New Password"
                />
                <label htmlFor="newPassword">New Password</label>
              </div>
            </div>
          )}

          <button type="submit" className="login-button">
            {step === 1 ? "Send OTP" :
             step === 2 ? "Verify OTP" :
             "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;