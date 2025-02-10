import React from "react";
import { useNavigate } from "react-router-dom";

const Assessment = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-green-700">SkillsAssess</h1>
        <nav className="space-x-6">
          <a href="/" className="text-gray-700">Dashboard</a>
          <a href="#" className="text-green-700 font-semibold">Assessments</a>
          <a href="#" className="text-gray-700">Peer Reviews</a>
          <a href="/blog" className="text-gray-700">Blog</a>
        </nav>
        <div className="w-10 h-10 rounded-full bg-green-300"></div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <h2 className="text-xl font-semibold text-green-700">Evaluate and Track your 21st Century Skills</h2>

        {/* Available Assessments */}
        <div className="mt-6 bg-white p-6 shadow rounded-lg">
          <h3 className="font-semibold text-gray-700">Available Assessments</h3>
          <div className="grid grid-cols-3 gap-6 mt-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-gray-800">Communication Assessment</h4>
                <p className="font-bold">Communication</p>
                <ul className="text-gray-600 text-sm mt-2">
                  <li>Intermediate</li>
                  <li>⏳ 45 minutes</li>
                  <li>📝 20 Questions</li>
                  <li>🔄 Can be attempted once</li>
                </ul>
                <button onClick={() => navigate("/assessments/QuestionScreen")} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Start Assessment</button>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment History */}
        <div className="mt-8 bg-white p-6 shadow rounded-lg">
          <h3 className="text-green-700 text-lg font-semibold">Assessment History</h3>
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <input type="text" placeholder="Search" className="border px-4 py-2 rounded-full w-80" />
              <button className="bg-green-600 text-white px-4 py-2 rounded-full">🔍</button>
              <select className="border px-4 py-2 rounded">
                <option>Date range</option>
              </select>
            </div>
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-md flex justify-between items-center mb-2">
                <span>Curiosity</span>
                <span>2024-11-24 10:30 AM</span>
                <span>98%</span>
                <span className="text-green-600">Pass</span>
                <button onClick={() => navigate("/assessments/AssessmentReport")} className="bg-green-600 text-white px-4 py-2 rounded">View details ▼</button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center p-6 mt-10">
        <h1 className="text-green-700 font-bold">SkillsAssess</h1>
        <p className="text-sm text-gray-600">&copy; 2023 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </footer>
    </div>
  );
};

export default Assessment;
