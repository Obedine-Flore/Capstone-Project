import React from "react";
import '../../index.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const skills = [
    { name: "Communication", proficiency: 75 },
    { name: "Critical Thinking", proficiency: 60 },
    { name: "Adaptability", proficiency: 10 },
    { name: "Creativity", proficiency: 89 },
    { name: "Problem Solving", proficiency: 25 },
    { name: "Team Work", proficiency: 90 },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 shadow-md bg-white">
        <h1 className="text-xl font-bold text-green-600 mb-6">Skills<span className="text-gray-900">Assess</span></h1>
        <nav className="space-x-6">
          <a href="#" className="text-green-700 font-semibold">Dashboard</a>
          <a href="/assessments" className="text-gray-700">Assessments</a>
          <a href="/peerreviews" className="text-gray-700">Peer Reviews</a>
          <a href="/blog" className="text-gray-700">Blog</a>  
        </nav>
        <Link to="/profile">
          <div className="w-10 h-10 rounded-full bg-green-300 cursor-pointer"></div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <h2 className="text-xl font-semibold">Hello John,</h2>
        <p className="text-lg text-green-700 font-semibold">What skill will you like to practice today?</p>

        {/* Search Bar */}
        <div className="flex items-center space-x-2 my-4">
          <input
            type="text"
            placeholder="Curiosity in the 21st Century"
            className="border px-4 py-2 rounded-full w-80"
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded-full">Search</button>
        </div>

        {/* Recommended Skills */}
        <h3 className="text-xl font-semibold text-green-700 mt-6">Recommended Skills</h3>
        <div className="grid grid-cols-3 gap-6 mt-4">
          {skills.map((skill, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-800">{skill.name}</h4>
              <p className={`text-lg font-bold ${skill.proficiency < 30 ? "text-red-600" : "text-black"}`}>
                {skill.proficiency}% Proficiency
              </p>
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded">Get Started</button>
            </div>
          ))}
        </div>

        <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded">See More</button>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center p-6 mt-10">
        <h1 className="text-green-700 font-bold">SkillsAssess</h1>
        <p className="text-sm text-gray-600">&copy; 2023 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </footer>
    </div>
  );
};
export default Dashboard;
