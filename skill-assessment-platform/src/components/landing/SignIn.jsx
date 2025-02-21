import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';

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
        
        // Then use the login function from your context
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
          Sign In
        </h2>
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
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          <div className="mt-4 text-center">
            <a href="#" className="text-green-600 hover:underline text-sm">
              Forgot password?
            </a>
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">
              Don't have an account?{" "}
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