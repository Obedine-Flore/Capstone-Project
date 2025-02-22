const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const authMiddleware = require('./middleware/auth');
const auth = require('./routes/auth');
const ProfileRoutes = require('./routes/ProfileRoutes');
const blogRoutes = require('./routes/blog');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const connection = require('./config/db');
const userAssessmentRoutes = require('./routes/userAssessmentRoutes');

// Configure storage for blog images
const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blog/');
  },
  filename: (req, file, cb) => {
    cb(null, 'blog-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadBlogImage = multer({ 
  storage: blogStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  }
});

// Middleware

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: false }));
app.use('/api/profile', authMiddleware);
app.use('/', ProfileRoutes);
app.use(blogRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// ✅ Ensure Auth Routes Are Loaded
const authRoutes = require("./routes/auth"); // Adjust path if needed
app.use("/auth", authRoutes);

app.use('/api/user-assessments', userAssessmentRoutes);

// Import routes
const assessmentRoutes = require('./routes/assessmentRoutes');
app.use('/api/assessments', assessmentRoutes);

app.get('/api/assessments', async (req, res) => {
  try {
    const [assessments] = await connection.promise().query('SELECT * FROM assessments');
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

app.post('/api/assessments/:assessmentId/submit', authenticateUser, (req, res) => {
  const { assessmentId } = req.params;
  const { userId, score, total } = req.body;
  
  // If you're using middleware for authentication, you might get userId from req.user instead
  // const userId = req.user.id;
  
  const query = `
    INSERT INTO user_assessments (user_id, assessment_id, score) 
    VALUES (?, ?, ?)
  `;
  
  connection.query(query, [userId, assessmentId, score], (err, results) => {
    if (err) {
      console.error('Error storing assessment result:', err);
      return res.status(500).json({ error: 'Failed to save assessment result' });
    }
    
    return res.json({
      success: true,
      message: 'Assessment submitted successfully',
      assessmentId,
      score,
      total,
      id: results.insertId
    });
  });
});

app.use('/api/profile', authMiddleware);

app.get("/api/profile", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Authentication middleware example (if you're using JWT)
function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No bearer token found in request');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Token received:', token.substring(0, 15) + '...');
  
  try {
    // Log the secret being used (first few chars only for security)
    console.log('Using secret:', process.env.JWT_SECRET ? 
                `${process.env.JWT_SECRET.substring(0, 3)}...` : 'NOT DEFINED');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully for user:', decoded.id || 'unknown');
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
