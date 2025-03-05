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

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update the URL to match your actual backend endpoint
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      const result = await response.json();
      
      if (response.ok) {
        // Use state to manage success message instead of alert
        setSuccessMessage("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset form
        
        // Optional: Clear success message after a few seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        // Handle specific error messages
        setSuccessMessage(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSuccessMessage("Network error. Please try again.");
    }
  };
  
  // In the JSX, add a success message display
  {successMessage && (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
      {successMessage}
    </div>
  )}  

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
        <button onClick={() => navigate("/SignIn")} className="text-gray-600 hover:text-gray-800">Log In</button>
        <button onClick={() => navigate("/SignUp")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Sign Up
        </button>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-12 max-w-5xl mx-auto flex items-center">
          <div className="w-1/2 pr-8">
            <img 
              src="../../../assets/Landing_image.png"
              alt="SkillsAssess Frog Mascot" 
              className="w-100 h-100 object-cover"
              //style="width:128px;height:128px"
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