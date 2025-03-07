const request = require('supertest');
const app = require('../server'); // Make sure this path is correct

describe('Route Tests', () => {
  // Close server after all tests
  afterAll(done => {
    if (app.close) {
      app.close(() => {
        done();
      });
    } else {
      done();
    }
  });

  it('should test the /api/test endpoint', async () => {
    const response = await request(app).get('/api/test');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('API is working');
  });

  // Add a test to check if the server responds to unknown routes
  it('should handle unknown routes', async () => {
    const response = await request(app).get('/api/nonexistent-route');
    expect(response.statusCode).toBe(404);
  });
});