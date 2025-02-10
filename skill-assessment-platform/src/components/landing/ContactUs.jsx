import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

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
          <a href="/AboutUs" className="text-gray-600 hover:text-gray-800">About Us</a>
          <a href="#" className="text-green-600 hover:text-gray-800">Contact</a>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800">Log In</button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Sign Up
          </button>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-12 max-w-5xl mx-auto flex items-center">
          <div className="w-1/2 pr-8">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRimrMWSsaK8oYOHl6FVUamWxXjJ-MWaG5KTQ&s" 
              alt="SkillsAssess Frog Mascot" 
              className="w-full object-contain"
            />
          </div>
          
          <div className="w-1/2 pl-8">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-gray-600 text-xl mb-8">Stay in touch with us</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-600">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter Message..."
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;