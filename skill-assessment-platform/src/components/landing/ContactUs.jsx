import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Add this import for icons

// Responsive Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      {/* Desktop and Mobile Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-gray-600 hover:text-gray-800">
              <span className="text-2xl font-bold">
                <span className="text-green-600">Skills</span>
                <span className="text-gray-600">Assess</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/AboutUs" className="text-gray-600 hover:text-gray-800">About Us</a>
            <a href="/ContactUs" className="text-gray-600 hover:text-gray-800">Contact</a>
          </div>

          {/* Desktop Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => navigate("/SignIn")} 
              className="text-gray-600 hover:text-gray-800"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate("/SignUp")} 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
            <a 
              href="/AboutUs" 
              className="block px-3 py-2 rounded-md text-center font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              About Us
            </a>
            <a 
              href="/ContactUs" 
              className="block px-3 py-2 rounded-md text-center font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              Contact Us
            </a>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3">
                <button
                  onClick={() => {
                    navigate("/SignIn");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                >
                  Log In
                </button>
              </div>
              <div className="mt-3 px-3">
                <button
                  onClick={() => {
                    navigate("/SignUp");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-green-600 hover:bg-green-700 text-white"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonText, setButtonText] = useState("Send Message");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setButtonText("Sent!");
    
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
        // Change button text to "Sent"
        setButtonText("Sent!");
        // Set success message
        setSuccessMessage("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // Reset form
        
        // Reset button text and clear success message after 3 seconds
        setTimeout(() => {
          setButtonText("Send Message");
          setSuccessMessage("");
        }, 3000);
      } else {
        // Handle specific error messages
        setSuccessMessage(result.error || "Something went wrong");
        setButtonText("Send Message"); // Reset button text
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSuccessMessage("Network error. Please try again.");
      setButtonText("Send Message"); // Reset button text
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-500">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        {/* Using flex-col for mobile (stacking vertically) and md:flex-row for desktop */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-12 max-w-5xl mx-auto flex flex-col md:flex-row items-center">
          
          {/* Image section - comes first in DOM order, full width on mobile, half on md and up */}
          <div className="w-full md:w-1/2 md:pr-8 flex justify-center order-2 md:order-1 mt-8 md:mt-0">
            <img 
              src="../../../assets/Landing_image.png"
              alt="SkillsAssess Frog Mascot" 
              className="w-100 h-100 object-cover"
            />
          </div>
          
          {/* Form section - comes second in DOM order, full width on mobile, half on md and up */}
          <div className="w-full md:w-1/2 md:pl-8 order-1 md:order-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-gray-600 text-lg md:text-xl mb-6 md:mb-8">Stay in touch with us</p>
            
            {/* Display success message */}
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                {successMessage}
              </div>
            )}
            
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
                disabled={isSubmitting}
                className={`w-full text-white py-3 rounded-lg transition duration-300 ${
                  buttonText === "Sent!" 
                    ? "bg-green-700" 
                    : isSubmitting 
                      ? "bg-green-500" 
                      : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {buttonText}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;