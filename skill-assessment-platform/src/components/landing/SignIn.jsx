import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const API_URL = "http://localhost:5000/auth/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, { 
        email, 
        password 
      });

      // Log the response for debugging
      console.log('Server response:', response.data);

      // Check if we have a response with data
      if (response.data) {
        // Extract user data first
        const userData = response.data.user || response.data;
        
        // Get token
        const token = response.data.token;
        
        // Then use the login function from my context
        login(userData, token);
        
        // Navigate to dashboard
        navigate("/dashboard");
        
        return; // Exit the function after successful login
      }

      // If we reach here, something went wrong
      throw new Error("Invalid response format from server");
      
    } catch (error) {
      console.error("Login error details:", error);
      
      // Handle different types of errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        setError(error.response.data.message || 
                error.response.data.error || 
                "Server error: " + error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError(error.message || "Failed to login. Please try again.");
      }
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
  
        {/* SignIn Form Container */}
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6 text-green-600">
              Sign In
            </h2>

            {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-50 rounded-lg text-sm flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
            
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-3 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="rememberMe" className="text-gray-700 text-sm">
                Remember Me
              </label>
            </div>
            <Link 
              to="/forgot-password" 
              className="text-green-600 hover:underline text-sm font-medium"
            >
              Forgot password?
            </Link>
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <span className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-green-600 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </span>
          </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default SignIn;