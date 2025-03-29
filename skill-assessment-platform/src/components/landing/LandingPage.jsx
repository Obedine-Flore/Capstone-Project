import React from 'react';
import { useNavigate } from "react-router-dom";
import { Menu, X } from 'lucide-react'; // Add this import for icons

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

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-green-500">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-12 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
            <div className="max-w-xl mb-8 md:mb-0">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            The best way to assess your <span className="text-green-600">market readiness</span>
          </h1>
              
          <p className="text-lg text-gray-700 mb-6">
            SkillsAssess helps you evaluate and improve your 21st-century skills to boost your employability.
          </p>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate("/SignUp")} 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Create an Account
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <img 
                src="../../../assets/Landing_image.png"
                alt="SkillsAssess Mascot" 
                className="width: 100% h-100 object-cover"
              />
            </div>
          </div>
          
          <div className="text-center text-gray-600 text-lg md:text-xl">
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