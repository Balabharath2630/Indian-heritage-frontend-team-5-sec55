import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Forum.css";

function Forum() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // States for Tagging
  const [monuments, setMonuments] = useState([]);
  const [selectedMonumentId, setSelectedMonumentId] = useState("");
  const [showTagPicker, setShowTagPicker] = useState(false);

  // State for active comment input
  const [commentText, setCommentText] = useState({});

  // ✅ Get user session from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // 🛡️ ACCESS GUARD: Only allow logged-in users
    if (!currentUser) {
      alert("Please login to access the Community Hub!");
      navigate("/login"); // Adjust to your actual login route
      return;
    }

    fetchPosts();
    fetchMonuments();
  }, [currentUser, navigate]);

  // If no user is present, don't render the forum content
  if (!currentUser) return null;

  const fetchPosts = async () => {
    try {
      const response = await fetch("https://your-app-name.up.railway.app/api/posts");
      const data = await response.json();
      setPosts(data.sort((a, b) => b.id - a.id));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const fetchMonuments = async () => {
    try {
      const response = await fetch("https://your-app-name.up.railway.app/api/monuments");
      const data = await response.json();
      setMonuments(data);
    } catch (error) {
      console.error("Error fetching monuments:", error);
    }
  };

  const handlePostSubmit = async () => {
    if (!content.trim()) return alert("Please write something first!");
    
    const newPost = {
      content: content,
      user: { id: currentUser.id },
      taggedMonument: selectedMonumentId ? { id: selectedMonumentId } : null
    };

    try {
      const response = await fetch("https://your-app-name.up.railway.app/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        setContent(""); 
        setSelectedMonumentId("");
        setShowTagPicker(false);
        fetchPosts(); 
      }
    } catch (error) {
      alert("Failed to post.");
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await fetch(`https://your-app-name.up.railway.app/api/posts/${postId}/like`, { method: "PUT" });
      fetchPosts(); 
    } catch (error) {
      console.error("Like failed");
    }
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;

    const newComment = {
      text: text,
      user: { id: currentUser.id },
      post: { id: postId }
    };

    try {
      const response = await fetch("https://your-app-name.up.railway.app/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });

      if (response.ok) {
        setCommentText({ ...commentText, [postId]: "" });
        fetchPosts();
      }
    } catch (error) {
      alert("Comment failed.");
    }
  };

  return (
    <div className="forum-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="forum-header">
        <h1>Community Hub</h1>
        <p>Share your travels, ask questions about history, or simply connect with fellow culture lovers.</p>
      </div>

      <div className="conversation-box">
        <h3>Start a Conversation</h3>
        <textarea
          placeholder="What's your latest discovery?..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {showTagPicker && (
          <div className="tag-selector-inline">
            <select 
              value={selectedMonumentId} 
              onChange={(e) => setSelectedMonumentId(e.target.value)}
              className="monument-dropdown"
            >
              <option value="">-- Choose a Monument to Tag --</option>
              {monuments.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="conversation-actions">
          <div>
            <button className="light-btn">📷 Add Photo</button>
            <button 
              className={`light-btn ${selectedMonumentId ? "active-tag" : ""}`} 
              onClick={() => setShowTagPicker(!showTagPicker)}
            >
              🏛 {selectedMonumentId ? "Change Tag" : "Tag Monument"}
            </button>
          </div>
          <button className="primary-btn" onClick={handlePostSubmit}>Post Thread</button>
        </div>
      </div>

      <div className="discussion-header">
        <h3>Recent Discussions</h3>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading discussions...</p>}

      {posts.map((post) => (
        <div className="discussion-card" key={post.id}>
          <div className="user-info">
            <img src={`https://ui-avatars.com/api/?name=${post.user.name}&background=random`} alt="user" />
            <div>
              <h4>
                {post.user.name}{" "}
                <span className={`badge ${post.user.role.toLowerCase()}`}>
                  {post.user.role}
                </span>
              </h4>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <p className="discussion-text">{post.content}</p>

          {post.taggedMonument && (
            <div className="tagged-monument-badge">
              📍 <strong>Tagged:</strong> {post.taggedMonument.name}
            </div>
          )}

          <div className="discussion-actions">
            <span onClick={() => handleLikePost(post.id)} style={{ cursor: 'pointer' }}>
              👍 {post.likes}
            </span>
            <span>💬 {post.comments ? post.comments.length : 0}</span>
          </div>

          <div className="comment-list">
            {post.comments && post.comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-user">
                  <strong>{comment.user.name}</strong> 
                  <span className="comment-badge">{comment.user.role}</span>
                </div>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>

          <div className="comment-input">
            <input 
              type="text" 
              placeholder="Write a comment..." 
              value={commentText[post.id] || ""}
              onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})}
              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Forum;