import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-green-500">
      <nav className="flex justify-between items-center py-4 px-8 bg-white">
      <div className="flex items-center">
        <a href="/" className="text-gray-600 hover:text-gray-800"><span className="text-2xl font-bold">
          <span className="text-green-600">Skills</span>
          <span className="text-gray-600">Assess</span>
        </span></a>
      </div>

        <div className="flex items-center space-x-8">
          <a href="#" className="text-green-600 hover:text-gray-800">About Us</a>
          <a href="/ContactUs" className="text-gray-600 hover:text-gray-800">Contact</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800">Log In</button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Sign Up
          </button>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-12 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
          
          <p className="text-gray-600 text-xl mb-8">
            Trusted by top universities and industries
            <br />
            around the world.
          </p>
          
          <div className="flex justify-center mb-8">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRimrMWSsaK8oYOHl6FVUamWxXjJ-MWaG5KTQ&s" 
              alt="SkillsAssess Frog Mascot" 
              className="w-64 h-64 object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;