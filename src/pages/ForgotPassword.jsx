import { useState } from "react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const BASE_URL = "https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/auth";
  // 👉 For local use: http://localhost:8080/api/auth

  // Step 1: Send OTP
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

  // Step 2: Verify OTP
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

  // Step 3: Reset Password
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
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
}