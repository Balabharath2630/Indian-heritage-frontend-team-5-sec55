import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;

  return (
    <div style={{ padding: "30px", backgroundColor: "#f0f7ff", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #d0e2f5", paddingBottom: "15px" }}>
        <h1 style={{ color: "#2980b9", margin: 0 }}>Traveler Home</h1>
        <button 
          onClick={handleLogout} 
          style={{ padding: "10px 20px", backgroundColor: "#34495e", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Welcome to India, {user.name}! 🇮🇳</h2>
        <p style={{ color: "#666" }}>Explore the heritage, culture, and beauty of the subcontinent.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginTop: "30px" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <h3>My Heritage List</h3>
            <p>0 Monuments saved</p>
            <button 
              onClick={() => navigate("/monuments")}
              style={{ background: "#2980b9", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}
            >
              Explore Now
            </button>
          </div>

          <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <h3>Community Forum</h3>
            <p>Connect with other travelers</p>
            <button 
              onClick={() => navigate("/forum")}
              style={{ background: "#27ae60", color: "white", border: "none", padding: "8px 15px", borderRadius: "4px", cursor: "pointer" }}
            >
              Go to Forum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard; // This line is what fixes the "default export" error!