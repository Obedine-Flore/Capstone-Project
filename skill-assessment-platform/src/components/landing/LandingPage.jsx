import React from 'react';

//import { Button } from '@/components/ui/button';

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white">
      <div className="flex items-center">
        <a href="#" className="text-gray-600 hover:text-gray-800"><span className="text-2xl font-bold">
          <span className="text-green-600">Skills</span>
          <span className="text-gray-600">Assess</span>
        </span></a>
      </div>
      
      <div className="flex items-center space-x-8">
        <a href="/AboutUs" className="text-gray-600 hover:text-gray-800">About Us</a>
        <a href="/ContactUs" className="text-gray-600 hover:text-gray-800">Contact</a>
      </div>
      
      <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/SignIn")} className="text-gray-600 hover:text-gray-800">Log In</button>
          <button onClick={() => navigate("/SignUp")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Sign Up
          </button>
      </div>
    </nav>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-green-500">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="max-w-xl">
              <h1 className="text-6xl font-bold mb-8">
                The best way
                <br />
                to assess your
                <br />
                market readiness
              </h1>
              
              <p className="text-gray-600 text-md mb-8">
                SkillsAssess is a tool that assesses and help you improve your
                21st century skills in order to build your job market readiness.
              </p>
              
              <div className="flex items-center space-x-4">
                <button onClick={() => navigate("/SignUp")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                Create an Account
                </button>
              </div>
            </div>
            
            <div className="flex justify-center mb-8">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRimrMWSsaK8oYOHl6FVUamWxXjJ-MWaG5KTQ&s" 
              alt="SkillsAssess Frog Mascot" 
              className="w-68 h-72 object-cover"
            />
            </div>
          </div>
          
          <div className="text-center text-gray-600 text-xl">
            Trusted by top universities and industries
            <br />
            around the world.
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;