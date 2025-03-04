import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import axios from "axios";
import Navbar from '../Navbar';

const Assessment = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [userAssessments, setUserAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showAllAssessments, setShowAllAssessments] = useState(false);

  // Compute displayed assessments
  const displayedAssessments = showAllAssessments 
    ? assessments 
    : assessments.slice(0, 6);

  useEffect(() => {
    fetchUserData();
    
    // Fetch available assessments
    fetch('http://localhost:5000/api/assessments/all')
      .then(response => response.json())
      .then(data => setAssessments(data))
      .catch(error => console.error('Error fetching assessments:', error));
    
    // Use the new fetchAssessmentHistory function
    fetchAssessmentHistory();
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
    } finally {
      setIsLoading(false);
    }
  };

  // Filter assessment history based on search term and date filter
  const filteredHistory = userAssessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (dateFilter === "all") return matchesSearch;
    
    const assessmentDate = new Date(assessment.completion_date);
    const now = new Date();
    
    if (dateFilter === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return matchesSearch && assessmentDate >= weekAgo;
    }
    
    if (dateFilter === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      return matchesSearch && assessmentDate >= monthAgo;
    }
    
    if (dateFilter === "year") {
      const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
      return matchesSearch && assessmentDate >= yearAgo;
    }
    
    return matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // In AssessmentHub.jsx, modify fetchAssessmentHistory:
  const fetchAssessmentHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;
      
      console.log('Fetching history for user:', userId);
      
      // Modified query to include assessment_reports.id
      const response = await axios.get(
        `http://localhost:5000/api/user-assessments/history?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Response data:', response.data);
      
      if (response.data) {
        const formattedData = response.data.map(assessment => ({
          id: assessment.id, // user_assessment id
          reportId: assessment.report_id, // assessment_report id
          title: assessment.title,
          completion_date: assessment.completed_at,
          score: assessment.score,
          passed: assessment.score >= 70,
          time_taken: assessment.time_taken
        }));
        
        setUserAssessments(formattedData);
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
    }
  };
  
  // Helper function to determine progress bar color based on score
  const getScoreColor = (score) => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filter will happen automatically via the filteredHistory
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Navbar */}
      <Navbar userData={userData}/>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Welcome section */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 mb-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Evaluate and Track your Skills</h2>
              <p className="text-lg text-green-700 font-medium mt-2">
                Monitor your progress and improve your abilities
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-sm text-gray-600">Assessments completed</div>
                <div className="text-2xl font-bold text-green-600 mt-1">{userAssessments.length || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Assessments */}
        <section className="mb-16">
  <div className="flex items-center mb-6">
    <h3 className="text-2xl font-semibold text-green-700">
      Available Assessments
    </h3>
    <div className="h-px flex-grow bg-gray-200 ml-4"></div>
  </div>
  
  {/* Loading indicator */}
  {isLoading && (
    <div className="flex justify-center my-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
    </div>
  )}
  
  <div className="px-2">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {assessments.length > 0 ? (
        displayedAssessments.map((assessment) => (
          <div 
            key={assessment.id} 
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            {/* Assessment card content remains the same */}
            <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">{assessment.title}</h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <span className="ml-1">Level: {assessment.level}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-5 line-clamp-2">{assessment.description}</p>
                      
                      <div className="flex flex-col gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="mr-2">⏳</span>
                          <span>{assessment.time} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">📝</span>
                          <span>{assessment.num_questions} Questions</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">🔄</span>
                          <span>{assessment.attempts_allowed ? 'Multiple attempts allowed' : 'Multiple attempts'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/assessments/${assessment.id}/questions`)}
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        Start Assessment
                      </button>
                    </div>
          </div>
        ))
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm col-span-3">
          <p className="text-gray-600">No assessments available</p>
        </div>
      )}
    </div>

    {/* See More Button */}
    {assessments.length > 6 && !showAllAssessments && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowAllAssessments(true)}
          className="flex items-center px-8 py-3 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors border border-green-300 hover:border-green-400 shadow-sm hover:shadow"
        >
          See More Assessments
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    )}
  </div>
</section>

        {/* Assessment History */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <h3 className="text-2xl font-semibold text-green-700">
              Assessment History
            </h3>
            <div className="h-px flex-grow bg-gray-200 ml-4"></div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3.5 rounded-xl w-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm w-full md:w-auto"
              >
                <option value="all">All time</option>
                <option value="week">Last week</option>
                <option value="month">Last month</option>
                <option value="year">Last year</option>
              </select>
              <button 
                type="submit"
                className="px-8 py-3.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm hover:shadow w-full md:w-auto"
              >
                Search
              </button>
            </form>
          </div>
          
          {filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.map((assessment) => (
                <div 
                  key={assessment.id} 
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{assessment.title}</h4>
                        <div className="text-sm text-gray-500 mt-1">
                          {formatDate(assessment.completion_date)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          Score: {assessment.score}%
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${assessment.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {assessment.passed ? 'Pass' : 'Fail'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Score</span>
                        <span className="text-sm font-medium text-gray-700">
                          {assessment.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className={`${getScoreColor(assessment.score)} h-2.5 rounded-full transition-all duration-500`} 
                          style={{ width: `${assessment.score}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Link 
                        to={`/assessment-report/${assessment.reportId || assessment.id}`} 
                        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
                      >
                        View Details <ChevronDown className="ml-1" size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
              <p className="text-gray-600">No assessment history found</p>
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

export default Assessment;