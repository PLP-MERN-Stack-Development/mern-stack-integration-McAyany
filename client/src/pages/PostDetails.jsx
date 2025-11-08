import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PostDetails() {
  const { id } = useParams(); // Post ID from route
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState('Anonymous');

  // 🔹 Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error('Error loading post:', err);
      }
    };
    fetchPost();
  }, [id]);

  // 🔹 Fetch comments for this post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comments/${id}`);
        setComments(res.data);
      } catch (err) {
        console.error('Error loading comments:', err);
      }
    };
    fetchComments();
  }, [id]);

  // 🔹 Handle posting a new comment
  const handleSubmit = async () => {
    if (!text.trim()) return;
    try {
      await axios.post('/api/comments', { postId: id, text, user });
      setText('');
      const updated = await axios.get(`/api/comments/${id}`);
      setComments(updated.data);
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-details" style={{ padding: '1rem' }}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <Link to={`/edit/${post._id}`} style={{ color: 'blue' }}>Edit</Link>

      {/* 💬 Comments Section */}
      <div className="comments" style={{ marginTop: '2rem' }}>
        <h3>Comments</h3>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="comment" style={{ marginBottom: '0.5rem' }}>
              <b>{c.user}</b>: {c.text}
            </div>
          ))
        )}

        <div className="add-comment" style={{ marginTop: '1rem' }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            style={{ padding: '0.5rem', width: '70%' }}
          />
          <button
            onClick={handleSubmit}
            style={{
              marginLeft: '0.5rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
