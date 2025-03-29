const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Configure storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderPath = path.join(__dirname, '../uploads', req.params.type || 'general');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs only
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed!'), false);
    }
  }
});

// Apply middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Check if user is admin
router.get('/check-status', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = rows[0];
    
    res.json({
      isAdmin: Boolean(user.is_admin),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture
      }
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics for dashboard
router.get('/analytics', async (req, res) => {
  try {
    // Get total users
    const [userRows] = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = userRows[0].count;
    
    // Get total assessments
    const [assessmentRows] = await pool.query('SELECT COUNT(*) as count FROM assessments');
    const totalAssessments = assessmentRows[0].count;
    
    // Get total blog posts
    const [blogRows] = await pool.query('SELECT COUNT(*) as count FROM blog_posts');
    const totalBlogPosts = blogRows[0].count;
    
    // Get average assessment score
    const [scoreRows] = await pool.query('SELECT AVG(score) as avg_score FROM user_assessments');
    const averageScore = Math.round(scoreRows[0].avg_score || 0);
    
    // Get recent registrations
    const [recentUsers] = await pool.query(
      'SELECT id, name, email, profile_picture, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );
    
    // Get skill distribution
    const [skillRows] = await pool.query(`
      SELECT 
        s.name, 
        COUNT(DISTINCT us.user_id) as count
      FROM all_skills s
      JOIN userskills us ON s.id = us.skill_id
      GROUP BY s.name
      ORDER BY count DESC
      LIMIT 5
    `);
    
    res.json({
      totalUsers,
      totalAssessments,
      totalBlogPosts,
      averageScore,
      recentRegistrations: recentUsers,
      skillDistribution: skillRows
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Management Routes

// Get all users
router.get('/users', async (req, res) => {
  try {
    const search = req.query.search || '';
    
    let query = `
      SELECT u.*, 
      (SELECT COUNT(*) FROM userskills WHERE user_id = u.id) as skills_count,
      (SELECT GROUP_CONCAT(s.name) FROM userskills us JOIN all_skills s ON us.skill_id = s.id WHERE us.user_id = u.id) as skills
    FROM users u
    WHERE u.name LIKE ? OR u.email LIKE ?
    ORDER BY u.created_at DESC
    `;
    
    const [users] = await pool.query(query, [`%${search}%`, `%${search}%`]);
    
    // Process the skills into an array for each user
    const processedUsers = users.map(user => ({
      ...user,
      skills: user.skills ? user.skills.split(',') : [],
      is_admin: Boolean(user.is_admin)
    }));
    
    res.json(processedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const [users] = await pool.query(`
      SELECT u.*, 
      (SELECT GROUP_CONCAT(s.name) FROM userskills us JOIN all_skills s ON us.skill_id = s.id WHERE us.user_id = u.id) as skills
      FROM users u 
      WHERE u.id = ?
    `, [userId]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    user.skills = user.skills ? user.skills.split(',') : [];
    user.is_admin = Boolean(user.is_admin);
    
    // Remove sensitive information
    delete user.password;
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, is_admin } = req.body;
    
    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, is_admin ? 1 : 0]
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      is_admin: Boolean(is_admin)
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, is_admin, bio, skills } = req.body;
    
    // Check if user exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update user basic info
      const updateFields = [];
      const updateValues = [];
      
      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }
      
      if (email) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }
      
      if (bio) {
        updateFields.push('bio = ?');
        updateValues.push(bio);
      }
      
      if (is_admin !== undefined) {
        updateFields.push('is_admin = ?');
        updateValues.push(is_admin ? 1 : 0);
      }
      
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push('password = ?');
        updateValues.push(hashedPassword);
      }
      
      // Only update if there are fields to update
      if (updateFields.length > 0) {
        updateValues.push(userId);
        await connection.query(
          `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
      }
      
      // Update skills if provided
      if (skills && Array.isArray(skills)) {
        // Remove old skills
        await connection.query('DELETE FROM userskills WHERE user_id = ?', [userId]);
        
        // Add new skills
        for (const skillName of skills) {
          // Check if skill exists
          const [existingSkills] = await connection.query(
            'SELECT id FROM all_skills WHERE name = ?',
            [skillName]
          );
          
          let skillId;
          if (existingSkills.length === 0) {
            // Create new skill
            const [newSkill] = await connection.query(
              'INSERT INTO all_skills (name, category, description, difficulty) VALUES (?, ?, ?, ?)',
              [skillName, 'General', 'User added skill', 'Intermediate']
            );
            skillId = newSkill.insertId;
          } else {
            skillId = existingSkills[0].id;
          }
          
          // Link skill to user
          await connection.query(
            'INSERT INTO userskills (user_id, skill_id) VALUES (?, ?)',
            [userId, skillId]
          );
        }
      }
      
      await connection.commit();
      
      // Get updated user
      const [updatedUsers] = await pool.query(`
        SELECT u.*, 
        (SELECT GROUP_CONCAT(s.name) FROM userskills us JOIN all_skills s ON us.skill_id = s.id WHERE us.user_id = u.id) as skills
        FROM users u 
        WHERE u.id = ?
      `, [userId]);
      
      const updatedUser = updatedUsers[0];
      updatedUser.skills = updatedUser.skills ? updatedUser.skills.split(',') : [];
      updatedUser.is_admin = Boolean(updatedUser.is_admin);
      
      // Remove sensitive information
      delete updatedUser.password;
      
      res.json(updatedUser);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if trying to delete own account
    if (parseInt(userId) === parseInt(req.user.id)) {
      return res.status(400).json({ message: 'Cannot delete own account' });
    }
    
    // Delete user
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assessment Management Routes

// Get all assessments
router.get('/assessments', async (req, res) => {
  try {
    const search = req.query.search || '';
    
    const [assessments] = await pool.query(`
      SELECT a.*,
      (SELECT COUNT(*) FROM questions WHERE assessment_id = a.id) as num_questions,
      (SELECT COUNT(*) FROM user_assessments WHERE assessment_id = a.id) as total_attempts,
      (SELECT AVG(score) FROM user_assessments WHERE assessment_id = a.id) as average_score
      FROM assessments a
      WHERE a.title LIKE ? OR a.description LIKE ?
      ORDER BY a.id DESC
    `, [`%${search}%`, `%${search}%`]);
    
    // Process assessments
    const processedAssessments = assessments.map(assessment => ({
      ...assessment,
      average_score: Math.round(assessment.average_score || 0),
      pass_rate: Math.round((assessment.total_attempts ? 
        (assessment.total_attempts * (assessment.average_score >= 70 ? 1 : 0) / assessment.total_attempts) : 0) * 100)
    }));
    
    res.json(processedAssessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assessment by ID with questions
router.get('/assessments/:id', async (req, res) => {
  try {
    const assessmentId = req.params.id;
    
    // Get assessment details
    const [assessments] = await pool.query(`
      SELECT a.*,
      (SELECT COUNT(*) FROM questions WHERE assessment_id = a.id) as num_questions,
      (SELECT COUNT(*) FROM user_assessments WHERE assessment_id = a.id) as total_attempts,
      (SELECT AVG(score) FROM user_assessments WHERE assessment_id = a.id) as average_score
      FROM assessments a
      WHERE a.id = ?
    `, [assessmentId]);
    
    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    const assessment = assessments[0];
    
    // Get questions
    const [questions] = await pool.query('SELECT * FROM questions WHERE assessment_id = ?', [assessmentId]);
    
    // Format questions
    const formattedQuestions = questions.map(q => ({
      ...q,
      options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]')
    }));
    
    res.json({
      ...assessment,
      average_score: Math.round(assessment.average_score || 0),
      pass_rate: Math.round((assessment.total_attempts ? 
        (assessment.total_attempts * (assessment.average_score >= 70 ? 1 : 0) / assessment.total_attempts) : 0) * 100),
      questions: formattedQuestions
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create assessment
// Create assessment
router.post('/assessments', async (req, res) => {
  try {
    const { title, description, category, level, time, attempts_allowed, questions } = req.body;
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Insert assessment
      const [result] = await connection.query(
        'INSERT INTO assessments (title, description, category, level, time, attempts_allowed) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, category, level, time, attempts_allowed]
      );
      
      const assessmentId = result.insertId;
      
      // Insert questions if provided
      if (questions && Array.isArray(questions) && questions.length > 0) {
        for (const question of questions) {
          // Ensure options is stored as JSON
          const options = Array.isArray(question.options) 
            ? JSON.stringify(question.options) 
            : question.options;
          
          await connection.query(
            'INSERT INTO questions (assessment_id, question_text, correct_answer, options, type) VALUES (?, ?, ?, ?, ?)',
            [
              assessmentId,
              question.question_text,
              question.correct_answer,
              options,
              question.type || 'multiple-choice'
            ]
          );
        }
      }
      
      await connection.commit();
      
      // Retrieve the created assessment with questions
      const [assessments] = await pool.query(`
        SELECT a.*,
        (SELECT COUNT(*) FROM questions WHERE assessment_id = a.id) as num_questions
        FROM assessments a
        WHERE a.id = ?
      `, [assessmentId]);
      
      const [questionRows] = await pool.query('SELECT * FROM questions WHERE assessment_id = ?', [assessmentId]);
      
      // Format questions
      const formattedQuestions = questionRows.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));
      
      res.status(201).json({
        ...assessments[0],
        questions: formattedQuestions
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Update assessment
router.put('/assessments/:id', async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const { title, description, category, level, time, attempts_allowed, questions } = req.body;
    
    // Check if assessment exists
    const [existingAssessments] = await pool.query('SELECT * FROM assessments WHERE id = ?', [assessmentId]);
    
    if (existingAssessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update assessment basic info
      await connection.query(
        'UPDATE assessments SET title = ?, description = ?, category = ?, level = ?, time = ?, attempts_allowed = ? WHERE id = ?',
        [title, description, category, level, time, attempts_allowed, assessmentId]
      );
      
      // Only update questions if questions array is provided and not empty
      if (questions && Array.isArray(questions) && questions.length > 0) {
        // Delete existing questions
        await connection.query('DELETE FROM questions WHERE assessment_id = ?', [assessmentId]);
        
        // Insert new questions
        for (const question of questions) {
          // Ensure options is stored as JSON
          const options = Array.isArray(question.options) 
            ? JSON.stringify(question.options) 
            : question.options;
          
          await connection.query(
            'INSERT INTO questions (assessment_id, question_text, correct_answer, options, type) VALUES (?, ?, ?, ?, ?)',
            [
              assessmentId,
              question.question_text,
              question.correct_answer,
              options,
              question.type || 'multiple-choice'
            ]
          );
        }
      }
      
      await connection.commit();
      
      // Get updated assessment with questions
      const [updatedAssessments] = await pool.query(`
        SELECT a.*,
        (SELECT COUNT(*) FROM questions WHERE assessment_id = a.id) as num_questions
        FROM assessments a
        WHERE a.id = ?
      `, [assessmentId]);
      
      // Only fetch questions if we're editing questions or need to return them
      const [questionRows] = await pool.query('SELECT * FROM questions WHERE assessment_id = ?', [assessmentId]);
      
      // Format questions
      const formattedQuestions = questionRows.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));
      
      res.json({
        ...updatedAssessments[0],
        questions: formattedQuestions
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Delete assessment
router.delete('/assessments/:id', async (req, res) => {
  try {
    const assessmentId = req.params.id;
    
    // Check if assessment exists
    const [existingAssessments] = await pool.query('SELECT * FROM assessments WHERE id = ?', [assessmentId]);
    
    if (existingAssessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Delete questions first (due to foreign key constraints)
      await connection.query('DELETE FROM questions WHERE assessment_id = ?', [assessmentId]);
      
      // Delete assessment
      await connection.query('DELETE FROM assessments WHERE id = ?', [assessmentId]);
      
      await connection.commit();
      
      res.json({ message: 'Assessment deleted successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Blog Management Routes

// Get all blog posts
router.get('/blog-posts', async (req, res) => {
  try {
    const search = req.query.search || '';
    
    const [posts] = await pool.query(`
      SELECT * FROM blog_posts
      WHERE title LIKE ? OR content LIKE ? OR author LIKE ? OR category LIKE ?
      ORDER BY date DESC
    `, [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]);
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blog post by ID
router.get('/blog-posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    const [posts] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    
    if (posts.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(posts[0]);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog post
router.post('/blog-posts', upload.single('image'), async (req, res) => {
  try {
    const { title, content, excerpt, author, category, read_time, featured } = req.body;
    
    // Get the image path if uploaded
    // Fix: Use relative path for storage in database
    const imagePath = req.file ? 
      req.file.path.replace(/\\/g, '/').replace(/^.*\/uploads/, 'uploads') : 
      null;
    
    // Insert blog post
    const [result] = await pool.query(
      'INSERT INTO blog_posts (title, content, excerpt, author, category, read_time, featured, image_path, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [title, content, excerpt, author, category, read_time, featured ? 1 : 0, imagePath]
    );
    
    res.status(201).json({
      id: result.insertId,
      title,
      content,
      excerpt,
      author,
      category,
      read_time,
      featured: Boolean(featured),
      image_path: imagePath,
      date: new Date()
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog post
router.put('/blog-posts/:id', upload.single('image'), async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, excerpt, author, category, read_time, featured } = req.body;
    
    // Check if blog post exists
    const [existingPosts] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    
    if (existingPosts.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Get the image path if uploaded
    let imagePath = existingPosts[0].image_path;
    if (req.file) {
      // Delete old image if it exists
      if (imagePath && fs.existsSync(path.join(__dirname, '..', imagePath))) {
        fs.unlinkSync(path.join(__dirname, '..', imagePath));
      }
      // Fix: Use relative path for storage in database
      imagePath = req.file.path.replace(/\\/g, '/').replace(/^.*\/uploads/, 'uploads');
    }
    
    // Update blog post
    await pool.query(
      'UPDATE blog_posts SET title = ?, content = ?, excerpt = ?, author = ?, category = ?, read_time = ?, featured = ?, image_path = ? WHERE id = ?',
      [title, content, excerpt, author, category, read_time, featured ? 1 : 0, imagePath, postId]
    );
    
    // Get updated post
    const [updatedPosts] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    
    res.json(updatedPosts[0]);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog post
router.delete('/blog-posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Check if blog post exists
    const [existingPosts] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    
    if (existingPosts.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Delete image if it exists
    const imagePath = existingPosts[0].image_path;
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    // Delete blog post
    await pool.query('DELETE FROM blog_posts WHERE id = ?', [postId]);
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Statistics Routes

// Get platform statistics
router.get('/statistics', async (req, res) => {
  try {
    // User statistics
    const [userStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as new_users_this_week,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users_this_month
      FROM users
    `);
    
    // Assessment statistics
    const [assessmentStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_assessments,
        AVG(time) as average_time
      FROM assessments
    `);
    
    // User assessment statistics
    const [userAssessmentStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_attempts,
        AVG(score) as average_score,
        COUNT(CASE WHEN score >= 70 THEN 1 END) / COUNT(*) * 100 as pass_rate
      FROM user_assessments
    `);
    
    // Blog statistics
    const [blogStats] = await pool.query(`
      SELECT 
        COUNT(*) as total_posts,
        COUNT(CASE WHEN date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as posts_this_month
      FROM blog_posts
    `);
    
    // Monthly assessment attempts (last 6 months)
    const [monthlyData] = await pool.query(`
      SELECT 
        DATE_FORMAT(completed_at, '%Y-%m') as month,
        COUNT(*) as attempts,
        AVG(score) as average_score
      FROM user_assessments
      WHERE completed_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month
    `);
    
    res.json({
      users: userStats[0],
      assessments: assessmentStats[0],
      attempts: userAssessmentStats[0],
      blog: blogStats[0],
      monthly_data: monthlyData
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact Messages Route

// Get all contact messages
router.get('/contact-messages', async (req, res) => {
  try {
    const [messages] = await pool.query(`
      SELECT * FROM contact_messages
      ORDER BY created_at DESC
    `);
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact message
router.delete('/contact-messages/:id', async (req, res) => {
  try {
    const messageId = req.params.id;
    
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [messageId]);
    
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Newsletter Subscribers Route

// Get all subscribers
router.get('/subscribers', async (req, res) => {
  try {
    const [subscribers] = await pool.query(`
      SELECT * FROM newsletter_subscribers
      ORDER BY created_at DESC
    `);
    
    res.json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add subscriber
router.post('/subscribers', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if subscriber already exists
    const [existingSubscribers] = await pool.query('SELECT * FROM newsletter_subscribers WHERE email = ?', [email]);
    
    if (existingSubscribers.length > 0) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    
    await pool.query('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);
    
    res.status(201).json({ message: 'Subscriber added successfully' });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete subscriber
router.delete('/subscribers/:id', async (req, res) => {
  try {
    const subscriberId = req.params.id;
    
    await pool.query('DELETE FROM newsletter_subscribers WHERE id = ?', [subscriberId]);
    
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export mailing list
router.get('/subscribers/export', async (req, res) => {
  try {
    const [subscribers] = await pool.query('SELECT email FROM newsletter_subscribers');
    
    // Format emails as CSV
    const emails = subscribers.map(sub => sub.email).join('\n');
    
    // Set response headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.setHeader('Content-Type', 'text/csv');
    
    res.send(emails);
  } catch (error) {
    console.error('Error exporting subscribers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// System Settings Routes

// Get current settings
router.get('/settings', async (req, res) => {
  try {
    const [settings] = await pool.query('SELECT * FROM system_settings');
    
    // Convert to key-value format
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings
router.put('/settings', async (req, res) => {
  try {
    const settings = req.body;
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        await connection.query(
          'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ' +
          'ON DUPLICATE KEY UPDATE setting_value = ?',
          [key, value, value]
        );
      }
      
      await connection.commit();
      
      res.json({ message: 'Settings updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Database Backup Route
router.post('/backup', async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.sql`;
    const backupPath = path.join(__dirname, '../backups', backupFileName);
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../backups'))) {
      fs.mkdirSync(path.join(__dirname, '../backups'), { recursive: true });
    }
    
    // Get database credentials from environment
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    
    // Command to create backup using mysqldump
    const cmd = `mysqldump -h ${DB_HOST} -u ${DB_USER} ${DB_PASSWORD ? `-p${DB_PASSWORD}` : ''} ${DB_NAME} > ${backupPath}`;
    
    // Execute the command
    const { exec } = require('child_process');
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating backup: ${error.message}`);
        return res.status(500).json({ message: 'Error creating backup' });
      }
      
      if (stderr) {
        console.error(`Backup stderr: ${stderr}`);
      }
      
      // Update last backup time in settings
      pool.query(
        'INSERT INTO system_settings (setting_key, setting_value) VALUES ("last_backup", ?) ' +
        'ON DUPLICATE KEY UPDATE setting_value = ?',
        [new Date().toISOString(), new Date().toISOString()]
      );
      
      res.json({ 
        message: 'Backup created successfully',
        filename: backupFileName,
        path: backupPath,
        size: fs.statSync(backupPath).size,
        timestamp: new Date().toISOString()
      });
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available backups
router.get('/backups', (req, res) => {
  try {
    const backupsDir = path.join(__dirname, '../backups');
    
    // Check if backups directory exists
    if (!fs.existsSync(backupsDir)) {
      return res.json([]);
    }
    
    // Get list of backup files
    const files = fs.readdirSync(backupsDir)
      .filter(file => file.endsWith('.sql'))
      .map(file => {
        const stats = fs.statSync(path.join(backupsDir, file));
        return {
          filename: file,
          size: stats.size,
          created_at: stats.mtime
        };
      })
      .sort((a, b) => b.created_at - a.created_at); // Sort newest first
    
    res.json(files);
  } catch (error) {
    console.error('Error fetching backups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download a backup
router.get('/backups/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const backupPath = path.join(__dirname, '../backups', filename);
    
    // Check if file exists
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ message: 'Backup file not found' });
    }
    
    // Set response headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/sql');
    
    // Stream the file
    const fileStream = fs.createReadStream(backupPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading backup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a backup
router.delete('/backups/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const backupPath = path.join(__dirname, '../backups', filename);
    
    // Check if file exists
    if (!fs.existsSync(backupPath)) {
      return res.status(404).json({ message: 'Backup file not found' });
    }
    
    // Delete the file
    fs.unlinkSync(backupPath);
    
    res.json({ message: 'Backup deleted successfully' });
  } catch (error) {
    console.error('Error deleting backup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// System health check
router.get('/system-check', async (req, res) => {
  try {
    const checks = [];
    
    // Check database connection
    try {
      const connection = await pool.getConnection();
      connection.release();
      checks.push({ name: 'Database Connection', status: 'ok' });
    } catch (error) {
      checks.push({ name: 'Database Connection', status: 'error', message: error.message });
    }
    
    // Check file system access
    try {
      const testDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      const testFile = path.join(testDir, 'test.txt');
      fs.writeFileSync(testFile, 'Test file for system check');
      fs.readFileSync(testFile, 'utf8');
      fs.unlinkSync(testFile);
      checks.push({ name: 'File System Access', status: 'ok' });
    } catch (error) {
      checks.push({ name: 'File System Access', status: 'error', message: error.message });
    }
    
    // Check disk space
    try {
      const { exec } = require('child_process');
      exec('df -h .', (error, stdout, stderr) => {
        if (error) {
          checks.push({ name: 'Disk Space', status: 'error', message: error.message });
        } else {
          // Parse df output to get disk usage
          const lines = stdout.trim().split('\n');
          const parts = lines[1].split(/\s+/);
          const usage = parts[4].replace('%', '');
          
          checks.push({ 
            name: 'Disk Space', 
            status: parseInt(usage) > 90 ? 'warning' : 'ok',
            details: {
              usage: `${usage}%`,
              free: parts[3],
              size: parts[1]
            }
          });
        }
      });
    } catch (error) {
      checks.push({ name: 'Disk Space', status: 'error', message: error.message });
    }
    
    // Check memory usage
    try {
      const os = require('os');
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memUsage = (usedMem / totalMem) * 100;
      
      checks.push({ 
        name: 'Memory Usage', 
        status: memUsage > 90 ? 'warning' : 'ok',
        details: {
          usage: `${memUsage.toFixed(2)}%`,
          free: `${Math.floor(freeMem / (1024 * 1024))} MB`,
          total: `${Math.floor(totalMem / (1024 * 1024))} MB`
        }
      });
    } catch (error) {
      checks.push({ name: 'Memory Usage', status: 'error', message: error.message });
    }
    
    res.json({
      timestamp: new Date().toISOString(),
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        uptime: Math.floor(process.uptime()),
        memoryUsage: process.memoryUsage()
      },
      checks
    });
  } catch (error) {
    console.error('Error performing system check:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;