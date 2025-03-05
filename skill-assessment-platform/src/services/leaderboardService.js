import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/leaderboard';

export const leaderboardService = {
  getOverallLeaderboard: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/overall`);
      return response.data;
    } catch (error) {
      console.error('Error fetching overall leaderboard:', error);
      throw error;
    }
  },

  getSkillLeaderboards: async () => {
    try {
      // Fetch skill-wise leaderboard directly
      const skillsResponse = await axios.get(`${BASE_URL}/skills`);
      return skillsResponse.data;
    } catch (error) {
      console.error('Error fetching skill leaderboards:', error);
      return [];
    }
  },

  getUserRanking: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user-ranking`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user ranking:', error);
      return null;
    }
  }
};