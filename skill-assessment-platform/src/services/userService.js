// src/services/userService.js
import api from './api';

export const userService = {
  // Fetch user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
};