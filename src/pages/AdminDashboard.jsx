import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const adminData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/auth/users");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // ✅ UPDATED: Connected to Spring Boot DELETE endpoint
  const handleDelete = async (userId) => {
    if (window.confirm("⚠️ Are you sure you want to remove this user? This action cannot be undone.")) {
      try {
        const response = await fetch(`https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/auth/users/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("✨ User removed successfully!");
          // Update the list instantly without refreshing the page
          setUsers(users.filter((u) => u.id !== userId));
        } else {
          alert("Failed to delete user. The server responded with an error.");
        }
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Connection error: Could not reach the server.");
      }
    }
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h3>Admin Tools</h3>
        <ul>
          <li 
            className={location.pathname === "/admin-dashboard" ? "active" : ""} 
            onClick={() => navigate("/admin-dashboard")}
          >
            User Management
          </li>

          <li 
            className={location.pathname === "/manage-monuments" ? "active" : ""}
            onClick={() => navigate("/manage-monuments")}
          >
            Manage Monuments
          </li>

          <li>Pending Approvals</li>
          
          <li onClick={() => navigate("/")}>Go to Home Site</li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <h2>Admin Control Center</h2> 
          <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/login"); }}>
            Logout
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <h4>Total Users</h4>
            <p>{loading ? "..." : users.length}</p>
          </div>
          <div className="stat-card">
            <h4>System Status</h4>
            <p style={{ color: "green" }}>Online</p>
          </div>
        </section>

        <section className="user-table-section">
          <h3>Registered Users</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn">Edit</button>
                    {/* Hide delete button for the currently logged-in admin */}
                    {u.id !== adminData?.id && (
                      <button className="delete-btn" onClick={() => handleDelete(u.id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;