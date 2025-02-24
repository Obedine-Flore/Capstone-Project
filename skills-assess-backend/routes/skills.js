const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const auth = require('../middleware/auth'); // Assuming you have auth middleware

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Get all skills with pagination and filtering
router.get('/api/all-skills', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = `
      SELECT 
        s.id,
        s.name,
        s.category,
        s.description,
        s.difficulty,
        COUNT(DISTINCT a.id) as assessment_count
      FROM all_skills s
      LEFT JOIN assessments a ON s.id = a.assessment_id
    `;

    const queryParams = [];

    // Add WHERE clauses for filtering
    const whereConditions = [];
    if (category && category !== 'All') {
      whereConditions.push('s.category = ?');
      queryParams.push(category);
    }
    if (search) {
      whereConditions.push('(s.name LIKE ? OR s.description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    // Add GROUP BY, LIMIT and OFFSET
    query += `
      GROUP BY s.id
      ORDER BY s.name
      LIMIT ? OFFSET ?
    `;
    queryParams.push(limit, offset);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(DISTINCT s.id) as total
      FROM all_skills s
      ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
    `;

    const connection = await pool.getConnection();
    const [skills] = await connection.query(query, queryParams);
    const [countResult] = await connection.query(countQuery, queryParams.slice(0, -2));
    connection.release();

    const total = countResult[0].total;
    const hasMore = offset + skills.length < total;

    res.json({
      skills,
      total,
      hasMore,
      currentPage: page
    });

  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Error fetching skills' });
  }
});

// Get assessment history for a user
router.get('/api/assessment-history', auth, async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const query = `
      SELECT 
        a.id,
        a.assessment_id,
        a.score,
        a.completion_date,
        s.name as skill_name,
        s.category
      FROM assessments a
      JOIN all_skills s ON a.assessment_id = s.id
      WHERE a.user_id = ?
      ORDER BY a.completion_date DESC
    `;

    const connection = await pool.getConnection();
    const [assessments] = await connection.query(query, [userId]);
    connection.release();

    res.json(assessments);

  } catch (error) {
    console.error('Error fetching assessment history:', error);
    res.status(500).json({ message: 'Error fetching assessment history' });
  }
});

// Get recommended skills based on user's assessment history
router.get('/recommended-skills', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();

    // 1. Get user's assessment history
    const [assessments] = await connection.query(`
      SELECT ua.assessment_id, ua.score, s.category
      FROM user_assessments ua
      JOIN assessments a ON ua.assessment_id = a.id
      JOIN all_skills s ON a.id = s.id
      WHERE ua.user_id = ?
      ORDER BY ua.completed_at DESC
    `, [userId]);    

    // 2. Get categories user has shown interest in
    const userCategories = [...new Set(assessments.map(a => a.category))];

    // 3. Get skills that need improvement (score < 70)
    const lowScoreSkills = assessments
      .filter(a => a.score < 70)
      .map(a => a.assessment_id);

    // 4. Get related skills based on categories and difficulty
  const query = `
  SELECT 
    s.id,
    s.name,
    s.category,
    s.description,
    s.difficulty,
    COUNT(DISTINCT ua.id) AS popularity,
    AVG(ua.score) AS avg_score
  FROM all_skills s
  LEFT JOIN user_assessments ua ON s.id = ua.assessment_id
  WHERE 
    s.id NOT IN (SELECT assessment_id FROM user_assessments WHERE user_id = ?)
    AND (
      s.category IN (?)
      OR s.id IN (
        SELECT s2.id
        FROM all_skills s2
        WHERE s2.difficulty = (
          SELECT difficulty 
          FROM all_skills 
          WHERE id IN (?)
          LIMIT 1
        )
      )
    )
  GROUP BY s.id
  ORDER BY 
    CASE 
      WHEN s.category IN (?) THEN 1
      ELSE 2
    END,
    popularity DESC,
    avg_score ASC
  LIMIT ? OFFSET ?
`;

const [recommendedSkills] = await connection.query(query, [
  userId,
  userCategories,
  lowScoreSkills,
  userCategories,
  limit,
  offset
]);

    // Get total count for pagination
    const [countResult] = await connection.query(`
      SELECT COUNT(DISTINCT s.id) as total
      FROM all_skills s
      WHERE 
        s.id NOT IN (SELECT assessment_id FROM user_assessments WHERE user_id = ?)
        AND (
          s.category IN (?)
          OR s.id IN (
            SELECT s2.id
            FROM all_skills s2
            WHERE s2.difficulty = (
              SELECT difficulty 
              FROM all_skills 
              WHERE id IN (?)
              LIMIT 1
            )
          )
        )
    `, [userId, userCategories, lowScoreSkills]);

    connection.release();

    const total = countResult[0].total;
    const hasMore = offset + recommendedSkills.length < total;

    res.json({
      skills: recommendedSkills,
      total,
      hasMore,
      currentPage: page
    });

  } catch (error) {
    console.error('Error fetching recommended skills:', error);
    res.status(500).json({ message: 'Error fetching recommended skills' });
  }
});

module.exports = router;