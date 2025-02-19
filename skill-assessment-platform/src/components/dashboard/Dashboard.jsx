import React, { useEffect, useState } from "react";
import '../../index.css';
import { Link } from 'react-router-dom';
import profilePic from "../../assets/profile.jpg";

const Dashboard = () => {
  const skills = [
    { name: "Communication", proficiency: 75 },
    { name: "Critical Thinking", proficiency: 60 },
    { name: "Adaptability", proficiency: 10 },
    { name: "Creativity", proficiency: 89 },
    { name: "Problem Solving", proficiency: 25 },
    { name: "Team Work", proficiency: 90 },
  ];

  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Retrieve the name from localStorage (or state if you prefer)
    const storedName = localStorage.getItem('user');
    if (storedName) {
        try {
          const userData = JSON.parse(storedName);
          setUserName(userData.name || 'Guest');
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUserName('Guest');
        }
      }
    }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between px-8 py-6">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white rounded-lg">
        <h1 className="text-xl font-bold text-green-600">Skills<span className="text-gray-900">Assess</span></h1>
        <nav className="space-x-6">
          <a href="#" className="text-green-700 font-semibold">Dashboard</a>
          <a href="/assessments" className="text-gray-700">Assessments</a>
          <a href="/peerreviews" className="text-gray-700">Peer Reviews</a>
          <a href="/blog" className="text-gray-700">Blog</a>  
        </nav>
        <Link to="/profile">
          <div className="w-10 h-10 rounded-full bg-green-300 cursor-pointer">
            <img
              src={profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover shadow-md"
            />
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-8">
        <h2 className="text-xl font-semibold">Hello {userName || 'Guest'},</h2>
        <p className="text-lg text-green-700 font-semibold">What skill will you like to practice today?</p>

        {/* Search Bar */}
        <div className="flex items-center space-x-4 my-6">
          <input
            type="text"
            placeholder="Curiosity in the 21st Century"
            className="border px-6 py-3 rounded-full w-96"
          />
          <button className="bg-green-600 text-white px-6 py-3 rounded-full">Search</button>
        </div>

        {/* Recommended Skills */}
        <h3 className="text-xl font-semibold text-green-700 mt-8">Recommended Skills</h3>
        <div className="grid grid-cols-3 gap-8 mt-6">
          {skills.map((skill, index) => (
            <div key={index} className="border p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold text-gray-800">{skill.name}</h4>
              <p className={`text-lg font-bold ${skill.proficiency < 30 ? "text-red-600" : "text-black"}`}>
                {skill.proficiency}% Proficiency
              </p>
              <button className="mt-3 bg-green-600 text-white px-5 py-3 rounded">Get Started</button>
            </div>
          ))}
        </div>

        <button className="mt-8 bg-green-600 text-white px-8 py-3 rounded">See More</button>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center p-8 mt-12 rounded-lg">
        <h1 className="text-green-700 font-bold">SkillsAssess</h1>
        <p className="text-sm text-gray-600">&copy; 2023 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </footer>
    </div>
  );
};
export default Dashboard;
