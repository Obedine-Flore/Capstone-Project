import React, { useState } from 'react';
import axios from 'axios';  // Import Axios to make API calls
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // API URL
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
      // Alternatively, I could store the user data or token if needed
      window.location.href = '/SignIn'; // Redirect to the sign-in page
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Error during registration:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link 
              to="/" 
              className="flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ChevronLeft className="mr-2" />
              Back to Landing Page
            </Link>
          </div>
        </div>
      </nav>

      {/* Signup Form Container */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-green-600">
            Create an Account
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mr-3 text-green-600 rounded focus:ring-green-500"
                required
              />
              <label htmlFor="terms" className="text-gray-700 text-sm">
                I agree with the{' '}
                <a 
                  href="/terms" 
                  className="text-green-600 hover:underline font-medium"
                >
                  terms and conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-center text-sm mt-2">
                {error}
              </p>
            )}

            {/* Sign In Link */}
            <div className="text-center mt-4">
              <span className="text-gray-600 text-sm">
                Already have an account?{' '}
                <a 
                  href="/SignIn" 
                  className="text-green-600 hover:underline font-medium"
                >
                  Sign In
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
