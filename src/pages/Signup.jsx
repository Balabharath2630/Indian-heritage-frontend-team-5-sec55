import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminKey, setAdminKey] = useState(""); // ✅ Added state for Secret Key
  const navigate = useNavigate();

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

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!role) {
      alert("Please select a role.");
      return;
    }

    const userData = {
      name: name,
      email: email,
      password: password,
      role: mapRoleToEnum(role),
      adminKey: adminKey // ✅ Sending the key to the backend
    };

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert(`Account created successfully for ${email}!`);
        navigate("/login");
      } else {
        const errorData = await response.text();
        alert("Signup failed: " + errorData);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Server is not responding. Is Spring Boot running?");
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
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

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

          {/* ✅ CONDITIONAL ADMIN KEY INPUT: Only shows when Admin is selected */}
          {role === "Admin" && (
            <div className="input-group admin-key-section">
              <label style={{ color: "#ff9933", fontWeight: "bold" }}>Admin Secret Passcode</label>
              <input 
                type="password" 
                placeholder="Enter master key to prove you're an Admin" 
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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

          <button type="submit" className="form-login-btn">
            Sign up
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