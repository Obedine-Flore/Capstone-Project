// Import supertest and your app
const request = require('supertest');
const app = require('../server');

// Properly mock the database module
jest.mock('../config/db', () => {
  const mockQuery = jest.fn();
  return {
    promise: jest.fn().mockReturnValue({
      query: mockQuery
    }),
    query: mockQuery,
    end: jest.fn()
  };
});

// Import the mocked db module
const connection = require('../config/db');

describe('Assessment Routes', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Clean up after all tests
  afterAll(() => {
    // Close any open handles
    app.close && app.close();
  });

  it('should GET /api/assessments and return assessments', async () => {
    // Mock the database response for this specific test
    const mockAssessments = [{ id: 1, name: 'Test Assessment' }];
    connection.promise().query.mockResolvedValueOnce([mockAssessments]);

    const response = await request(app).get('/api/assessments');
    
    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockAssessments);
    expect(connection.promise().query).toHaveBeenCalledTimes(1);
  });

  it('should POST /api/assessments/:assessmentId/submit and return success', async () => {
    const assessmentId = 1;
    const userId = 1;
    const score = 80;
    const total = 100;

    // Mock the database response for this specific test
    connection.promise().query.mockResolvedValueOnce([{ insertId: 123 }]);

    const response = await request(app)
      .post(`/api/assessments/${assessmentId}/submit`)
      .send({ userId, score, total });

    // Assertions
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Assessment submitted successfully',
      assessmentId: assessmentId,
      score: score,
      total: total,
      id: 123,
    });
    expect(connection.promise().query).toHaveBeenCalledTimes(1);
  });
});
