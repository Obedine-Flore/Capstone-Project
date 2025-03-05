// leaderboardController.js
const mysql = require('mysql2/promise');
const pool = require('../config/db');

// Get Overall Leaderboard
const getOverallLeaderboard = async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        u.id, 
        u.name AS username, 
        u.profile_picture AS avatar, 
        COALESCE(SUM(ar.score), 0) AS score
      FROM users u
      LEFT JOIN assessment_reports ar ON u.id = ar.user_id
      GROUP BY u.id, u.name, u.profile_picture
      ORDER BY score DESC
      LIMIT 100
    `);

    // Ensure each result has the exact structure expected by frontend
    const formattedResults = results.map(result => ({
      id: result.id,
      username: result.username,
      avatar: result.avatar || '/default-avatar.png',
      score: parseFloat(result.score).toFixed(2)
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error('Error fetching overall leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

// Get Skill-wise Leaderboard
const getSkillwiseLeaderboard = async (req, res) => {
  try {
    // Get unique assessment titles
    const [assessments] = await pool.query(`
      SELECT DISTINCT title
      FROM assessments
    `);

    // Fetch leaderboard for each assessment
    const skillLeaderboards = await Promise.all(assessments.map(async (assessment) => {
      const [leaderboard] = await pool.query(`
        SELECT 
          u.id, 
          u.name AS username, 
          u.profile_picture AS avatar, 
          COALESCE(ar.score, 0) AS score
        FROM users u
        JOIN assessment_reports ar ON u.id = ar.user_id
        WHERE ar.title = ?
        ORDER BY score DESC
        LIMIT 100
      `, [assessment.title]);

      // Format leaderboard data
      const formattedLeaderboard = leaderboard.map(result => ({
        id: result.id,
        username: result.username,
        avatar: result.avatar || '/default-avatar.png',
        score: parseFloat(result.score).toFixed(2)
      }));

      return {
        skillId: assessment.title, // Use title as skillId
        skillName: assessment.title,
        leaderboard: formattedLeaderboard
      };
    }));

    res.json(skillLeaderboards);
  } catch (error) {
    console.error('Error fetching skill-wise leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch skill leaderboards' });
  }
};

// Get User's Personal Ranking - updated to find the latest logged-in user
const getUserRanking = async (req, res) => {
  try {
    // Use the user ID from the authenticated request
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    // Total global score and ranking
    const [globalRankResult] = await pool.query(`
      WITH UserScores AS (
        SELECT 
          user_id, 
          COALESCE(SUM(score), 0) AS total_score,
          RANK() OVER (ORDER BY COALESCE(SUM(score), 0) DESC) AS global_rank
        FROM assessment_reports
        GROUP BY user_id
      )
      SELECT 
        total_score AS totalScore, 
        global_rank AS globalRank
      FROM UserScores
      WHERE user_id = ?
    `, [userId]);

    // Unique assessments completed
    const [skillsMasteredResult] = await pool.query(`
      SELECT COUNT(DISTINCT title) AS skillsMastered
      FROM assessment_reports
      WHERE user_id = ? AND score > 0
    `, [userId]);

    // Debugging logs
    console.log('User ID:', userId);
    console.log('Global Rank Result:', globalRankResult);
    console.log('Skills Mastered Result:', skillsMasteredResult);

    const userRanking = {
      totalScore: globalRankResult[0]?.totalScore ? parseFloat(globalRankResult[0].totalScore).toFixed(2) : '0.00',
      globalRank: globalRankResult[0]?.globalRank || 'N/A',
      skillsMastered: skillsMasteredResult[0].skillsMastered
    };

    console.log('User Ranking:', userRanking);

    res.json(userRanking);
  } catch (error) {
    console.error('Error fetching user ranking:', error);
    res.status(500).json({ error: 'Failed to fetch user ranking' });
  }
};

module.exports = {
  getOverallLeaderboard,
  getSkillwiseLeaderboard,
  getUserRanking
};