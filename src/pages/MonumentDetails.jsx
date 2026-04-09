import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MonumentDetails.css";

function MonumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [monument, setMonument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching the specific monument by ID from your Java Backend
    fetch(`http://localhost:8080/api/monuments/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMonument(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="loader">Loading History...</div>;
  if (!monument) return <div className="error">Monument not found.</div>;

  return (
    <div className="details-container">
      <button className="back-link" onClick={() => navigate(-1)}>← Back to Explorer</button>
      
      {/* IMAGE FIRST - BIG AND BOLD */}
      <div className="details-hero">
        <img src={monument.imageUrl} alt={monument.name} />
      </div>

      {/* INFO SECOND - NAME, LOCATION, DESCRIPTION */}
      <div className="details-info">
        <span className="region-tag">{monument.region} India</span>
        <h1>{monument.name}</h1>
        <h3 className="location-text">📍 {monument.location}</h3>
        
        <hr />
        
        <div className="description-section">
          <h2>Historical Significance</h2>
          <p>{monument.description}</p>
        </div>

        <button className="book-btn" onClick={() => alert("Virtual Tour Coming Soon!")}>
          Take a Virtual Tour
        </button>
      </div>
    </div>
  );
}

export default MonumentDetails;