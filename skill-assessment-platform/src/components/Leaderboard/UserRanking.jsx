import React, { useState, useEffect } from 'react';
//import { fetchUserRanking } from '../../api/leaderboardApi';
//import LoadingSpinner from '../common/LoadingSpinner';

const UserRanking = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const data = await fetchUserRanking(userId);
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user ranking:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getUserData();
  }, [userId]);
  
  if (loading) return <LoadingSpinner />;
  if (!userId) return <p>Please log in to see your ranking</p>;
  if (!userData) return <p>No data available</p>;
  
  return (
    <div className="user-ranking">
      <div className="user-stats">
        <div className="stat-card">
          <h3>Overall Rank</h3>
          <div className="rank-number">{userData.rank}</div>
        </div>
        <div className="stat-card">
          <h3>Total Score</h3>
          <div className="score-number">{userData.totalScore}</div>
        </div>
      </div>
      
      <h3>Your Skills Breakdown</h3>
      <div className="skills-breakdown">
        {userData.skillBreakdown.map((skill, index) => (
          <div key={index} className="skill-card">
            <h4>{skill.name}</h4>
            <div className="skill-score">{skill.highest_score}</div>
            <div 
              className="skill-bar" 
              style={{ width: `${Math.min(100, skill.highest_score / 10)}%` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRanking;