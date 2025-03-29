import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Users, Award } from 'lucide-react';
import Navbar from '../Navbar';
import { userService } from '../../services/userService';
import { leaderboardService } from '../../services/leaderboardService';
import profilePic from "../../assets/profile.jpg";

const Leaderboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overall');
  const [leaderboardData, setLeaderboardData] = useState({
    overall: [],
    skills: []
  });
  const [userRanking, setUserRanking] = useState(null);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get the token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Configure axios to send the token with every request
        const config = {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        };

        // Fetch user profile
        const profile = await userService.getUserProfile();
        setUserData(profile);

        // Fetch leaderboard data
        const overallLeaderboard = await leaderboardService.getOverallLeaderboard();
        const skillLeaderboards = await leaderboardService.getSkillLeaderboards();

        // Fetch user's ranking
        const userRankingResponse = await axios.get('/api/leaderboard/user-ranking', config);
        
        // Set the data from the response, not the entire response object
        setUserRanking(userRankingResponse.data);

        setLeaderboardData({
          overall: overallLeaderboard,
          skills: skillLeaderboards
        });
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setError('Failed to load leaderboard data. Please try again later.');
        if (error.response && error.response.status === 401) {
          // Redirect to login or refresh token
          alert('Authentication failed. Please log in again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);


  // Helper function to determine rank color
  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return 'bg-yellow-400 text-black';
      case 2: return 'bg-gray-300 text-black';
      case 3: return 'bg-yellow-700 text-white';
      default: return 'bg-green-100 text-green-800';
    }
  };

  // Render leaderboard table
  const renderLeaderboardTable = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
          No leaderboard data available
        </div>
      );
    }
return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankColor(index + 1)}`}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                  src={user.avatar || profilePic} 
                  alt={user.username} 
                  onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if profilePic also fails
                  e.target.src = profilePic; // Explicitly set to profilePic
                  }}
                  className="w-full h-full object-cover"
                  />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render user's personal ranking
  const renderUserRanking = () => {
    if (!userRanking) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <Award className="mr-2 text-green-600" size={24} />
          Your Ranking
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600">Global Rank</div>
            <div className="text-2xl font-bold text-green-700">{userRanking.globalRank}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600">Total Score</div>
            <div className="text-2xl font-bold text-green-700">{userRanking.totalScore}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600">Skills Mastered</div>
            <div className="text-2xl font-bold text-green-700">{userRanking.skillsMastered}</div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Leaderboard</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Navbar - Same as your Assessment page */}
      <Navbar userData={userData}/>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8 flex-grow">
        {/* Leaderboard Header */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 mb-10 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Trophy className="mr-3 text-green-600" size={32} />
              Skills Leaderboard
            </h2>
            <p className="text-lg text-green-700 font-medium mt-2">
              Track your progress and compete with others
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="text-sm text-gray-600">Total Participants</div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                <Users size={24} className="inline mr-2" />
                {leaderboardData.overall.length}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Tabs */}
        <div className="mb-8 flex space-x-4">
          <button 
            onClick={() => setActiveTab('overall')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'overall' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-green-100'
            }`}
          >
            Overall Ranking
          </button>
          <button 
            onClick={() => setActiveTab('skills')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeTab === 'skills' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-300 text-gray-700 hover:bg-green-100'
            }`}
          >
            Skill-wise Ranking
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        )}

        {/* Leaderboard Content */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'overall' ? (
                renderLeaderboardTable(leaderboardData.overall)
              ) : (
                <div className="space-y-4">
                  {leaderboardData.skills.map((skillLeaderboard) => (
                    <div key={skillLeaderboard.skillId} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {skillLeaderboard.skillName}
                      </h3>
                      {renderLeaderboardTable(skillLeaderboard.leaderboard)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* User Ranking */}
            <div>
              {renderUserRanking()}
            </div>
          </div>
        )}
      </main>

      {/* Footer - Same as your Assessment page */}
      <footer className="bg-white text-center p-10 mt-auto border-t border-gray-200">
        <h1 className="text-xl font-bold text-green-700 mb-2">SkillsAssess</h1>
        <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} SkillsAssess. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Leaderboard;