import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';

function PostList() {
  const { data: posts, loading, error, fetchData } = useApi('/api/posts');

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id}>
            <Link to={`/posts/${post._id}`}><h3>{post.title}</h3></Link>
            <p>{post.content.substring(0, 100)}...</p>
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;
