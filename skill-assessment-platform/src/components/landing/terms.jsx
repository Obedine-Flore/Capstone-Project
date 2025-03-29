import React from 'react';
import { Link } from 'react-router-dom';

const terms = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between px-8 py-6">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/SignUp" className="flex items-center text-green-600 hover:text-green-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to SignUp Page
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="min-h-screen text-center items-center justify-center bg-gray-100 px-8 py-6">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <p className="text-gray-700 mb-4">
          Welcome to SkillsAssess! By accessing or using our platform, you agree to be bound by the following terms and conditions.
        </p>
        
        <h2 className="text-xl font-semibold mt-4 mb-2">1. Acceptance of Terms</h2>
        <p className="text-gray-700 mb-4">
          By using SkillsAssess, you accept and agree to be bound by these terms. If you do not agree, please refrain from using our services.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">2. User Responsibilities</h2>
        <p className="text-gray-700 mb-4">
          You agree to use SkillsAssess responsibly and comply with all applicable laws and regulations.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">3. Privacy Policy</h2>
        <p className="text-gray-700 mb-4">
          Your privacy is important to us. Please review our Privacy Policy to understand how we handle your data.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">4. Modifications</h2>
        <p className="text-gray-700 mb-4">
          We reserve the right to modify these terms at any time. Continued use of our platform constitutes acceptance of the changes.
        </p>

        <h2 className="text-xl font-semibold mt-4 mb-2">5. Contact Us</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions about these Terms and Conditions, please contact us at support@skillsassess.com.
        </p>
      </div>
    </div>
  );
};

export default terms;
