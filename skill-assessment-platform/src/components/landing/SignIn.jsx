import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making API calls

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // API URL (Replace with your actual backend URL)
  const API_URL = 'http://localhost:5000/auth/login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsLoading(true);

      const response = await axios.post(API_URL, { email, password });
      console.log('Login successful:', response.data);

      // Store token in localStorage or cookies (optional, depending on your app)
      localStorage.setItem('authToken', response.data.token);

      // Redirect user to a protected page (e.g., dashboard)
      window.location.href = '/dashboard';

    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Sign In</h2>
        {error && (
          <div className="mb-4 p-2 text-red-600 bg-red-50 rounded text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="rememberMe" className="text-gray-700">
              Remember Me
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          <div className="mt-4 text-center">
            <a href="#" className="text-green-600 hover:underline text-sm">
              Forgot password?
            </a>
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-green-600 hover:underline">
                Sign Up
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
