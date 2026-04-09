import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ This listens for page changes

  // ✅ This runs every time you change pages (Home -> Dashboard etc.)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, [location]); // ✅ Re-checks login status whenever the URL changes

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role"); // Clean up everything
    setUser(null);
    navigate("/");
  };

  const handleDashboardClick = () => {
    if (!user) return;
    const role = user.role?.toUpperCase();
    
    // Exact same logic as your Redirect component
    if (role === "ADMIN") navigate("/admin-dashboard");
    else if (role === "CREATOR" || role === "CONTENT_CREATOR") navigate("/creator-dashboard");
    else if (role === "GUIDE") navigate("/guide-dashboard");
    else navigate("/user-dashboard");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")}>
        Incredible India
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/monuments">Monuments</Link>
        <Link to="/forum">Forum</Link>

        {/* ✅ Dashboard link now appears correctly if user exists */}
        {user && (
          <span className="nav-link-item dashboard-link" onClick={handleDashboardClick}>
            Dashboard
          </span>
        )}

        {user ? (
          <div className="nav-auth-section">
            <button onClick={handleLogout} className="navbar-logout-btn">
              Logout ({user.name.split(" ")[0].toLowerCase()})
            </button>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} className="navbar-login-btn">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;