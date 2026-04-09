import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function GuideDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("user");
      if (savedData) {
        setUser(JSON.parse(savedData));
      } else {
        console.log("No user found in localStorage, redirecting...");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // If user state is still null, show this simple text
  if (!user) {
    return <h1 style={{ padding: "50px", textAlign: "center" }}>Loading Dashboard...</h1>;
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        <h1 style={{ color: "#2c3e50" }}>Guide Control Panel</h1>
        <button 
          onClick={handleLogout} 
          style={{ background: "#e74c3c", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2 style={{ color: "#34495e" }}>Namaste, {user.name}!</h2>
        <p style={{ fontSize: "18px", color: "#7f8c8d" }}>Role: <strong style={{ color: "#27ae60" }}>{user.role}</strong></p>
        
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", flex: 1 }}>
            <h3>Assigned Tours</h3>
            <p>0 Active Tours</p>
          </div>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", flex: 1 }}>
            <h3>Profile Status</h3>
            <p>Verified Guide ✅</p>
          </div>
        </div>

        <button 
          onClick={() => navigate("/monuments")}
          style={{ marginTop: "30px", padding: "12px 25px", background: "#3498db", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Explore Monuments
        </button>
      </div>
    </div>
  );
}

export default GuideDashboard;