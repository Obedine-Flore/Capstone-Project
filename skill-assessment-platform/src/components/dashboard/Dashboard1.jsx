import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import axios from "axios";

const Dashboard = () => {
  // State management
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [skills, setSkills] = useState([
    { name: "Communication", proficiency: 75, category: "Soft Skills" },
    { name: "Critical Thinking", proficiency: 60, category: "Cognitive" },
    { name: "Adaptability", proficiency: 10, category: "Soft Skills" },
    { name: "Creativity", proficiency: 89, category: "Cognitive" },
    { name: "Problem Solving", proficiency: 25, category: "Technical" },
    { name: "Team Work", proficiency: 90, category: "Soft Skills" },
  ]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState([]);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
    fetchUserProfile();
    // Initialize filtered skills
    setFilteredSkills(skills);
  }, []);

  // Handle search and filtering
  useEffect(() => {
    const filtered = skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredSkills(filtered);
  }, [searchTerm, selectedCategory, skills]);

  const fetchUserData = () => {
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
  };

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const getProficiencyColor = (proficiency) => {
    if (proficiency >= 80) return "text-green-600";
    if (proficiency >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const handleStartSkill = (skillName) => {
    // Navigate to assessment or learning path
    console.log(`Starting skill: ${skillName}`);
    // Add your navigation logic here
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-8 py-6">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white rounded-lg">
        <h1 className="text-xl font-bold text-green-600">Skills<span className="text-gray-900">Assess</span></h1>
        <nav className="space-x-6">
          <Link to="/dashboard" className="text-green-700 font-semibold">Dashboard</Link>
          <Link to="/assessments" className="text-gray-700">Assessments</Link>
          <Link to="/peerreviews" className="text-gray-700">Peer Reviews</Link>
          <Link to="/blog" className="text-gray-700">Blog</Link>
        </nav>
        <Link to="/profile">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {userData?.profile_picture ? (
              <img
                src={userData.profile_picture.startsWith('http') 
                  ? userData.profile_picture 
                  : `http://localhost:5000/${userData.profile_picture.startsWith('/') ? userData.profile_picture.substring(1) : userData.profile_picture}`}
                alt="Profile"
                className="w-10 h-10 object-cover"
                onError={(e) => {
                  e.target.src = "/default-profile.jpg";
                }}
              />
            ) : (
              <img 
                src="/default-profile.jpg"
                alt="Profile" 
                className="w-10 h-10 object-cover" 
              />
            )}
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Hello {userName || 'Guest'},</h2>
            <p className="text-lg text-green-700 font-semibold mt-2">What skill would you like to practice today?</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-full w-full border focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Categories</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Technical">Technical</option>
              <option value="Cognitive">Cognitive</option>
            </select>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-green-700 mb-6">
            {searchTerm ? 'Search Results' : 'Recommended Skills'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, index) => (
              <div key={index} className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{skill.name}</h4>
                    <span className="text-sm text-gray-500">{skill.category}</span>
                  </div>
                  <span className={`font-bold ${getProficiencyColor(skill.proficiency)}`}>
                    {skill.proficiency}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full ${getProficiencyColor(skill.proficiency)} bg-current`}
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
                <button
                  onClick={() => handleStartSkill(skill.name)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
          
          {filteredSkills.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No skills found matching your search criteria
            </div>
          )}
        </div>

        {/* Featured Articles Section */}
        {blogPosts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-green-700 mb-6">Featured Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.filter(post => post.featured).map(post => (
                <div key={post.id} className="bg-green-50 border border-green-100 p-6 rounded-lg">
                  <span className="text-xs font-medium text-green-800 bg-green-200 px-2 py-1 rounded-full">
                    Featured
                  </span>
                  <h4 className="font-medium text-green-900 mt-3">{post.title}</h4>
                  <p className="text-sm text-green-700 mt-2">{post.excerpt}</p>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="text-sm font-medium text-green-700 hover:text-green-800 mt-4 inline-block"
                  >
                    Read more →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center p-8 mt-12 rounded-lg">
        <h1 className="text-green-700 font-bold">SkillsAssess</h1>
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} SkillsAssess. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;