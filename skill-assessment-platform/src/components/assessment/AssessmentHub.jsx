import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import profilePic from "../../assets/profile.jpg";
import axios from "axios";

const Assessment = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [userAssessments, setUserAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      // Get the user ID from your auth token
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
      const userId = decodedToken.id; // Or however your user ID is stored in the token
      
      console.log('Fetching history for user:', userId); // Debug log
      
      const response = await axios.get(`http://localhost:5000/api/user-assessments/history?userId=${userId}`, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      
      console.log('Response data:', response.data); // Debug log
      
      if (response.data) {
          const formattedData = response.data.map(assessment => ({
              id: assessment.id,
              title: assessment.title,
              completion_date: assessment.completed_at,
              score: assessment.score,
              passed: assessment.score >= 70
          }));
          
          setUserAssessments(formattedData);
      }
  } catch (error) {
      console.error('Error fetching assessment history:', error);
  }
};

  return (
    <div className="min-h-screen flex flex-col justify-between px-8 py-6">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white rounded-lg">
        <h1 className="text-xl font-bold text-green-600">Skills<span className="text-gray-900">Assess</span></h1>
        <nav className="space-x-6">
          <a href="/dashboard" className="text-gray-700">Dashboard</a>
          <a href="#" className="text-green-700 font-semibold">Assessments</a>
          <a href="/peerreviews" className="text-gray-700">Peer Reviews</a>
          <a href="/blog" className="text-gray-700">Blog</a>  
        </nav>
        <Link to="/profile">
          <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
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
        <h2 className="text-xl font-semibold text-green-700">Evaluate and Track your 21st Century Skills</h2>

        {/* Available Assessments */}
        <div className="mt-8 bg-white p-8 shadow rounded-lg">
          <h3 className="font-semibold text-gray-700">Available Assessments</h3>
          <div className="grid grid-cols-3 gap-8 mt-6">
            {assessments.length > 0 ? (
              assessments.map((assessment) => (
                <div key={assessment.id} className="border p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-gray-800">{assessment.title}</h4>
                  <p className="font-bold">{assessment.description}</p>
                  <ul className="text-gray-600 text-sm mt-3">
                    <li>Level: {assessment.level}</li>
                    <li>⏳ {assessment.time} minutes</li>
                    <li>📝 {assessment.num_questions} Questions</li>
                    <li>🔄 {assessment.attempts_allowed} Can be attempted multiple times</li>
                  </ul>
                  <button 
                    onClick={() => navigate(`/assessments/${assessment.id}/questions`)}
                    className="mt-6 bg-green-600 text-white px-5 py-3 rounded"
                  >
                    Start Assessment
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No assessments available</p>
            )}
          </div>
        </div>

        {/* Assessment History */}
        <div className="mt-10 bg-white p-8 shadow rounded-lg">
          <h3 className="text-green-700 text-lg font-semibold">Assessment History</h3>
          <div className="mt-6">
            <div className="flex justify-between mb-4">
              <input 
                type="text" 
                placeholder="Search" 
                className="border px-6 py-3 rounded-full w-96"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-green-600 text-white px-6 py-3 rounded-full">🔍</button>
              <select 
                className="border px-6 py-3 rounded"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All time</option>
                <option value="week">Last week</option>
                <option value="month">Last month</option>
                <option value="year">Last year</option>
              </select>
            </div>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((assessment) => (
                <div 
                  key={assessment.id} 
                  className="border p-6 rounded-lg shadow-md flex justify-between items-center mb-4"
                >
                  <span>{assessment.title}</span>
                  <span>{formatDate(assessment.completion_date)}</span>
                  <span>{assessment.score}%</span>
                  <span className={assessment.passed ? "text-green-600" : "text-red-600"}>
                    {assessment.passed ? "Pass" : "Fail"}
                  </span>
                  <button 
                    onClick={() => navigate(`/assessments/report/${assessment.id}`)} 
                    className="bg-green-600 text-white px-5 py-3 rounded"
                  >
                    View details ▼
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No assessment history found</p>
            )}
          </div>
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

export default Assessment;