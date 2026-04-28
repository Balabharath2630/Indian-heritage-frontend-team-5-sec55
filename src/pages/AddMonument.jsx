import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddMonument.css";

function AddMonument() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    region: "North",
    description: "",
    tourUrl: "" // ✅ Added tourUrl to the initial state
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert("Please select an image first!");
      return;
    }

    setIsUploading(true);

    try {
      // --- STEP 1: Get Presigned URL from Backend ---
      const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;
      const presignedResponse = await fetch(
        `https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/monuments/generate-presigned-url?fileName=${fileName}`
      );
      
      if (!presignedResponse.ok) throw new Error("Could not get S3 permission.");
      const uploadUrl = await presignedResponse.text();

      // --- STEP 2: Upload Directly to S3 ---
      const s3Response = await fetch(uploadUrl, {
        method: "PUT",
        body: imageFile,
        headers: { "Content-Type": imageFile.type }
      });

      if (!s3Response.ok) throw new Error("S3 Upload Failed.");

      // --- STEP 3: Save Monument Details to MySQL ---
      const finalImageUrl = `https://incredible-india-assets.s3.amazonaws.com/${fileName}`;
      
      const monumentData = {
        ...formData, // ✅ This now automatically includes tourUrl
        imageUrl: finalImageUrl
      };

      const dbResponse = await fetch("https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/monuments/save-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(monumentData),
      });

      if (dbResponse.ok) {
        alert("✨ Monument published to Cloud successfully!");
        navigate("/monuments");
      } else {
        alert("Database save failed.");
      }

    } catch (err) {
      console.error("Upload Error:", err);
      alert("Error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="add-monument-container">
      <div className="add-monument-header">
        <h2>✨ Add New Heritage Site</h2>
        <p>Showcase India's glory with high-resolution imagery and virtual tours.</p>
      </div>
  
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Monument Name</label>
          <input 
            type="text" 
            name="name"
            placeholder="e.g. Hawa Mahal" 
            value={formData.name}
            onChange={handleChange} 
            required
          />
        </div>
  
        <div className="form-group">
          <label>Region</label>
          <select name="region" value={formData.region} onChange={handleChange}>
            <option value="North">North India</option>
            <option value="South">South India</option>
            <option value="East">East India</option>
            <option value="West">West India</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Location</label>
          <input 
            type="text" 
            name="location"
            placeholder="e.g. Jaipur, Rajasthan" 
            value={formData.location}
            onChange={handleChange} 
            required
          />
        </div>

        {/* ✅ NEW: Virtual Tour Input Field */}
        <div className="form-group full-width">
          <label>Virtual Tour (Google Maps Embed URL)</label>
          <input 
            type="text" 
            name="tourUrl"
            placeholder="Paste only the https:// link from the Google Maps iframe src..." 
            value={formData.tourUrl}
            onChange={handleChange} 
          />
          <p style={{fontSize: '0.8rem', color: '#666', marginTop: '5px'}}>
            Go to Google Maps → Share → Embed Map → Copy the link in 'src'
          </p>
        </div>
  
        <div className="form-group full-width">
          <label>Historical Description</label>
          <textarea 
            name="description"
            placeholder="Tell the story of this monument..." 
            value={formData.description}
            onChange={handleChange} 
            required
          />
        </div>
  
        <div className="form-group full-width file-upload-section">
          <label>Upload High-Res Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])} 
            required
          />
          {imageFile && <p style={{color: '#138808', marginTop: '5px'}}>✅ {imageFile.name} ready</p>}
        </div>
  
        <button type="submit" className="publish-btn" disabled={isUploading}>
          {isUploading ? "🚀 Uploading to Cloud..." : "🚀 Publish to Cloud"}
        </button>
      </form>
    </div>
  );
}

export default AddMonument;