import React from 'react';
import { Bell, User, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from "react-router-dom";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="px-4 inline-flex items-center md:hidden"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">SkillsAssess</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} />
            </button>

            {/* Link to Profile Page */}
            <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
              <User size={20} />
              <ChevronDown size={16} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
