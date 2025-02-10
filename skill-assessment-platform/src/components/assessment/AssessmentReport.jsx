import React from 'react';
import { Search, Download, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AssessmentReport = () => {
  const tableData = [
    { date: '2024-11-24 10:30 AM', grade: 'Low', skill: 'Critical Thinking', status: 'None' },
    { date: '2024-11-24 10:30 AM', grade: 'Low', skill: 'Adaptability', status: 'None' },
    { date: '2024-11-24 10:30 AM', grade: 'Low', skill: 'Teamwork', status: 'None' },
    { date: '2024-11-24 10:30 AM', grade: 'Low', skill: 'Communication', status: 'None' },
    { date: '2024-11-24 10:30 AM', grade: 'Low', skill: 'Curiosity', status: 'None' },
    { date: '2024-11-24 10:30 AM', grade: 'Low', skill: 'Creativity', status: 'None' },
    { date: '2024-11-24 10:30 AM', grade: 'Low', skill: 'Research', status: 'None' },
    { date: '2024-11-24 10:30 AM', grade: 'Low', skill: 'Problem-Solving', status: 'None' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="flex justify-between items-center p-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-green-700">SkillsAssess</h1>
        <nav className="space-x-6">
          <a href="/dashboard" className="text-gray-700">Dashboard</a>
          <a href="#" className="text-green-700 font-semibold">Assessments</a>
          <a href="#" className="text-gray-700">Peer Reviews</a>
          <a href="/blog" className="text-gray-700">Blog</a>
        </nav>
        <Link to="/profile">
          <div className="w-10 h-10 rounded-full bg-green-300 cursor-pointer"></div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-green-600">Skills Assessment Report</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2 border rounded-md">
                <span>Date Range</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2">
              <span>Share Report</span>
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8 inline-block">
          <div className="text-sm text-gray-500">Number of tests taken</div>
          <div className="text-3xl font-bold text-green-600">1.200.000</div>
        </div>

        {/* Detailed Data Section */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Detailed Data</h3>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border rounded-md pl-10"
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
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-right py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 px-4">{row.date}</td>
                    <td className="py-4 px-4">{row.grade}</td>
                    <td className="py-4 px-4">{row.skill}</td>
                    <td className="py-4 px-4 text-gray-500">{row.status}</td>
                    <td className="py-4 px-4">
                      <button className="flex items-center space-x-1 text-green-600 ml-auto">
                        <span>Download Report</span>
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <button className="p-2 rounded-md hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-green-600 text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100">4</button>
            <button className="p-2 rounded-md hover:bg-gray-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
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
