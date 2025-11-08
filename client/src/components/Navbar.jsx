import'../App.css';

const Navbar = () => {
  return (
    <header className="bg-blue-600 text-white shadow">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">MERN Blog</h1>
        <nav className="space-x-4">
          <a href="/" className="hover:text-blue-200">Home</a>
          <a href="/create" className="hover:text-blue-200">Create</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;