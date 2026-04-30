import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Forum.css";

function Forum() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const [monuments, setMonuments] = useState([]);
  const [selectedMonumentId, setSelectedMonumentId] = useState("");
  const [showTagPicker, setShowTagPicker] = useState(false);

  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!currentUser) {
      alert("Please login to access the Community Hub!");
      navigate("/login");
      return;
    }

    fetchPosts();
    fetchMonuments();
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const fetchPosts = async () => {
    const res = await fetch("https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/posts");
    const data = await res.json();
    setPosts(data.sort((a, b) => b.id - a.id));
    setLoading(false);
  };

  const fetchMonuments = async () => {
    const res = await fetch("https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/monuments");
    const data = await res.json();
    setMonuments(data);
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    await fetch("https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/comments", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        text,
        user: { id: currentUser.id },
        post: { id: postId }
      })
    });

    setCommentText({...commentText, [postId]: ""});
    fetchPosts();
  };

  // 👍 LIKE COMMENT
  const handleLikeComment = async (commentId) => {
    await fetch(`https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/comments/${commentId}/like?userId=${currentUser.id}`, {
      method: "POST"
    });
    fetchPosts();
  };

  // ✏️ EDIT COMMENT
  const handleEditComment = async (commentId, text) => {
    await fetch(`https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/comments/${commentId}?userId=${currentUser.id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text })
    });
    setEditingCommentId(null);
    fetchPosts();
  };

  // 🗑 DELETE COMMENT
  const handleDeleteComment = async (commentId) => {
    await fetch(`https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/comments/${commentId}?userId=${currentUser.id}`, {
      method: "DELETE"
    });
    fetchPosts();
  };

  // 💬 REPLY
  const handleReply = async (postId, parentId) => {
    const text = replyText[parentId];
    if (!text?.trim()) return;

    await fetch("https://indian-heritage-backend-team-5-sec55-production.up.railway.app/api/comments", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        text,
        user: { id: currentUser.id },
        post: { id: postId },
        parentComment: { id: parentId }
      })
    });

    setReplyText({...replyText, [parentId]: ""});
    fetchPosts();
  };

  return (
    <div className="forum-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="discussion-header">
        <h3>Recent Discussions</h3>
      </div>

      {posts.map(post => (
        <div className="discussion-card" key={post.id}>

          <div className="discussion-actions">
            <span>💬 {post.comments?.length || 0}</span>
          </div>

          <div className="comment-list">
            {post.comments?.filter(c => !c.parentComment).map(comment => (
              <div key={comment.id} className="comment-item">

                <strong>{comment.user.name}</strong>
                <p>{comment.text}</p>

                {/* ACTIONS */}
                <div style={{display:"flex", gap:"10px"}}>
                  <span onClick={() => handleLikeComment(comment.id)}>👍 {comment.likes}</span>

                  {/* EDIT (owner only) */}
                  {comment.user.id === currentUser.id && (
                    <span onClick={() => setEditingCommentId(comment.id)}>✏️ Edit</span>
                  )}

                  {/* DELETE (admin or owner) */}
                  {(currentUser.role === "ADMIN" || comment.user.id === currentUser.id) && (
                    <span onClick={() => handleDeleteComment(comment.id)}>🗑 Delete</span>
                  )}
                </div>

                {/* EDIT INPUT */}
                {editingCommentId === comment.id && (
                  <input
                    defaultValue={comment.text}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditComment(comment.id, e.target.value);
                      }
                    }}
                  />
                )}

                {/* REPLY INPUT */}
                <input
                  placeholder="Reply..."
                  value={replyText[comment.id] || ""}
                  onChange={(e) => setReplyText({...replyText, [comment.id]: e.target.value})}
                  onKeyDown={(e) => e.key === "Enter" && handleReply(post.id, comment.id)}
                />

                {/* REPLIES */}
                {post.comments.filter(r => r.parentComment?.id === comment.id).map(reply => (
                  <div key={reply.id} style={{marginLeft:"20px"}}>
                    <strong>{reply.user.name}</strong>
                    <p>{reply.text}</p>
                  </div>
                ))}

              </div>
            ))}
          </div>

          <input
            placeholder="Write a comment..."
            value={commentText[post.id] || ""}
            onChange={(e) => setCommentText({...commentText, [post.id]: e.target.value})}
            onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit(post.id)}
          />

        </div>
      ))}
    </div>
  );
}

export default Forum;