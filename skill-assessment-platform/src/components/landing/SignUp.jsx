import React, { useState } from 'react';
import axios from 'axios';  // Import Axios to make API calls

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // API URL (Replace with your actual backend URL)
  const API_URL = 'http://localhost:5000/auth/register';

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAgreed) {
      alert('Please agree to the terms and conditions');
      return;
    }

    // Prepare user data
    const userData = { name, email, password };

    try {
      setIsLoading(true);
      const response = await axios.post(API_URL, userData);
      console.log('User registered:', response.data);
      // Handle successful registration (e.g., redirect to login page or show a success message)
      // You can also store the user data or token if needed
      window.location.href = '/SignIn'; // Redirect to the sign-in page
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Error during registration:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
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
              id="terms"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mr-2 text-green-600 focus:ring-green-500"
              required
            />
            <label htmlFor="terms" className="text-gray-700 text-sm">
              I agree with the terms and conditions
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
          {error && <p className="text-red-600 text-center mt-4">{error}</p>}
          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">
              Already have an account?{' '}
              <a href="/SignIn" className="text-green-600 hover:underline">
                Sign In
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
