import { useState, useEffect } from "react";
import "./ManageMonuments.css";

function ManageMonuments() {
  const [monuments, setMonuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load monuments from Spring Boot on startup
  useEffect(() => {
    fetchMonuments();
  }, []);

  const fetchMonuments = async () => {
    try {
      const response = await fetch("https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/monuments");
      const data = await response.json();
      setMonuments(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching monuments:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`⚠️ Are you sure you want to delete "${name}"? This will remove it from the Cloud (S3) and Database forever!`)) {
      try {
        const response = await fetch(`https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/monuments/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("✨ Deleted successfully!");
          // Remove the deleted monument from the UI list
          setMonuments(monuments.filter((m) => m.id !== id));
        } else {
          alert("Failed to delete monument.");
        }
      } catch (err) {
        alert("Server error. Check if Spring Boot is running!");
      }
    }
  };

  if (loading) return <div className="loading">Loading Monuments...</div>;

  return (
    <div className="manage-container">
      <div className="manage-header">
        <h2>🏛️ Manage Heritage Sites</h2>
        <p>Admin Power: Remove monuments from the platform and AWS Cloud.</p>
      </div>

      <table className="monument-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Location</th>
            <th>Region</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {monuments.length > 0 ? (
            monuments.map((m) => (
              <tr key={m.id}>
                <td>
                  <img src={m.imageUrl} alt={m.name} className="table-thumb" />
                </td>
                <td><strong>{m.name}</strong></td>
                <td>{m.location}</td>
                <td><span className="region-badge">{m.region}</span></td>
                <td>
                  <button 
                    className="delete-action-btn" 
                    onClick={() => handleDelete(m.id, m.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No monuments found. Go to "Add Monument" to create one!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageMonuments;