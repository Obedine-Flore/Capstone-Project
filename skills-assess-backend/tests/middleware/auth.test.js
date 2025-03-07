const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../server'); // Adjust path if needed

// Make sure this matches your actual JWT secret or use a test secret
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret123';

describe('Auth Middleware', () => {
  // Clean up after all tests
  afterAll(done => {
    if (app.close) {
      app.close(() => {
        done();
      });
    } else {
      done();
    }
  });

  it('should pass if token is valid', async () => {
    // Create a valid token with proper payload structure
    const token = jwt.sign(
      { 
        user: { 
          id: 1, 
          email: 'test@example.com' 
        } 
      }, 
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = await request(app)
      .get('/api/profile') // Make sure this endpoint exists and uses auth middleware
      .set('Authorization', `Bearer ${token}`);

    // Check for successful authentication (not just "not 401")
    expect(response.statusCode).not.toBe(401);
  });

  it('should fail if no token is provided', async () => {
    const response = await request(app).get('/api/profile');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('No token, authorization denied');
  });

  it('should fail if token is invalid', async () => {
    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Token is not valid');
  });
  
  it('should fail if token is expired', async () => {
    // Create an expired token
    const token = jwt.sign(
      { user: { id: 1 } }, 
      JWT_SECRET,
      { expiresIn: '0s' } // Immediately expired
    );
    
    // Wait to ensure token expiration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Token is not valid');
  });
});
