import {BrowserRouter as Router,  Routes, Route} from 'react-router-dom'
import PostList from './pages/PostList';
import PostDetails from './pages/PostDetails';
import PostForm from './pages/PostForm';
import BlogLayout from './components/BlogLayout';
import './index.css';

function App() {
  return (
    <BlogLayout>
      <Router>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/create" element={<PostForm />} />
          <Route path="/edit/:id" element={<PostForm />} />
        </Routes>
      </Router>
    </BlogLayout>
  );
}

export default App;