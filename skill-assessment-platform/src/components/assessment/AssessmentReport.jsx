import React, { useState, useEffect } from 'react';
import { Search, Download, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import profilePic from "../../assets/profile.jpg";

const AssessmentReport = () => {
  const { id } = useParams();
  const [reportData, setReportData] = useState({
    assessmentDetails: {
      title: '',
      completion_date: null,
      score: 0,
      passed: false,
      time_taken: 'N/A'
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState(null);
  const itemsPerPage = 8;


  useEffect(() => {
    // Fetch assessment report data
    setLoading(true);
    fetch(`http://localhost:5000/api/assessment-report/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log("Raw API response:", data); // Add this to see the data structure
        
        // Transform the API response to match your component's expected structure
        const transformedData = {
          assessmentDetails: {
            title: data[0]?.title || '',
            completion_date: data[0]?.completed_at || null,
            score: data[0]?.score || 0,
            passed: (data[0]?.score || 0) >= 70,
            time_taken: data[0]?.time_taken || 0
          },
          skillBreakdown: data.map(item => ({
            skillName: item.skill_name || 'Unknown Skill',
            score: item.skill_score || 0,
          }))
        };
        
        setReportData(transformedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching assessment report:', error);
        setLoading(false);
      });
  }, [id]);
  
  // Safe filtering of skills
  const filteredSkills = reportData?.skillBreakdown?.filter(skill =>
    skill.skillName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const currentItems = filteredSkills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Determine grade text based on score
  const getGradeText = (score) => {
    if (score >= 80) return "High";
    if (score >= 60) return "Medium";
    return "Low";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white rounded-lg">
        <h1 className="text-xl font-bold text-green-600">Skills<span className="text-gray-900">Assess</span></h1>
        <nav className="space-x-6">
          <a href="/dashboard" className="text-gray-700">Dashboard</a>
          <Link to="/assessments" className="text-green-700 font-semibold">Assessments</Link>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-10">Loading assessment report...</div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-green-600">
                  {reportData.assessmentDetails.title} Report
                </h2>
                <p className="text-gray-600 mt-1">
                  Completed on: {formatDate(reportData.assessmentDetails.completion_date)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="flex items-center space-x-2 px-4 py-2 border rounded-md">
                    <span>Date: {formatDate(reportData.assessmentDetails.completion_date)}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                  <span>Download Report</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white shadow-sm rounded-lg p-6 inline-block">
                <div className="text-sm text-gray-500">Overall Score</div>
                <div className="text-3xl font-bold text-green-600">
                  {reportData.assessmentDetails.score}%
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-lg p-6 inline-block">
                <div className="text-sm text-gray-500">Status</div>
                <div className={`text-3xl font-bold ${reportData.assessmentDetails.passed ? "text-green-600" : "text-red-500"}`}>
                  {reportData.assessmentDetails.passed ? "Pass" : "Fail"}
                </div>
              </div>
              <div className="bg-white shadow-sm rounded-lg p-6 inline-block">
                <div className="text-sm text-gray-500">Time Taken</div>
                <div className="text-3xl font-bold text-green-600">
                  {reportData.assessmentDetails.time_taken || "N/A"} min
                </div>
              </div>
            </div>

            {/* Detailed Data Section */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Skill Breakdown</h3>
              
              {/* Search Bar */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search skills"
                  className="w-full px-4 py-2 border rounded-md pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date & Time</th>
                      <th className="text-left py-3 px-4">Grade</th>
                      <th className="text-left py-3 px-4">Skill</th>
                      <th className="text-left py-3 px-4">Score</th>
                      <th className="text-right py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((skill, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-4 px-4">{formatDate(reportData.assessmentDetails.completion_date)}</td>
                          <td className="py-4 px-4">{getGradeText(skill.score)}</td>
                          <td className="py-4 px-4">{skill.skillName}</td>
                          <td className="py-4 px-4">{skill.score}%</td>
                          <td className="py-4 px-4">
                            <button className="flex items-center space-x-1 text-green-600 ml-auto">
                              <span>Download Report</span>
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                          {searchTerm ? "No skills match your search" : "No skill data available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6">
                  <button 
                    className="p-2 rounded-md hover:bg-gray-100"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i + 1}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === i + 1 
                          ? "bg-green-600 text-white" 
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    className="p-2 rounded-md hover:bg-gray-100"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-600 mb-6">Skills<span className="text-gray-900">Assess</span></h2>
            <p className="text-gray-500 text-sm">
              © 2023 Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AssessmentReport;
