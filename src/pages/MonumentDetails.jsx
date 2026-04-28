import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MonumentDetails.css";

function MonumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [monument, setMonument] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ State for the Virtual Tour Modal
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    // Fetching the specific monument by ID from your Java Backend
    fetch(`https://indian-heritage-backend-production.up.railway.app/api/monuments/${id}`)
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

  // ✅ Uses the dynamic link from DB
  const tourUrl = monument.tourUrl;

  return (
    <div className="details-container">
      <button className="back-link" onClick={() => navigate(-1)}>← Back to Explorer</button>
      
      <div className="details-hero">
        <img src={monument.imageUrl} alt={monument.name} />
      </div>

      <div className="details-info">
        <span className="region-tag">{monument.region} India</span>
        <h1>{monument.name}</h1>
        <h3 className="location-text">📍 {monument.location}</h3>
        
        <hr />
        
        <div className="description-section">
          <h2>Historical Significance</h2>
          <p>{monument.description}</p>
        </div>

        {/* ✅ Only show button if a tour URL exists */}
        {tourUrl && (
          <button className="book-btn" onClick={() => setIsTourOpen(true)}>
            Take a Virtual Tour
          </button>
        )}
      </div>

      {/* ✅ CINEMATIC VIRTUAL TOUR MODAL */}
      {isTourOpen && (
        <div className="tour-modal-overlay">
          <div className="tour-modal-content">
            <div className="tour-modal-header">
              <h3>360° Virtual Exploration: {monument.name}</h3>
              <button className="close-tour-btn" onClick={() => setIsTourOpen(false)}>×</button>
            </div>
            
            <div className="tour-iframe-container">
              <iframe
                title="Virtual Tour"
                src={tourUrl}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            
            <div className="tour-footer">
              <p>Tip: Click and drag to look around. Use arrows to move through the grounds.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonumentDetails;