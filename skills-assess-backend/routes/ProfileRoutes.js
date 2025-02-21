const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get user profile
router.get('/api/profile', async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user.id) {
            console.error("User not attached to request:", req.user);
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        // Get user profile excluding sensitive information
        const [users] = await pool.query(
            'SELECT id, name, email, bio, created_at FROM Users WHERE id = ?',
            [req.user.id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const user = users[0];
        
        // Get user skills
        const [skills] = await pool.query(
            `SELECT s.name 
             FROM Skills s
             JOIN userskills us ON s.id = us.skill_id
             WHERE us.user_id = ?`,
            [req.user.id]
        );
        
        // Format skills array
        user.skills = skills.map(skill => skill.name);
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update user profile
router.put('/api/profile/update', async (req, res) => {
    console.log('--------------------------------');
    console.log(req.user, "From profile update route");
    console.log('--------------------------------');

    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        
        const { name, email, bio, skills } = req.body;

        // Validate email format if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }
        }

        // Start a transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Update user profile
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

            // Only update if there are fields to update
            if (updateFields.length > 0) {
                const query = `UPDATE Users SET ${updateFields.join(', ')} WHERE id = ?`;
                updateValues.push(req.user.id);
                await connection.query(query, updateValues);
            }
            
            // If skills are provided, update them
            if (skills && Array.isArray(skills)) {
                // First remove existing skills
                await connection.query(
                    'DELETE FROM UserSkills WHERE user_id = ?',
                    [req.user.id]
                );
                
                // Add new skills
                for (const skillName of skills) {
                    // Check if skill exists, if not create it
                    const [existingSkills] = await connection.query(
                        'SELECT id FROM Skills WHERE name = ?',
                        [skillName]
                    );
                    
                    let skillId;
                    if (existingSkills.length === 0) {
                        const [result] = await connection.query(
                            'INSERT INTO Skills (name) VALUES (?)',
                            [skillName]
                        );
                        skillId = result.insertId;
                    } else {
                        skillId = existingSkills[0].id;
                    }
                    
                    // Add the skill to user
                    await connection.query(
                        'INSERT INTO UserSkills (user_id, skill_id) VALUES (?, ?)',
                        [req.user.id, skillId]
                    );
                }
            }
            
            // Get the updated user profile
            const [users] = await connection.query(
                'SELECT id, name, email, bio, created_at FROM Users WHERE id = ?',
                [req.user.id]
            );
            
            if (users.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'User not found' });
            }
            
            const user = users[0];
            
            // Get user skills
            const [updatedSkills] = await connection.query(
                `SELECT s.name 
                 FROM Skills s
                 JOIN UserSkills us ON s.id = us.skill_id
                 WHERE us.user_id = ?`,
                [req.user.id]
            );
            
            // Format skills array
            user.skills = updatedSkills.map(skill => skill.name);
            
            await connection.commit();
            res.json(user);
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;