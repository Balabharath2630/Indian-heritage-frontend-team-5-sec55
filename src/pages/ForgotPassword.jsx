import { useState } from "react";
import "./ForgotPassword.css"; // ✅ ADDED

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const BASE_URL = "https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/auth";

  const sendOtp = async () => {
    try {
      const res = await fetch(`${BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) setStep(2);
    } catch (err) {
      alert("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch(`${BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) setStep(3);
    } catch (err) {
      alert("Error verifying OTP");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        alert("Password updated! Login now.");
        setStep(1);
      }
    } catch (err) {
      alert("Error resetting password");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2>Forgot Password</h2>
        <p>Reset your password using OTP</p>

        {step === 1 && (
          <>
            <input
              className="forgot-input"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="forgot-btn" onClick={sendOtp}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="step-text">Enter OTP sent to your email</p>
            <input
              className="forgot-input"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button className="forgot-btn" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="step-text">Enter new password</p>
            <input
              className="forgot-input"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="forgot-btn" onClick={resetPassword}>
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}