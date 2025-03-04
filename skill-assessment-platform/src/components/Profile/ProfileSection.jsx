import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profilePic from "../../assets/profile.jpg";
import EditProfile from "./EditProfile";
import axios from "axios";
import { Link } from 'react-router-dom';

const ProfileSection = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null); // Set to null initially
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-6">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between px-8 py-6">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex items-center text-green-600 hover:text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          <h2 className="text-green-700 text-xl font-bold text-left">Profile</h2>
          <div className="flex flex-col items-center mt-4">
          <img
            src={userData.profile_picture ? `http://localhost:5000/${userData.profile_picture}` : profilePic}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />
            <h3 className="mt-4 text-lg font-bold">{userData?.name || "Unknown User"}</h3>
            <p className="text-gray-600">{userData?.email || "No email available"}</p>
            <p className="text-gray-500 text-sm mt-2">{userData?.bio || "No bio provided"}</p>
          </div>

          <div className="mt-6 text-left">
            <h4 className="text-lg font-bold">Skills</h4>
            {userData?.skills && userData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-3 mt-2">
                {userData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-green-500 text-white px-4 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills listed</p>
            )}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {isEditing && (
        <EditProfile
          userData={userData}
          onClose={() => setIsEditing(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default ProfileSection;
