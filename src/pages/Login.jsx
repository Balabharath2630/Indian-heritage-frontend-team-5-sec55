import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Simple Email Check
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      alert("Please enter a valid email format.");
      return;
    }

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const loggedInUser = data.user;

        // ✅ FIXED ROLE MAPPING (ONLY CHANGE)
        const roleMap = {
          "ADMIN": "admin",
          "CONTENT_CREATOR": "creator",
          "TOUR_GUIDE": "guide",
          "CULTURAL_ENTHUSIAST": "user"
        };

        const role = roleMap[loggedInUser.role] || "user";

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("role", role);

        alert(`Welcome back, ${loggedInUser.name}!`);

        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "creator") {
          navigate("/creator-dashboard");
        } else if (role === "guide") {
          navigate("/guide-dashboard");
        } else {
          navigate("/user-dashboard");
        }

      } else {
        alert(data.message || "Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Could not connect to the server. Is your Spring Boot app running?");
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back!</h2>
        <p className="subtitle">
          Enter your credentials to access your account.
        </p>

        <form onSubmit={handleSignIn}>
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
            <div className="password-row">
              <label>Password</label>
              <span 
                className="forgot" 
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>

          <button type="submit" className="form-login-btn">
            Sign in
          </button>
        </form>

        <p className="signup">
          Don't have an account?{" "}
          <span 
            onClick={handleSignUpRedirect} 
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;