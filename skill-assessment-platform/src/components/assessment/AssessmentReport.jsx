import React, { useState, useEffect, useRef } from "react";
import { Search, Download, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import Navbar from '../Navbar';

const AssessmentReport = () => {
  const container = useRef(null);
  const pdfExportComponent = useRef(null);
  const { id, userId } = useParams();
  
  // State management
  const [reportData, setReportData] = useState({
    assessmentDetails: {
      title: "",
      completion_date: null,
      score: 0,
      passed: false,
      time_taken: "N/A",
    },
  });
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'

  // PDF Export functions
  const exportPDFWithMethod = () => {
    let el = container.current || document.body;
    savePDF(el, {
      paperSize: "auto",
      margin: 40,
      fileName: `Report for ${new Date().getFullYear()}`,
    });
  };
  
  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  // Fetch report data
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/assessment-report/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const transformedData = {
          assessmentDetails: {
            title: data[0]?.title || "",
            completion_date: data[0]?.completed_at || null,
            score: data[0]?.score || 0,
            passed: (data[0]?.score || 0) >= 70,
            time_taken: data[0]?.time_taken || 0,
          },
          skillBreakdown: data.map((item, index) => ({
            key: `${item.skill_name || "Unknown Skill"}-${index}`,
            skillName: item.skill_name || "Unknown Skill",
            score: item.skill_score || 0,
            time_taken: item.skill_time_taken || 0,
          })),
        };

        setReportData(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Fetch assessment history
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.id;
    
    fetch(
      `http://localhost:5000/api/user-assessments/history?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        if (response) {
          const formattedData = response.map((assessment) => ({
            id: assessment.id, // user_assessment id
            reportId: assessment.report_id, // assessment_report id
            title: assessment.title,
            completion_date: assessment.completed_at,
            score: assessment.score,
            passed: assessment.score >= 70,
            time_taken: assessment.time_taken,
          }));

          setAssessmentHistory(formattedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching assessment history:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch user profile data
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  // Determine grade text based on score
  const getGradeText = (score) => {
    if (score >= 80) return "High";
    if (score >= 60) return "Medium";
    return "Low";
  };

  // Filter assessments based on search term
  const filteredAssessments = searchTerm
    ? assessmentHistory.filter(assessment =>
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : assessmentHistory;

  // Sort filtered assessments by date
  const sortedAssessments = [...filteredAssessments].sort((a, b) => {
    const dateA = new Date(a.completion_date || 0);
    const dateB = new Date(b.completion_date || 0);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar userData={userData}/>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-10">Loading assessment report...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">Error: {error}</div>
        ) : (
          <PDFExport
            ref={pdfExportComponent}
            paperSize="auto"
            margin={40}
            fileName={`Report for ${new Date().getFullYear()}`}
            author="KendoReact Team"
          >
            <div ref={container}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-green-600">
                    {reportData.assessmentDetails.title} Report
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Completed on:{" "}
                    {formatDate(reportData.assessmentDetails.completion_date)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button className="flex items-center space-x-2 px-4 py-2 border rounded-md">
                      <span>
                        Date Taken:{" "}
                        {formatDate(
                          reportData.assessmentDetails.completion_date
                        )}
                      </span>
                      {/* <ChevronDown className="w-4 h-4" /> */}
                    </button>
                  </div>
                  <button
                    onClick={exportPDFWithMethod}
                    className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                  >
                    <span>Download Report</span>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow-sm rounded-lg p-6 inline-block">
                  <div className="text-sm text-gray-500">Overall Score</div>
                  <div
                    className={`text-3xl font-bold ${
                      reportData.assessmentDetails.passed
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {reportData.assessmentDetails.score}%
                  </div>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-6 inline-block">
                  <div className="text-sm text-gray-500">Status</div>
                  <div
                    className={`text-3xl font-bold ${
                      reportData.assessmentDetails.passed
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {reportData.assessmentDetails.passed ? "Pass" : "Fail"}
                  </div>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-6 inline-block">
                  <div className="text-sm text-gray-500">Time Taken</div>
                  <div className="text-3xl font-bold text-green-600">
                    {reportData.assessmentDetails.time_taken || "N/A"} mins
                  </div>
                </div>
              </div>

              {/* Detailed Data Section */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Assessment History
                </h3>

                {/* Search Bar */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search assessments"
                    className="w-full px-4 py-2 border rounded-md pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">ID</th>
                        <th 
                          className="text-left py-3 px-4 cursor-pointer flex items-center" 
                          onClick={toggleSortDirection}
                        >
                          Date & Time
                          <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        </th>
                        <th className="text-left py-3 px-4">Title</th>
                        <th className="text-left py-3 px-4">Score</th>
                        <th className="text-left py-3 px-4">Grade</th>
                        <th className="text-right py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedAssessments.length > 0 ? (
                        sortedAssessments.map((assessment, index) => (
                          <tr key={assessment.id} className="border-b">
                            <td className="py-4 px-4">{index + 1}</td>
                            <td className="py-4 px-4">
                              {formatDate(assessment.completion_date)}
                            </td>
                            <td className="py-4 px-4">
                              {assessment.title}
                            </td>
                            <td className="py-4 px-4">{assessment.score}%</td>
                            <td className="py-4 px-4">
                              {getGradeText(assessment.score)}
                            </td>
                            <td className="py-4 px-4">
                              <Link
                                to={`/assessment-report/${assessment.reportId || assessment.id}`}
                                className="flex items-center space-x-1 text-green-600 ml-auto"
                              >
                                <span>View Report</span>
                                <Download className="w-4 h-4" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="py-4 px-4 text-center text-gray-500"
                          >
                            {searchTerm
                              ? "No assessments match your search"
                              : "No assessment history available"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </PDFExport>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center p-8 mt-12 rounded-lg">
        <h1 className="text-green-700 font-bold">SkillsAssess</h1>
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SkillsAssess. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default AssessmentReport;