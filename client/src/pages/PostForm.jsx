import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function PostForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    if (id) {
      axios.get(`/api/posts/${id}`).then((res) => setFormData(res.data));
    }
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await axios.put(`/api/posts/${id}`, formData);
    } else {
      await axios.post('/api/posts', formData);
    }
    navigate('/');
  };

  return (
    <div>
      <h2>{id ? 'Edit Post' : 'Create Post'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Post Title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Post Content"
          value={formData.content}
          onChange={handleChange}
        ></textarea>
        <button type="submit">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default PostForm;
