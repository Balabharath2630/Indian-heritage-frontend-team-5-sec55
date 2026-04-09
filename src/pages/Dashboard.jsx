import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("enthusiast");

  return (
    <div className="dashboard-page">

      {/* Back Button Added Here */}
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, Priya!</h1>
          <p>🌿 Exploring Indian Heritage</p>
        </div>

        <div className="header-icons">
          <span>🔔</span>
          <span>⚙️</span>
        </div>
      </div>

      {/* ROLE SWITCH */}
      <div className="role-tabs">
        <span
          className={activeRole === "enthusiast" ? "active" : ""}
          onClick={() => setActiveRole("enthusiast")}
        >
          🟡 Cultural Enthusiast
        </span>

        <span
          className={activeRole === "creator" ? "active" : ""}
          onClick={() => setActiveRole("creator")}
        >
          🎥 Content Creator
        </span>

        <span
          className={activeRole === "guide" ? "active" : ""}
          onClick={() => setActiveRole("guide")}
        >
          🧭 Tour Guide
        </span>

        <span
          className={activeRole === "admin" ? "active" : ""}
          onClick={() => setActiveRole("admin")}
        >
          🛡 Admin
        </span>
      </div>

      {/* ================= CULTURAL ENTHUSIAST ================= */}
      {activeRole === "enthusiast" && (
        <div className="dashboard-grid">

          {/* LEFT */}
          <div>
            <div className="saved-header">
              <h2>🔖 Saved Monuments</h2>
              <span>View All</span>
            </div>

            <div className="saved-grid">
              <div className="saved-card">
                <img
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80"
                  alt="Taj Mahal"
                />
                <h3>Taj Mahal</h3>
                <p>📍 Agra, Uttar Pradesh</p>
                <button onClick={() => navigate("/monuments/1")}>
                  View Details
                </button>
              </div>

              <div className="saved-card">
                <img
                  src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80"
                  alt="Varanasi"
                />
                <h3>Varanasi (Kashi)</h3>
                <p>📍 Uttar Pradesh</p>
                <button>View Details</button>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div className="activity-card">
              <h3>🕒 Recent Activity</h3>
              <p>💬 Replied to "Hampi Ruins"</p>
              <span>2 hours ago</span>

              <p>🏛 Completed Taj Mahal Tour</p>
              <span>Yesterday</span>
            </div>

            <div className="progress-card">
              <h3>📈 Learning Progress</h3>
              <p>Monument Master Level 4</p>

              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>

              <p className="xp-text">
                350 XP to next level. Visit 2 more sites to earn a badge!
              </p>

              <button>View My Badges</button>
            </div>
          </div>

        </div>
      )}

      {/* ================= CONTENT CREATOR ================= */}
      {activeRole === "creator" && (
        <div className="creator-section">

          <div className="creator-header">
            <h2>Your Contributions</h2>
            <button className="add-btn">➕ Add New Article/Media</button>
          </div>

          <table className="creator-table">
            <thead>
              <tr>
                <th>Content Title</th>
                <th>Type</th>
                <th>Date Published</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>The Story of the Peacock Throne</td>
                <td><span className="badge">Article</span></td>
                <td>Oct 12, 2023</td>
                <td><span className="approved">Approved</span></td>
                <td>✏️ 🗑</td>
              </tr>

              <tr>
                <td>360° Tour of Hampi's Chariot</td>
                <td><span className="badge">Virtual Tour</span></td>
                <td>Oct 24, 2023</td>
                <td><span className="pending">Pending Review</span></td>
                <td>✏️ 🗑</td>
              </tr>
            </tbody>
          </table>

        </div>
      )}

      {/* ================= TOUR GUIDE ================= */}
      {activeRole === "guide" && (
        <div className="guide-layout">

          {/* LEFT */}
          <div className="guide-left">

            <div className="live-panel">
              <h2>🎬 Live Experience Panel</h2>
              <p>Manage your ongoing or upcoming scheduled virtual tours.</p>

              <div className="session-card">
                <span className="next-label">NEXT SESSION</span>
                <h3>The Taj Mahal Sunset Special</h3>
                <p>🕓 4:00 PM (Today) · 240 Registered Guests</p>

                <div className="session-buttons">
                  <button className="primary">🎥 Start Studio</button>
                  <button className="secondary">Manage Guests</button>
                </div>
              </div>
            </div>

            <div className="feedback-card">
              <h3>⭐ Audience Feedback</h3>

              <div className="feedback-item">
                <strong>Rahul Singh</strong>
                <p>"Amazing session! Very interactive."</p>
                <span>⭐⭐⭐⭐⭐</span>
              </div>

              <div className="feedback-item">
                <strong>Anita Desai</strong>
                <p>"The 360° transitions were smooth."</p>
                <span>⭐⭐⭐⭐☆</span>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="chat-panel">
            <h3>💬 Q&A & Chat Center</h3>

            <div className="chat-box">
              <div className="chat-user">
                <strong>Priya</strong>
                <p>What's the best time for photography?</p>
              </div>

              <div className="chat-guide">
                <strong>You</strong>
                <p>Early morning before sunrise is magical.</p>
              </div>
            </div>

            <textarea placeholder="Type your response..." />
            <button className="send-btn">Send Message</button>
          </div>

        </div>
      )}

{activeRole === "admin" && (
  <div className="admin-section">

    {/* STATS CARDS */}
    <div className="admin-stats">

      <div className="stat-card users">
        <h4>ACTIVE USERS</h4>
        <h2>492</h2>
      </div>

      <div className="stat-card pending">
        <h4>PENDING APPROVAL</h4>
        <h2>14</h2>
      </div>

      <div className="stat-card reports">
        <h4>OPEN REPORTS</h4>
        <h2 className="danger">2</h2>
      </div>

      <div className="stat-card health">
        <h4>PLATFORM HEALTH</h4>
        <h2 className="success">Optimal</h2>
      </div>

    </div>

    {/* ADMIN OPERATIONS */}
    <div className="admin-operations">

      <div>
        <h2>Admin Operations</h2>
        <p>Full management of users, roles, and content.</p>

        <div className="quick-links">
          <button>User Audit Logs</button>
          <button>Global Announcements</button>
          <button>Security Settings</button>
          <button>Media Storage</button>
        </div>
      </div>

      <button className="launch-btn">
        Launch Admin Portal
      </button>

    </div>

  </div>
)}

    </div>
  );
}

export default Dashboard;