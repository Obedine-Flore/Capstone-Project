const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get user assessment history
router.get('/history', async (req, res) => {
    const userId = req.query.userId;
    
    try {
        const query = `
            SELECT 
                ua.id,
                ua.user_id,
                ua.assessment_id,
                ua.score,
                ua.completed_at,
                a.title
            FROM user_assessments ua
            JOIN assessments a ON ua.assessment_id = a.id
            WHERE ua.user_id = ?
            ORDER BY ua.completed_at DESC
        `;
        
        const [rows] = await pool.query(query, [userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching assessment history:', error);
        res.status(500).json({ message: 'Error fetching assessment history' });
    }
});

module.exports = router;