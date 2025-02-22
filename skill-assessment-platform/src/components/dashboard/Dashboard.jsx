import React, { useEffect, useState } from "react";
import '../../index.css';
import { Link } from 'react-router-dom';
import profilePic from "../../assets/profile.jpg";
import axios from "axios";

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
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);

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
    
    // Fetch user profile data including profile picture
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No authentication token found, using default profile image");
        setIsLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {userData && userData.profile_picture ? (
              <img
                src={userData.profile_picture.startsWith('http') 
                  ? userData.profile_picture 
                  : `http://localhost:5000/${userData.profile_picture.startsWith('/') ? userData.profile_picture.substring(1) : userData.profile_picture}`}
                alt="Profile"
                className="w-10 h-10 object-cover"
                onError={(e) => {
                  console.log("Profile image failed to load");
                  e.target.src = profilePic;
                }}
              />
            ) : (
              <img 
                src={profilePic} 
                alt="Profile" 
                className="w-10 h-10 object-cover" 
              />
            )}
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
        <div className="flex flex-col md:flex-row gap-8">         
                    {/* Featured Article */}
                    {blogPosts.find(post => post.featured) && (
                      <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                        <span className="text-xs font-medium text-green-800 bg-green-200 px-2 py-1 rounded-full">Featured</span>
                        <h4 className="font-medium text-green-900 mt-2">
                          {blogPosts.find(post => post.featured).title}
                        </h4>
                        <p className="text-sm text-green-700 mt-2">
                          {blogPosts.find(post => post.featured).excerpt.substring(0, 70)}...
                        </p>
                        <Link 
                          to={`/blog/${blogPosts.find(post => post.featured).id}`}
                          className="text-sm font-medium text-green-700 hover:text-green-800 mt-2 inline-block"
                        >
                          Read more →
                        </Link>
                      </div>
                    )}
        </div>
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