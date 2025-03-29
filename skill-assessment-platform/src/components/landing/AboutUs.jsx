import React from 'react';
import { useNavigate } from "react-router-dom";
import { Target, Users, BookOpen, Globe, Award, CheckCircle, Menu } from 'lucide-react';

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

const AboutUs = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Precision Assessment",
      description: "Cutting-edge skills evaluation using advanced algorithmic techniques."
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect learners with industries and educational institutions globally."
    },
    {
      icon: BookOpen,
      title: "Comprehensive Insights",
      description: "Detailed performance analytics to guide personal and professional growth."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center bg-green-50 p-12 md:p-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-700">
              Empowering Skills, Enabling Potential
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SkillsAssess is revolutionizing skill evaluation through innovative technology, 
              connecting learners, educators, and industries in a comprehensive assessment ecosystem.
            </p>
          </div>

          {/* Mascot and Mission Section */}
          <div className="flex flex-col md:flex-row items-center p-8 md:p-12">
            <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
              <img 
                src="../../../assets/Landing_image.png" 
                alt="SkillsAssess Mascot" 
                className="w-100 h-100 object-contain transform transition-transform hover:scale-110"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold mb-4 text-green-700">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                We believe in unlocking human potential through precise, fair, and comprehensive skill assessment. 
                Our platform bridges the gap between talent and opportunity.
              </p>
              <ul className="space-y-3">
                {[
                  "Accurate skill measurement",
                  "Gamified learning experience",
                  "Industry-aligned assessments"
                ].map((item, index) => (
                  <li 
                    key={index} 
                    className="flex items-center text-gray-700"
                  >
                    <CheckCircle className="text-green-500 mr-3" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-green-50 p-12 text-center">
            <h2 className="text-3xl font-bold mb-8 text-green-700">
              What Sets Us Apart
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-101"
                  >
                    <div className="mb-4 flex justify-center">
                      <Icon 
                        className="text-green-600" 
                        size={48} 
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-green-700">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center p-12 bg-white">
            <h2 className="text-3xl font-bold mb-4 text-green-700">
              Ready to Unlock Your Potential?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of learners and organizations transforming skills assessment 
              and professional development.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate("/SignUp")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/ContactUs")}
                className="bg-white border border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;