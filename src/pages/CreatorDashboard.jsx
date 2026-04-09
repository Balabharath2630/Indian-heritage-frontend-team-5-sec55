import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatorDashboard.css";

function CreatorDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role.toUpperCase() !== "CREATOR") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="creator-container">
      {/* Sidebar Section */}
      <aside className="creator-sidebar">
        <div className="sidebar-header">
          <h3>Creator Hub</h3>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item active">📊 Dashboard</div>
          <div className="nav-item" onClick={() => navigate("/monuments")}>🏛️ My Monuments</div>
          <div className="nav-item">🖼️ Gallery</div>
          <div className="nav-item" onClick={() => navigate("/forum")}>💬 Community</div>
        </nav>
      </aside>

      {/* Main Content Section */}
      <main className="creator-content">
        <header className="content-header">
          <h1>Namaste, <span className="user-highlight">{user?.name}</span></h1>
          <p>Welcome to your personal Studio. Let's document India's heritage.</p>
        </header>

        {/* Stats Bar */}
        <section className="stats-bar">
          <div className="stat-card">
            <h4>Total Uploads</h4>
            <p>12</p>
          </div>
          <div className="stat-card">
            <h4>Profile Views</h4>
            <p>1.2k</p>
          </div>
          <div className="stat-card">
            <h4>Badges</h4>
            <p>Gold Creator</p>
          </div>
        </section>

        {/* Action Grid */}
        <section className="action-grid">
          <div className="action-card primary" onClick={() => navigate("/add-monument")}>
            <div className="card-icon">➕</div>
            <div className="card-text">
              <h3>Add New Monument</h3>
              <p>Upload new Indian heritage sites and details here.</p>
            </div>
          </div>

          <div className="action-card secondary" onClick={() => navigate("/monuments")}>
            <div className="card-icon">📂</div>
            <div className="card-text">
              <h3>Manage My Gallery</h3>
              <p>View, edit, or remove the sites you have contributed.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CreatorDashboard;