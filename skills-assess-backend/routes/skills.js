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
    
    // 1. Get user's low-scoring assessments (below 70)
    const [lowScoreAssessments] = await connection.query(`
      SELECT 
        ua.assessment_id, 
        ua.score, 
        s.name, 
        s.category, 
        s.description, 
        s.difficulty 
      FROM user_assessments ua
      JOIN all_skills s ON ua.assessment_id = s.id
      WHERE ua.user_id = ? AND ua.score < 70
      ORDER BY ua.score ASC, ua.completed_at DESC
    `, [userId]);
    
    console.log('Low Score Assessments:', lowScoreAssessments);
    
    // Format the low-score skills
    const lowScoreSkills = lowScoreAssessments.map(assessment => ({
      id: assessment.assessment_id,
      name: assessment.name,
      category: assessment.category,
      description: assessment.description,
      difficulty: assessment.difficulty,
      previous_score: assessment.score,
      needs_improvement: true
    }));
    
    // Calculate how many new skills we need to fetch
    const remainingSkillsNeeded = Math.max(0, limit - lowScoreSkills.length);
    
    let recommendedSkills = lowScoreSkills;
    
    // Only fetch new skills if we need more to reach the limit
    if (remainingSkillsNeeded > 0) {
      // 2. Get user's assessment history for category preferences
      const [assessments] = await connection.query(`
        SELECT ua.assessment_id, s.category, s.difficulty
        FROM user_assessments ua
        JOIN all_skills s ON ua.assessment_id = s.id
        WHERE ua.user_id = ?
        ORDER BY ua.completed_at DESC
      `, [userId]);
      
      // Get categories user has shown interest in
      const userCategories = [...new Set(assessments.map(a => a.category))];
      const categoriesForQuery = userCategories.length > 0 ? userCategories : ['Cognitive Skills']; // Default
      
      // Get IDs of all assessments the user has taken (to exclude them)
      const takenAssessmentIds = assessments.map(a => a.assessment_id);
      // Also exclude the low score skills we're already recommending
      const lowScoreIds = lowScoreSkills.map(s => s.id);
      const excludeIds = [...takenAssessmentIds, ...lowScoreIds];
      const excludeIdsPlaceholder = excludeIds.length > 0 ? excludeIds.map(() => '?').join(',') : '0';
      
      // Query for new recommended skills
      const newSkillsQuery = `
        SELECT 
          s.id,
          s.name,
          s.category,
          s.description,
          s.difficulty,
          COUNT(DISTINCT ua.id) AS popularity,
          COALESCE(AVG(ua.score), 0) AS avg_score
        FROM all_skills s
        LEFT JOIN user_assessments ua ON s.id = ua.assessment_id
        WHERE 
          s.id NOT IN (${excludeIdsPlaceholder})
          AND s.category IN (${categoriesForQuery.map(() => '?').join(',')})
        GROUP BY s.id
        ORDER BY
          CASE WHEN s.category IN (${categoriesForQuery.map(() => '?').join(',')}) THEN 1 ELSE 2 END,
          popularity DESC,
          avg_score ASC
        LIMIT ?
      `;
      
      // Combine all query parameters
      const queryParams = [
        ...excludeIds,
        ...categoriesForQuery,
        ...categoriesForQuery,
        remainingSkillsNeeded
      ];
      
      const [newSkills] = await connection.query(newSkillsQuery, queryParams);
      
      // Combine both sets of skills
      recommendedSkills = [
        ...lowScoreSkills,
        ...newSkills.map(skill => ({
          id: skill.id,
          name: skill.name,
          category: skill.category,
          description: skill.description,
          difficulty: skill.difficulty,
          popularity: skill.popularity,
          avg_score: skill.avg_score,
          is_new: true
        }))
      ];
    }
    
    // Apply pagination to the combined results
    const paginatedSkills = recommendedSkills.slice(offset, offset + limit);
    
    // Calculate total for pagination
    const total = recommendedSkills.length;
    const hasMore = offset + paginatedSkills.length < total;
    
    connection.release();
    
    res.json({
      skills: paginatedSkills,
      total,
      hasMore,
      currentPage: page
    });
    
  } catch (error) {
    console.error('Error fetching recommended skills:', error);
    res.status(500).json({ message: 'Error fetching recommended skills' });
  }
});

// Add this temporary route to check your database
router.get('/recommended-skills', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;
    
    // Parse skill IDs that need improvement
    const skillIds = req.query.skillIds ? req.query.skillIds.split(',').map(id => parseInt(id)) : [];
    
    // Parse user interests and recent assessments from frontend
    const userInterests = req.query.userInterests ? req.query.userInterests.split(',') : [];
    const recentAssessments = req.query.recentAssessments ? req.query.recentAssessments.split(',').map(id => parseInt(id)) : [];
    
    const connection = await pool.getConnection();
    
    try {
      // 1. First get the low-score skills (they take priority)
      let lowScoreSkills = [];
      if (skillIds.length > 0) {
        const placeholders = skillIds.map(() => '?').join(',');
        const [lowScoreResults] = await connection.query(`
          SELECT 
            s.*,
            (SELECT COUNT(*) FROM user_assessments WHERE assessment_id = s.id) as assessment_count,
            true as needs_improvement
          FROM all_skills s
          WHERE s.id IN (${placeholders})
          ${category ? "AND s.category = ?" : ""}
          ${search ? "AND (s.name LIKE ? OR s.description LIKE ?)" : ""}
          ORDER BY FIELD(s.id, ${placeholders})
        `, [
          ...skillIds,
          ...(category ? [category] : []),
          ...(search ? [`%${search}%`, `%${search}%`] : []),
          ...skillIds
        ]);
        
        lowScoreSkills = lowScoreResults.map(skill => ({
          ...skill,
          needs_improvement: true
        }));
      }
      
      // 2. Get skills related to user's completed skills
      const [userCompletedSkillIds] = await connection.query(`
        SELECT DISTINCT assessment_id as skill_id
        FROM user_assessments
        WHERE user_id = ? AND score >= 70
      `, [userId]);
      
      const completedIds = userCompletedSkillIds.map(item => item.skill_id).filter(Boolean);
      
      let relatedSkills = [];
      if (completedIds.length > 0) {
        // Get skills that have prerequisites or related skills matching user's completed skills
        const [relatedResults] = await connection.query(`
          SELECT 
            s.*,
            (SELECT COUNT(*) FROM user_assessments WHERE assessment_id = s.id) as assessment_count,
            true as related_to_completed
          FROM all_skills s
          WHERE 
            s.id NOT IN (${skillIds.length > 0 ? skillIds.map(() => '?').join(',') : '0'})
            AND s.id NOT IN (
              SELECT DISTINCT assessment_id
              FROM user_assessments
              WHERE user_id = ?
            )
            ${category ? "AND s.category = ?" : ""}
            ${search ? "AND (s.name LIKE ? OR s.description LIKE ?)" : ""}
            AND (
              s.prerequisites LIKE ? OR
              s.related_skills LIKE ?
            )
          LIMIT ?
        `, [
          ...(skillIds.length > 0 ? skillIds : []),
          userId,
          ...(category ? [category] : []),
          ...(search ? [`%${search}%`, `%${search}%`] : []),
          `%${completedIds.join('%')}%`,
          `%${completedIds.join('%')}%`,
          Math.max(0, limit - lowScoreSkills.length) // Get enough to fill the limit
        ]);
        
        relatedSkills = relatedResults.map(skill => ({
          ...skill,
          related_to_completed: true
        }));
      }
      
      // 3. Popular skills in user's preferred categories
      let popularSkills = [];
      if (lowScoreSkills.length + relatedSkills.length < limit) {
        // Get popular skills in categories the user has shown interest in
        const categoryCondition = userInterests.length > 0 
          ? `s.category IN (${userInterests.map(() => '?').join(',')})` 
          : category ? "s.category = ?" : "1=1";
        
        const [popularResults] = await connection.query(`
          SELECT 
            s.*,
            (SELECT COUNT(*) FROM user_assessments WHERE assessment_id = s.id) as assessment_count,
            true as popular_in_category
          FROM all_skills s
          WHERE 
            s.id NOT IN (${skillIds.length > 0 ? skillIds.map(() => '?').join(',') : '0'})
            AND s.id NOT IN (
              SELECT DISTINCT assessment_id
              FROM user_assessments
              WHERE user_id = ?
            )
            AND s.id NOT IN (${relatedSkills.map(s => s.id).length > 0 ? relatedSkills.map(() => '?').join(',') : '0'})
            AND ${categoryCondition}
            ${search ? "AND (s.name LIKE ? OR s.description LIKE ?)" : ""}
          ORDER BY assessment_count DESC
          LIMIT ?
        `, [
          ...(skillIds.length > 0 ? skillIds : []),
          userId,
          ...(relatedSkills.map(s => s.id).length > 0 ? relatedSkills.map(s => s.id) : []),
          ...(userInterests.length > 0 ? userInterests : category ? [category] : []),
          ...(search ? [`%${search}%`, `%${search}%`] : []),
          Math.max(0, limit - lowScoreSkills.length - relatedSkills.length) // Fill remaining slots
        ]);
        
        popularSkills = popularResults.map(skill => ({
          ...skill,
          popular_in_category: true
        }));
      }
      
      // 4. Combine all skills for final recommendations
      const recommendedSkills = [
        ...lowScoreSkills,
        ...relatedSkills,
        ...popularSkills
      ];
      
      // Apply pagination if needed
      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedSkills = recommendedSkills.slice(startIndex, endIndex);
      
      // Add proficiency data if available
      const skillsWithProficiency = await Promise.all(paginatedSkills.map(async (skill) => {
        // Get user's proficiency for this skill if they've taken assessments for it
        const [proficiencyData] = await connection.query(`
          SELECT AVG(score) as proficiency
          FROM user_assessments
          WHERE user_id = ? AND assessment_id = ?
        `, [userId, skill.id]);
        
        const proficiency = proficiencyData[0]?.proficiency;
        
        return {
          ...skill,
          proficiency: proficiency ? Math.round(proficiency) : Math.floor(Math.random() * 100) // Random for demo if no actual data
        };
      }));
      
      connection.release();
      
      res.json({
        skills: skillsWithProficiency,
        total: recommendedSkills.length,
        hasMore: endIndex < recommendedSkills.length,
        currentPage: page
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error fetching recommended skills:', error);
    res.status(500).json({ message: 'Error fetching recommended skills' });
  }
});

module.exports = router;