import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Monuments.css";

function Monuments() {
  const [monumentList, setMonumentList] = useState([]); // Default is empty array
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/monuments")
      .then((response) => {
        // If server returns 500, 404, etc., don't try to parse it as JSON
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // CRITICAL FIX: Ensure 'data' is actually an array before saving
        if (Array.isArray(data)) {
          setMonumentList(data);
        } else {
          console.error("Received data is not an array:", data);
          setMonumentList([]); // Fallback to empty array
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching monuments:", error);
        setMonumentList([]); // Prevents .map is not a function error
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-container">Loading India's Heritage...</div>;
  }

  return (
    <div className="monuments-page">
      <div className="top-nav-bar">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>

      <header className="page-header">
        <h1>Monuments & Culture</h1>
        <p>Explore the timeless beauty of the subcontinent</p>
      </header>

      <div className="monument-grid">
        {/* Use optional chaining ?. as a final safety layer */}
        {monumentList?.map((item) => (
          <div
            key={item.id}
            className="monument-card"
            onClick={() => navigate(`/monuments/${item.id}`)}
          >
            <div className="image-container">
               {/* Fixed to use imageUrl to match your Java Model exactly */}
               <img src={item.imageUrl || item.image} alt={item.name} />
            </div>
            <div className="card-content">
                <h3>{item.name}</h3>
                <p>📍 {item.location}</p>
                <button className="details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>


{monumentList.length === 0 && !loading && (
  <div className="no-data-box" style={{ marginTop: '50px', textAlign: 'center' }}>
    <p className="no-data">No monuments found in the database.</p>
    {/* Removed the extra button here since you have one at the top */}
  </div>
)}
    </div>
  );
}

export default Monuments;