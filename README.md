This is my README file.

import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

import React from "react";

const ProfileSection = () => {
  // Mock user data (Replace with dynamic data from API or context)
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    bio: "Aspiring software developer passionate about AI and Web Development.",
    avatar: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fheadshot&psig=AOvVaw2DVAJFk9W0HpgYoPI0aJrr&ust=1739026192987000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKCetKXosYsDFQAAAAAdAAAAABAE",
    skills: ["React", "Node.js", "Tailwind CSS", "Problem-Solving"],
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md mx-auto mt-10">
      {/* Profile Avatar */}
      <div className="flex flex-col items-center">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-24 h-24 rounded-full border-4 border-blue-500"
        />
        <h2 className="text-xl font-semibold mt-3">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
        <p className="text-gray-700 text-sm text-center mt-2">{user.bio}</p>
      </div>

      {/* Skills Section */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Skills</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {user.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Edit Profile Button */}
      <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileSection;