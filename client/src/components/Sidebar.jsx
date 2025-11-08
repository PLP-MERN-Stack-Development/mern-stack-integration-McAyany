import '../App.css';

const Sidebar = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      <ul className="space-y-2">
        <li><a href="#" className="text-blue-600 hover:underline">Tech</a></li>
        <li><a href="#" className="text-blue-600 hover:underline">Programming</a></li>
        <li><a href="#" className="text-blue-600 hover:underline">Design</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
