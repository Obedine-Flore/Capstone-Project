import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import profilePic from "../../assets/profile.jpg";
import blogPic from "../../assets/blogimage.jpeg";
import axios from "axios";

const BlogLandingPage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No authentication token found, using default profile image");
        setIsLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-8 py-6">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 shadow-md bg-white rounded-lg">
        <h1 className="text-xl font-bold text-green-600">Skills<span className="text-gray-900">Assess</span></h1>
        <nav className="space-x-6">
          <a href="/dashboard" className="text-green-700 font-semibold">Dashboard</a>
          <a href="/assessments" className="text-gray-700">Assessments</a>
          <a href="/peerreviews" className="text-gray-700">Peer Reviews</a>
          <a href="#" className="text-gray-700">Blog</a>  
        </nav>
        <Link to="/profile">
          <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
            {userData && userData.profile_picture ? (
              <img
                src={userData.profile_picture.startsWith('http') 
                  ? userData.profile_picture 
                  : `http://localhost:5000/${userData.profile_picture.startsWith('/') ? userData.profile_picture.substring(1) : userData.profile_picture}`}
                alt="Profile"
                className="w-10 h-10 object-cover"
                onError={(e) => {
                  console.log("Profile image failed to load");
                  e.target.src = profilePic;
                }}
              />
            ) : (
              <img 
                src={profilePic} 
                alt="Profile" 
                className="w-10 h-10 object-cover" 
              />
            )}
          </div>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto p-8">
        <h2 className="text-xl font-semibold text-green-700">Insights from our team</h2>
        <p className="text-gray-600">Advanced Assessment Tools and Features for Skill-Driven Learners</p>
        <input
          type="text"
          placeholder="🔍 Most in-demand skills..."
          className="mt-4 w-full max-w-md border p-2 rounded-lg"
        />

        <div className="flex gap-8 mt-8">
          {/* Sidebar */}
          <aside className="w-1/4 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700">Blog Topics</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Company</li>
                <li>Design</li>
                <li>Technology</li>
                <li>Crypto</li>
                <li>Artificial Intelligence</li>
                <li>Work</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Guide and Tools</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Guidelines</li>
                <li>Mentorship</li>
                <li>Tutorial</li>
                <li>Training</li>
                <li>Career</li>
                <li>Self Care</li>
              </ul>
            </div>
          </aside>

          {/* Blog Section */}
          <section className="w-3/4">
            {[1, 2, 3].map((item) => (
              <article key={item} className="flex gap-4 mb-8 bg-white p-4 rounded-lg shadow">
                <div className="w-1/4 bg-green-500 h-32 rounded-lg">
                <img
                  src={blogPic}
                  alt="Profile"
                  className="w-500 h-32 rounded-lg object-cover shadow-md"
                  />
                </div>
                <div className="w-3/4">
                  <p className="text-green-600">Mar 1</p>
                  <h3 className="text-xl font-bold">Advanced Skill Assessment Tools and Features for Ambitious Learners</h3>
                  <p className="text-gray-600 text-sm">I'm always exploring new and innovative ways to enhance learning experiences...</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-200 rounded">Tools</span>
                    <span className="ml-4">By Anissa Tegawe</span>
                    <span className="ml-4 text-green-600">● 7 min read</span>
                  </div>
                </div>
              </article>
            ))}
            <button className="bg-green-600 text-white py-2 px-4 rounded-lg">See More</button>
          </section>
        </div>
      </main>

      {/* Newsletter */}
      <section className="bg-green-100 p-8 text-center">
        <h3 className="text-lg font-semibold text-green-700">Stay up to date</h3>
        <p className="text-gray-700 text-xl font-bold">Join Our Newsletter</p>
        <div className="mt-4 flex justify-center">
          <input type="email" placeholder="Enter your email.." className="border p-2 rounded-l-lg w-1/3" />
          <button className="bg-green-600 text-white p-2 rounded-r-lg">Submit</button>
        </div>
        <p className="text-xs text-gray-500 mt-2">*You can unsubscribe anytime</p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center p-8 mt-12 rounded-lg">
        <h1 className="text-green-700 font-bold">SkillsAssess</h1>
        <p className="text-sm text-gray-600">&copy; 2023 Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </footer>
    </div>
  );
};

export default BlogLandingPage;