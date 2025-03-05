// src/services/assessmentService.js
import api from './api';

export const assessmentService = {
  // Fetch all available assessments
  getAllAssessments: async () => {
    try {
      const response = await api.get('/assessments/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  },

  // Fetch user's assessment history
  getAssessmentHistory: async () => {
    try {
      // Decode token to get user ID
      const token = localStorage.getItem('token');
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;
      
      const response = await api.get(`/user-assessments/history?userId=${userId}`);
      
      // Format the response data
      return response.data.map(assessment => ({
        id: assessment.id,
        reportId: assessment.report_id,
        title: assessment.title,
        completion_date: assessment.completed_at,
        score: assessment.score,
        passed: assessment.score >= 70
      }));
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      throw error;
    }
  },

  // Start an assessment
  startAssessment: async (assessmentId) => {
    try {
      const response = await api.get(`/assessments/${assessmentId}/questions`);
      return response.data;
    } catch (error) {
      console.error('Error starting assessment:', error);
      throw error;
    }
  },

  // Submit assessment responses
  submitAssessment: async (assessmentId, responses) => {
    try {
      const response = await api.post(`/assessments/${assessmentId}/submit`, { responses });
      return response.data;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  }
};