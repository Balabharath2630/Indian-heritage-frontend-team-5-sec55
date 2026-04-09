import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../pages/RegionPage.css";

function RegionPage() {
  const { regionId } = useParams();
  const navigate = useNavigate();
  
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Step 1: Format for Display (e.g., "North")
  const formattedRegion = regionId ? 
    regionId.charAt(0).toUpperCase() + regionId.slice(1).toLowerCase() : "";

  useEffect(() => {
    // Scroll to top when the region changes
    window.scrollTo(0, 0);

    const fetchRegionData = async () => {
      setLoading(true);
      try {
        // ✅ Step 2: Try fetching with the Formatted Name first
        let response = await fetch(`http://localhost:8080/api/monuments/region/${formattedRegion}`);
        let data = await response.json();

        // ✅ Step 3: Fallback logic
        // If "North" returns nothing, try fetching with lowercase "north"
        if (data.length === 0) {
          const lowerResponse = await fetch(`http://localhost:8080/api/monuments/region/${regionId.toLowerCase()}`);
          data = await lowerResponse.json();
        }

        setPlaces(data);
      } catch (error) {
        console.error("Error fetching region monuments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (regionId) {
      fetchRegionData();
    }
  }, [regionId, formattedRegion]);

  if (!regionId) return null;

  return (
    <div className="monuments-page">
      <button className="back-btn" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Back
      </button>

      <h1 className="monuments-title">
        Monuments & Culture — {formattedRegion} India
      </h1>

      {loading ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem" }}>Exploring the region...</p>
      ) : (
        <div className="monument-grid">
          {places.length > 0 ? (
            places.map((place) => (
              <div key={place.id} className="monument-card">
                <img src={place.imageUrl} alt={place.name} />

                <div className="monument-info">
                  <h3>{place.name}</h3>
                  <p>{place.location}</p>

                  <button
                    onClick={() => navigate(`/monuments/${place.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data" style={{ textAlign: 'center', marginTop: '50px' }}>
              <p>No monuments found for <strong>{formattedRegion}</strong> India.</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Tip: Check if the region name in your Database matches exactly.
              </p>
              <button className="primary-btn" onClick={() => navigate("/monuments")}>
                Browse All Monuments
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RegionPage;