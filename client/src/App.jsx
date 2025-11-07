import {BrowserRouter as Router,  Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import PostList from './pages/PostList';
import PostDetails from './pages/PostDetails';
import PostForm from './pages/PostForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/create" element={<PostForm />} />
        <Route path="/edit/:id" element={<PostForm />} />
      </Routes>
    </Router>
  );
}

export default App;