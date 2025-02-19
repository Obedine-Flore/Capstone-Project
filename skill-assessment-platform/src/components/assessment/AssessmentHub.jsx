import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import profilePic from "../../assets/profile.jpg";

const Assessment = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/assessments/all') // Ensure this matches your backend API route
      .then(response => response.json())
      .then(data => setAssessments(data))
      .catch(error => console.error('Error fetching assessments:', error));
  }, []);

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
          <div className="w-10 h-10 rounded-full bg-green-300 cursor-pointer">
            <img src={profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover shadow-md" />
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
              <input type="text" placeholder="Search" className="border px-6 py-3 rounded-full w-96" />
              <button className="bg-green-600 text-white px-6 py-3 rounded-full">🔍</button>
              <select className="border px-6 py-3 rounded">
                <option>Date range</option>
              </select>
            </div>
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="border p-6 rounded-lg shadow-md flex justify-between items-center mb-4">
                <span>Curiosity</span>
                <span>2024-11-24 10:30 AM</span>
                <span>98%</span>
                <span className="text-green-600">Pass</span>
                <button onClick={() => navigate("/assessments/AssessmentReport")} className="bg-green-600 text-white px-5 py-3 rounded">View details ▼</button>
              </div>
            ))}
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
