import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

// ✅ All 4 Region Images Imported from your assets folder
import northImg from "../assets/images/monuments/north.jpg";
import southImg from "../assets/images/monuments/south.jpg";
import westImg from "../assets/images/monuments/western.jpg";
import eastImg from "../assets/images/monuments/eastern.jpg";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="home">
      {/* 🚀 NOTE: The <nav> section remains removed because 
           it is already being rendered globally by App.jsx.
      */}

      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="hero-content">
          <h1>A Land of <span>Infinite Discovery</span></h1>
          <p>
            From ancient architectural marvels to serene nature escapes and vibrant city life.
            Experience India in all its glory.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/monuments")}>
              Explore Destinations
            </button>
            <button className="secondary-btn" onClick={() => navigate("/forum")}>
              Join Community
            </button>
          </div>
        </div>
      </section>

      {/* ================= REGION SECTION ================= */}
      <section className="region-section">
        <h2>Explore by Region</h2>
        <div className="region-grid">
          
          {/* ✅ North Card */}
          <div 
            className="region-card north" 
            style={{ backgroundImage: `url(${northImg})` }}
            onClick={() => navigate("/region/North")}
          >
            <div className="overlay"></div>
            <h3>Northern Wonders</h3>
          </div>

          {/* ✅ South Card */}
          <div 
            className="region-card south" 
            style={{ backgroundImage: `url(${southImg})` }}
            onClick={() => navigate("/region/South")}
          >
            <div className="overlay"></div>
            <h3>Southern Serenity</h3>
          </div>

          {/* ✅ West Card */}
          <div 
            className="region-card west" 
            style={{ backgroundImage: `url(${westImg})` }}
            onClick={() => navigate("/region/West")}
          >
            <div className="overlay"></div>
            <h3>Western Heritage</h3>
          </div>

          {/* ✅ East Card - Updated with local image */}
          <div 
            className="region-card east" 
            style={{ backgroundImage: `url(${eastImg})` }}
            onClick={() => navigate("/region/East")}
          >
            <div className="overlay"></div>
            <h3>Eastern Mystique</h3>
          </div>
          
        </div>
      </section>

      <footer className="footer">
        © 2026 Incredible India Explorer. Celebrating India's rich cultural heritage.
      </footer>
    </div>
  );
}

export default Home;