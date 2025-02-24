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
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Separate states for all skills and recommended skills
  const [allSkills, setAllSkills] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  
  // Pagination states
  const [allSkillsPage, setAllSkillsPage] = useState(1);
  const [recommendedSkillsPage, setRecommendedSkillsPage] = useState(1);
  const [hasMoreAllSkills, setHasMoreAllSkills] = useState(true);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchUserData();
    fetchUserProfile();
    fetchSkills();
    fetchAssessmentHistory();
  }, []);

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

  // Fetch skills with pagination
  const fetchSkills = async (page = 1) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/all-skills`, {
        params: {
          page,
          limit: 6,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchTerm || undefined
        }
      });

      const { skills, hasMore } = response.data;
      
      if (page === 1) {
        setAllSkills(skills);
      } else {
        setAllSkills(prev => [...prev, ...skills]);
      }
      
      setHasMoreAllSkills(hasMore);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setError("Failed to load skills");
    }
  };

  // Fetch assessment history and generate recommendations
  const fetchAssessmentHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/user-assessments/history?userId=${userId}", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAssessmentHistory(response.data);
      generateRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching assessment history:", error);
    }
  };

  // Generate recommendations based on assessment history
  const generateRecommendations = (history) => {
    // Logic to generate recommendations:
    // 1. Skills with low scores that need improvement
    // 2. Skills related to ones the user has shown interest in
    // 3. Popular skills the user hasn't tried yet
    // 4. Skills that complement user's strengths

    const lowScoreSkills = history
      .filter(assessment => assessment.score < 70)
      .map(assessment => assessment.skillId);

    // Fetch recommended skills based on the analysis
    fetchRecommendedSkills(lowScoreSkills);
  };

  const fetchRecommendedSkills = async (relevantSkillIds, page = 1) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage (or another secure storage method)
  
      const response = await axios.get("http://localhost:5000/api/recommended-skills", {
        headers: {
          Authorization: `Bearer ${token}` // Include the token
        },
        params: {
          skillIds: relevantSkillIds?.join(',') || '', // Ensure skillIds is properly formatted
          page,
          limit: 6
        }
      });
  
      const { skills, hasMore } = response.data;
  
      if (page === 1) {
        setRecommendedSkills(skills);
      } else {
        setRecommendedSkills(prev => [...prev, ...skills]);
      }
  
      setHasMoreRecommended(hasMore);
    } catch (error) {
      console.error("Error fetching recommended skills:", error);
    }
  };
  

  // Load more skills
  const loadMoreAllSkills = () => {
    const nextPage = allSkillsPage + 1;
    setAllSkillsPage(nextPage);
    fetchSkills(nextPage);
  };

  const loadMoreRecommended = () => {
    const nextPage = recommendedSkillsPage + 1;
    setRecommendedSkillsPage(nextPage);
    fetchRecommendedSkills(nextPage);
  };

  const renderSkillsGrid = (skills, onLoadMore, hasMore) => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{skill.name}</h4>
                <span className="text-sm text-gray-500">{skill.category}</span>
              </div>
              {skill.assessmentCount && (
                <span className="text-sm text-gray-500">
                  {skill.assessmentCount} assessments
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">{skill.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{skill.difficulty}</span>
              <Link
                to={`/assessment/${skill.id}`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={onLoadMore}
          className="mt-6 flex items-center mx-auto px-6 py-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
        >
          See More <ChevronDown className="ml-2" size={16} />
        </button>
      )}
    </div>
  );

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
      
      <main className="container mx-auto p-8">
        {/* Welcome section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold">Hello {userName || 'Guest'},</h2>
            <p className="text-lg text-green-700 font-semibold mt-2">
              Ready to enhance your skills?
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setAllSkillsPage(1);
                  fetchSkills(1);
                }}
                className="pl-12 pr-4 py-3 rounded-full w-full border focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setAllSkillsPage(1);
                fetchSkills(1);
              }}
              className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Categories</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Technical">Technical</option>
              <option value="Cognitive">Cognitive</option>
            </select>
          </div>
        </div>

        {/* Recommended Skills Section */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold text-green-700 mb-6">
            Recommended for You
          </h3>
          {renderSkillsGrid(recommendedSkills, loadMoreRecommended, hasMoreRecommended)}
        </section>

        {/* All Skills Section */}
        <section>
          <h3 className="text-xl font-semibold text-green-700 mb-6">
            All Skills
          </h3>
          {renderSkillsGrid(allSkills, loadMoreAllSkills, hasMoreAllSkills)}
        </section>
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