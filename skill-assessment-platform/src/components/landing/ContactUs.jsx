import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, Menu, X } from 'lucide-react'; // import for icons

// Responsive Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

   return (
      <nav className="bg-white shadow-md sticky top-0 left-0 right-0 z-50">
        {/* Desktop and Mobile Navbar Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <a 
                href="/" 
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="text-2xl font-bold">
                  <span className="text-green-600">Skills</span>
                  <span className="text-gray-600">Assess</span>
                </span>
              </a>
            </div>
  
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="/AboutUs" 
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                About Us
              </a>
              <a 
                href="/ContactUs" 
                className="text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                Contact
              </a>
            </div>
  
            {/* Desktop Authentication Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => navigate("/SignIn")} 
                className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate("/SignUp")} 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Sign Up
              </button>
            </div>
  
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-all"
                aria-expanded={isMenuOpen}
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
  
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in-down">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <a 
                href="/AboutUs" 
                className="block px-3 py-2 rounded-md text-center font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                About Us
              </a>
              <a 
                href="/ContactUs" 
                className="block px-3 py-2 rounded-md text-center font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                Contact Us
              </a>
              <div className="pt-4 pb-3 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => {
                    navigate("/SignIn");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    navigate("/SignUp");
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center px-3 py-2 rounded-lg text-base font-medium bg-green-600 hover:bg-green-700 text-white transition-colors shadow-md hover:shadow-lg"
                >
                  Sign Up
                </button>
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-green-50 flex items-center justify-center p-8 md:p-12 order-2 md:order-1">
            <img 
              src="../../../assets/Landing_image.png" 
              alt="SkillsAssess Contact Illustration"
              className="w-100 h-100 object-cover"
            />
          </div>
          
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 order-1 md:order-2">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
                Contact Us
              </h1>
              <p className="text-gray-600 text-lg">
                We'd love to hear from you! Send us a message.
              </p>
            </div>
            
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-6 flex items-center">
                <CheckCircle className="mr-3 text-green-500" />
                <span>{successMessage}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              {/* Email Input */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              {/* Message Textarea */}
              <div>
                <label 
                  htmlFor="message" 
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  required
                ></textarea>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full 
                  flex 
                  items-center 
                  justify-center 
                  text-white 
                  py-3 
                  rounded-lg 
                  transition-all 
                  duration-300 
                  ${buttonText === "Sent!" 
                    ? "bg-green-700" 
                    : isSubmitting 
                      ? "bg-green-500 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                  }
                `}
              >
                {buttonText === "Sent!" ? (
                  <CheckCircle className="mr-2" />
                ) : (
                  <Send className="mr-2" />
                )}
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