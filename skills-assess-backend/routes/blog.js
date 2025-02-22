const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Get all blog posts
router.get('/api/blog-posts', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM blog_posts ORDER BY date DESC');
    console.log('Blog posts fetched:', rows); // Add this for debugging
    res.json(rows);
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get blog posts by category
router.get('/api/blog-posts/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const [rows] = await connection.promise().query(
      'SELECT * FROM blog_posts WHERE category = ? ORDER BY date DESC',
      [category]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching blog posts by category:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get featured blog posts
router.get('/api/blog-posts/featured', async (req, res) => {
  try {
    const [rows] = await connection.promise().query(
      'SELECT * FROM blog_posts WHERE featured = TRUE ORDER BY date DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching featured blog posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search blog posts
router.get('/api/blog-posts/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const searchTerm = `%${query}%`;
    const [rows] = await connection.promise().query(
      `SELECT * FROM blog_posts 
       WHERE title LIKE ? 
       OR excerpt LIKE ? 
       OR author LIKE ? 
       OR category LIKE ?
       ORDER BY date DESC`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );
    
    res.json(rows);
  } catch (err) {
    console.error('Error searching blog posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// In your blog.js routes file
router.get('/api/blog-posts/:id', async (req, res) => {
  try {
    const [rows] = await connection.query(
      'SELECT * FROM blog_posts WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      console.log('No blog post found with ID:', req.params.id);  // Log for debugging
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(rows[0]);  // Return the first result (post) as the response
  } catch (err) {
    console.error('Error fetching blog post:', err);  // Log the error for debugging
    res.status(500).json({ error: 'Server error' });
  }
});

// Subscribe to newsletter
router.post('/api/newsletter/subscribe', async (req, res) => {
    try {
      const { email } = req.body;
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }
      
      // Use a Promise wrapper if necessary
      const query = (sql, params) => {
        return new Promise((resolve, reject) => {
          connection.query(sql, params, (error, results) => {
            if (error) reject(error);
            resolve(results);
          });
        });
      };
      
      // Check if already subscribed
      const checkResults = await query(
        'SELECT * FROM newsletter_subscribers WHERE email = ?',
        [email]
      );
      
      if (checkResults.length > 0) {
        if (checkResults[0].status === 'unsubscribed') {
          // Re-subscribe
          await query(
            'UPDATE newsletter_subscribers SET status = ?, subscribed_at = CURRENT_TIMESTAMP WHERE email = ?',
            ['active', email]
          );
          return res.status(200).json({ message: 'Successfully re-subscribed' });
        }
        return res.status(409).json({ message: 'Already subscribed' });
      }
      
      // Add new subscriber
      await query(
        'INSERT INTO newsletter_subscribers (email) VALUES (?)',
        [email]
      );
      
      res.status(201).json({ message: 'Successfully subscribed' });
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;