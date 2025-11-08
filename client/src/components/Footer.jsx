import'../App.css';
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-6">
      <p>© {new Date().getFullYear()} MERN Blog by Zac | All rights reserved.</p>
    </footer>
  );
};

export default Footer;
