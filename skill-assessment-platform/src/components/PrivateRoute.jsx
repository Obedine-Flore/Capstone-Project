import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';

// Explicitly destructure children from props
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Check if user is authenticated and is an admin
        const response = await axios.get('http://localhost:5000/api/admin/check-status', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setIsAuthenticated(true);
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error('Error verifying admin status:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/SignIn" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;