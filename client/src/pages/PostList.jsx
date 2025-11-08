import React, { useState, useEffect } from "react";

const PostsList = () => {
  const [posts, setPosts] = useState([]);       // always starts as []
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch paginated posts
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts?page=${page}&limit=5`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(Array.isArray(data.posts) ? data.posts : []);  // ✅ ensure it's an array
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  // 🔍 Search posts
  const handleSearch = async () => {
    if (!query.trim()) {
      fetchPosts(); // if empty, show all
      return;
    }
    try {
      const res = await fetch(`/api/posts/search?q=${query}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []); // ✅ handle both cases
    } catch (err) {
      console.error("Error searching posts:", err);
      setError(err.message);
    }
  };

  // 🩵 UI
  return (
    <div>
      <h2>All Posts</h2>

      {/* 🔍 Search Bar */}
      <div className="search-bar" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "0.5rem", width: "60%" }}
        />
        <button onClick={handleSearch} style={{ marginLeft: "0.5rem" }}>
          Search
        </button>
      </div>

      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* 📰 Posts List */}
      {posts.length === 0 && !loading && <p>No posts found.</p>}
      {posts.map((post) => (
        <div key={post._id} className="post-card" style={{ marginBottom: "1rem" }}>
          <h3>{post.title}</h3>
          <p>{post.content?.slice(0, 100)}...</p>
        </div>
      ))}

      {/* ⏩ Pagination */}
      <div className="pagination" style={{ marginTop: "1rem" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PostsList;
