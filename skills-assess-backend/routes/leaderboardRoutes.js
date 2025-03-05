const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const leaderboardController = require('../controllers/LeaderboardController');

// Ensure these routes match exactly what you're calling in the frontend
router.get('/overall', leaderboardController.getOverallLeaderboard);
router.get('/skills', leaderboardController.getSkillwiseLeaderboard);
router.get('/user-ranking', authMiddleware, leaderboardController.getUserRanking);

module.exports = router;