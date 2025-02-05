import React from 'react';
import { BarChart2, Book, Users, Settings } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  return (
    <aside className={`${isOpen ? 'block' : 'hidden'} md:block w-64 bg-white border-r`}>
      <div className="p-4">
        <nav className="space-y-2">
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg bg-blue-50 text-blue-700">
            <BarChart2 size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
            <Book size={20} />
            <span>Assessments</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
            <Users size={20} />
            <span>Peer Review</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
