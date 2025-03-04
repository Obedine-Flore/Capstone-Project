import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Award, TrendingUp, BookOpen } from 'lucide-react';
import axios from "axios";
import { useTranslation } from "react-i18next";
import Navbar from '../Navbar';
//import LanguageSwitcher from "../LanguageSwitcher";

const Dashboard = () => {
  const { t } = useTranslation();
  // State management
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  //const [assessments, setAssessments] = useState([]);
  
  // Separate states for all skills and recommended skills
  const [allSkills, setAllSkills] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [relevantSkillIds, setRelevantSkillIds] = useState([]);
  
  // Pagination states
  const [allSkillsPage, setAllSkillsPage] = useState(1);
  const [recommendedSkillsPage, setRecommendedSkillsPage] = useState(1);
  const [hasMoreAllSkills, setHasMoreAllSkills] = useState(true);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchUserData();
    fetchUserProfile();
  }, []);

  // Debounce search term changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Re-fetch skills when search or category changes
  useEffect(() => {
    setAllSkillsPage(1);
    fetchSkills(1);
    
    if (relevantSkillIds.length > 0) {
      setRecommendedSkillsPage(1);
      fetchRecommendedSkills(relevantSkillIds, 1);
    }
  }, [debouncedSearchTerm, selectedCategory]);

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
      fetchAssessmentHistory(response.data.id);
      fetchSkills(1);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch skills with pagination and search
  const fetchSkills = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/all-skills`, {
        params: {
          page,
          limit: 10,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: debouncedSearchTerm || undefined
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
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch assessment history and generate recommendations
  const fetchAssessmentHistory = async (userId) => {
    if (!userId) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const response = await axios.get(`http://localhost:5000/api/user-assessments/history?userId=${userId}`, {
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

    setRelevantSkillIds(lowScoreSkills);
    
    // Fetch recommended skills based on the analysis
    fetchRecommendedSkills(lowScoreSkills, 1);
  };

  const fetchRecommendedSkills = async (skillIds, page = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const response = await axios.get("http://localhost:5000/api/recommended-skills", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          skillIds: skillIds?.join(',') || '',
          page,
          limit: 6,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: debouncedSearchTerm || undefined
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
    fetchRecommendedSkills(relevantSkillIds, nextPage);
  };

  // Helper function to determine progress bar color based on proficiency level
  const getProgressBarColor = (proficiency) => {
    if (proficiency < 40) return 'bg-red-500';
    if (proficiency < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Helper function to get icon based on category
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Soft Skills':
        return <Award className="text-purple-500" size={18} />;
      case 'Technical':
        return <TrendingUp className="text-blue-500" size={18} />;
      case 'Cognitive':
        return <BookOpen className="text-orange-500" size={18} />;
      default:
        return <Award className="text-green-500" size={18} />;
    }
  };

  const renderSkillsGrid = (skills, onLoadMore, hasMore, showProficiency = false) => (
    <div className="px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill) => (
          <div 
            key={skill.id} 
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">{skill.name}</h4>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    {getCategoryIcon(skill.category)}
                    <span className="ml-1">{skill.category}</span>
                  </div>
                </div>
                {skill.assessmentCount && (
                  <span className="text-sm font-medium px-3 py-1 bg-green-50 text-green-600 rounded-full">
                    {skill.assessmentCount} assessments
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-5 line-clamp-2">{skill.description}</p>
              
              {/* Proficiency bar for recommended skills */}
              {showProficiency && (
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Proficiency</span>
                    <span className="text-sm font-medium text-gray-700">
                      {skill.proficiency || Math.floor(Math.random() * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className={`${getProgressBarColor(skill.proficiency || Math.floor(Math.random() * 100))} h-2.5 rounded-full transition-all duration-500`} 
                      style={{ width: `${skill.proficiency || Math.floor(Math.random() * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
              <span className="text-sm font-medium px-3 py-1 bg-gray-200 text-gray-700 rounded-full">{skill.difficulty}</span>
              <Link
                to={`/assessments`}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={onLoadMore}
            className="flex items-center px-8 py-3 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors border border-green-200 hover:border-green-300 shadow-sm hover:shadow"
          >
            See More <ChevronDown className="ml-2" size={16} />
          </button>
        </div>
      )}
    </div>
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setAllSkillsPage(1);
    fetchSkills(1);
    
    if (relevantSkillIds.length > 0) {
      setRecommendedSkillsPage(1);
      fetchRecommendedSkills(relevantSkillIds, 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Navbar */}
      <Navbar userData={userData}/>
      
      <main className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 mb-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
            <h1>{t("dashboard")}</h1>
              <h2 className="text-2xl font-semibold text-gray-800">Hello {userName || 'Guest'},</h2>
              <p className="text-lg text-green-700 font-medium mt-2">
                Ready to enhance your skills today?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-sm text-gray-600">Assessments completed</div>
                <div className="text-2xl font-bold text-green-600 mt-1">{assessmentHistory.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3.5 rounded-xl w-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm w-full md:w-auto"
            >
              <option value="All">All Categories</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Technical">Technical</option>
              <option value="Cognitive">Cognitive</option>
            </select>
            <button 
              type="submit"
              className="px-8 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm hover:shadow w-full md:w-auto"
            >
              Search
            </button>
          </form>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-10 shadow-sm">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Recommended Skills Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <h3 className="text-2xl font-semibold text-green-700">
              Recommended for You
            </h3>
            <div className="h-px flex-grow bg-gray-200 ml-4"></div>
          </div>
          {!isLoading && (
            recommendedSkills.length > 0 ? (
              renderSkillsGrid(recommendedSkills, loadMoreRecommended, hasMoreRecommended, true)
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
                <p className="text-gray-600">Complete some assessments to get personalized recommendations!</p>
              </div>
            )
          )}
        </section>

        {/* All Skills Section */}
        <section className="mb-10">
          <div className="flex items-center mb-6">
            <h3 className="text-2xl font-semibold text-green-700">
              All Skills
            </h3>
            <div className="h-px flex-grow bg-gray-200 ml-4"></div>
          </div>
          {!isLoading && allSkills.length > 0 ? (
            renderSkillsGrid(allSkills, loadMoreAllSkills, hasMoreAllSkills)
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
              <p className="text-gray-600">No skills found matching your criteria.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center p-10 mt-auto border-t border-gray-200">
        <h1 className="text-xl font-bold text-green-700 mb-2">SkillsAssess</h1>
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} SkillsAssess. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;