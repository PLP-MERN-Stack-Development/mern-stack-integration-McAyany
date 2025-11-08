import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import'../App.css';

const BlogLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* 🧭 Navbar */}
      <Navbar />

      {/* 📰 Main content */}
      <div className="flex flex-1 container mx-auto px-4 py-6 gap-6">
        {/* Sidebar (hidden on mobile) */}
        <aside className="hidden lg:block w-1/4 bg-white p-4 rounded-xl shadow">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-white p-6 rounded-xl shadow">
          {children}
        </main>
      </div>

      {/* ⚓ Footer */}
      <Footer />
    </div>
  );
};

export default BlogLayout;
