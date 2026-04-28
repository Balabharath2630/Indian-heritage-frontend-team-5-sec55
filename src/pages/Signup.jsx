import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [strength, setStrength] = useState(""); 
  
  // ✅ New States for OTP
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const navigate = useNavigate();

  // Email Validation Logic
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password Strength Logic
  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value.length === 0) setStrength("");
    else if (value.length < 6) setStrength("Weak");
    else if (value.match(/[A-Z]/) && value.match(/[0-9]/) && value.match(/[^A-Za-z0-9]/)) {
      setStrength("Strong");
    } else {
      setStrength("Medium");
    }
  };

  // ✅ Step 1: Send OTP to Email
  const sendOtp = async () => {
    if (!isValidEmail(email)) {
      alert("Please enter a valid email first.");
      return;
    }
    setLoadingOtp(true);
    try {
      const response = await fetch("https://indian-heritage-backend-production.up.railway.app/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setIsOtpSent(true);
        alert("OTP sent to your email!");
      } else {
        alert("Failed to send OTP. Try again.");
      }
    } catch (error) {
      alert("Error connecting to server.");
    } finally {
      setLoadingOtp(false);
    }
  };

  // ✅ Step 2: Verify the OTP
  const verifyOtp = async () => {
    try {
      const response = await fetch("https://indian-heritage-backend-production.up.railway.app/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setIsVerified(true);
        alert("Email Verified Successfully!");
      } else {
        alert("Invalid OTP code.");
      }
    } catch (error) {
      alert("Verification error.");
    }
  };

  const mapRoleToEnum = (selectedRole) => {
    switch (selectedRole) {
      case "Content Creator": return "CREATOR";
      case "Tour Guide": return "GUIDE";
      case "Admin": return "ADMIN";
      case "Cultural Enthusiast": return "USER";
      default: return "USER";
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert("Please verify your email with OTP first!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (strength === "Weak") {
      alert("Password is too weak. Please use numbers and special characters.");
      return;
    }

    const userData = {
      name,
      email,
      password,
      role: mapRoleToEnum(role),
      adminKey
    };

    try {
      const response = await fetch("https://indian-heritage-backend-production.up.railway.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert(`Account created successfully!`);
        navigate("/login");
      } else {
        const errorData = await response.text();
        alert("Signup failed: " + errorData);
      }
    } catch (error) {
      alert("Server error.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join Incredible India Explorer today.</p>

        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isVerified}
                style={{ flex: 1, borderColor: email && !isValidEmail(email) ? "red" : "" }}
              />
              {!isVerified && (
                <button 
                  type="button" 
                  onClick={sendOtp} 
                  disabled={loadingOtp}
                  style={{ padding: "0 15px", borderRadius: "5px", background: "#ff9933", color: "white", border: "none", cursor: "pointer" }}
                >
                  {loadingOtp ? "..." : isOtpSent ? "Resend" : "Get OTP"}
                </button>
              )}
            </div>
            {isVerified && <small style={{ color: "green" }}>✓ Email Verified</small>}
          </div>

          {/* ✅ OTP Input Field - Only shows after clicking Get OTP */}
          {isOtpSent && !isVerified && (
            <div className="input-group" style={{ background: "#f9f9f9", padding: "10px", borderRadius: "8px", border: "1px dashed #ccc" }}>
              <label>Enter 6-Digit OTP</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="text" 
                  placeholder="000000" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  style={{ textAlign: "center", letterSpacing: "5px", fontWeight: "bold" }}
                />
                <button 
                  type="button" 
                  onClick={verifyOtp}
                  style={{ padding: "0 15px", borderRadius: "5px", background: "#1a73e8", color: "white", border: "none", cursor: "pointer" }}
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Select Role</label>
            <select 
              className="role-select"
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled>Choose your role</option>
              <option value="Cultural Enthusiast">Cultural Enthusiast</option>
              <option value="Content Creator">Content Creator</option>
              <option value="Tour Guide">Tour Guide</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {role === "Admin" && (
            <div className="input-group admin-key-section">
              <label style={{ color: "#ff9933", fontWeight: "bold" }}>Admin Secret Passcode</label>
              <input 
                type="password" 
                placeholder="Enter master key" 
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
            />
            {strength && (
              <div className={`strength-indicator ${strength.toLowerCase()}`} style={{
                fontSize: "12px", marginTop: "5px", color: strength === "Strong" ? "green" : strength === "Medium" ? "orange" : "red"
              }}>
                Strength: <strong>{strength}</strong>
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="form-login-btn" 
            disabled={!isVerified}
            style={{ opacity: isVerified ? 1 : 0.6, cursor: isVerified ? "pointer" : "not-allowed" }}
          >
            {isVerified ? "Complete Registration" : "Verify Email to Sign Up"}
          </button>
        </form>

        <p className="signup">
          Already have an account? <span onClick={() => navigate("/login")} style={{cursor: "pointer", color: "blue"}}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;