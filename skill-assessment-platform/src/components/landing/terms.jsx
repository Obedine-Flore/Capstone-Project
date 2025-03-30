import React from 'react';
import { Link } from 'react-router-dom';

const terms = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
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

      <div className="flex-grow bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-md rounded-lg">
          <header className="text-center py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-green-700">SkillsAssess: Comprehensive User Agreement and Privacy Policy</h1>
          </header>

          {/* Table of Contents */}
          <div className="my-6 p-4 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold text-green-700 mb-3">Table of Contents</h2>
            <ul className="space-y-2">
              <li><a href="#welcome" className="text-green-600 hover:underline">1. Welcome and Purpose</a></li>
              <li><a href="#rights" className="text-green-600 hover:underline">2. User Rights and Permissions</a></li>
              <li><a href="#data" className="text-green-600 hover:underline">3. Data Collection and Usage</a></li>
              <li><a href="#protection" className="text-green-600 hover:underline">4. Data Protection and Security</a></li>
              <li><a href="#responsibilities" className="text-green-600 hover:underline">5. User Responsibilities</a></li>
              <li><a href="#ip" className="text-green-600 hover:underline">6. Intellectual Property</a></li>
              <li><a href="#transparency" className="text-green-600 hover:underline">7. Transparency and Consent</a></li>
            </ul>
          </div>

          {/* Section 1 */}
          <section id="welcome" className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 pb-2 border-b border-gray-200">1. Welcome and Purpose</h2>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-green-700 mt-4">1.1 Introduction</h3>
              <p className="mt-2 text-gray-700">
                Welcome to Skills Assess ("Platform"), a web-based platform designed to help users evaluate and develop their skills 
                through assessments and personalized feedback. This document outlines the terms of service, copyright policies, 
                and privacy policies governing your use of Skills Assess. By accessing or using the Platform, you agree to be bound by these terms.
              </p>
              
              <h3 className="text-xl font-semibold text-green-700 mt-4">1.2 Platform Mission</h3>
              <p className="mt-2 text-gray-700">
                SkillsAssess is a web-based platform dedicated to empowering university students in Sub-Saharan Africa by providing 
                innovative skill assessment and development tools. Our mission is to bridge educational gaps and enhance workforce 
                readiness through technology.
              </p>
              
              <h3 className="text-xl font-semibold text-green-700 mt-4">1.3 Agreement Scope</h3>
              <p className="mt-2 text-gray-700">
                By accessing or using SkillsAssess, you enter into a binding agreement that governs your interaction with our platform. 
                This policy outlines:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Your rights as a user</li>
                <li>Our commitments to data protection</li>
                <li>Expectations for responsible platform use</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section id="rights" className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 pb-2 border-b border-gray-200">2. User Rights and Permissions</h2>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-green-700 mt-4">2.1 License Grant</h3>
              <p className="mt-2 text-gray-700">
                Skills Assess grants you a non-exclusive, non-transferable, revocable license to use the Platform for personal, 
                educational, or professional development purposes. This license allows you to use SkillsAssess for:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Personal skill development</li>
                <li>Educational purposes</li>
                <li>Professional growth</li>
              </ul>
              <p className="mt-2 text-gray-700">This license is subject to the terms outlined below:</p>
              
              <h3 className="text-xl font-semibold text-green-700 mt-4">2.2 Usage Restrictions</h3>
              <p className="mt-2 text-gray-700">Users are PROHIBITED from:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Copying or modifying platform infrastructure</li>
                <li>Reverse-engineering platform components</li>
                <li>Using the platform for illegal activities</li>
                <li>Sharing login credentials</li>
                <li>Attempting unauthorized access</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-green-700 mt-4">2.3 Termination</h3>
              <p className="mt-2 text-gray-700">
                Skills Assess reserves the right to terminate or suspend access to users who violate these terms without prior notice.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="data" className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 pb-2 border-b border-gray-200">3. Data Collection and Usage</h2>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-green-700 mt-4">3.1 Types of Data Collected</h3>
              <p className="mt-2 text-gray-700">We collect two primary data categories:</p>
              <p className="mt-2 font-medium text-gray-800">Personal Information</p>
              <ul className="list-disc pl-6 mt-1 text-gray-700">
                <li>Full name</li>
                <li>Email address</li>
                <li>Profile details</li>
              </ul>
              <p className="mt-3 font-medium text-gray-800">Usage Data</p>
              <ul className="list-disc pl-6 mt-1 text-gray-700">
                <li>Assessment interactions</li>
                <li>Platform engagement metrics</li>
                <li>Learning progress tracking</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-green-700 mt-4">3.2 Data Usage Purposes</h3>
              <p className="mt-2 text-gray-700">Your data helps us:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Personalize user experiences</li>
                <li>Improve assessment algorithms</li>
                <li>Conduct research and analytics</li>
                <li>Enhance platform security</li>
                <li>Provide targeted learning recommendations</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-green-700 mt-4">3.3 Data Retention</h3>
              <p className="mt-2 text-gray-700">Personal data is retained as long as the account remains active.</p>
              <p className="mt-2 text-gray-700">Users may request data deletion by contacting Skills Assess support.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="protection" className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 pb-2 border-b border-gray-200">4. Data Protection and Security</h2>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-green-700 mt-4">4.1 Security Measures</h3>
              <p className="mt-2 text-gray-700">We implement:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>End-to-end encryption</li>
                <li>Secure authentication protocols</li>
                <li>Regular security audits</li>
                <li>Compliance with international data protection standards (GDPR)</li>
              </ul>
              <p className="mt-2 text-gray-700">Users are responsible for maintaining the confidentiality of their login credentials.</p>
              
              <h3 className="text-xl font-semibold text-green-700 mt-4">4.2 Data Sharing Policy</h3>
              <p className="mt-2 text-gray-700">We DO NOT:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Sell personal user data</li>
                <li>Share identifiable information without consent</li>
              </ul>
              <p className="mt-2 text-gray-700">Limited sharing may occur with:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Legal authorities (when legally required)</li>
                <li>Potential business transitions (with user's consent)</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section id="responsibilities" className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 pb-2 border-b border-gray-200">5. User Responsibilities</h2>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-green-700 mt-4">5.1 Account Management</h3>
              <p className="mt-2 text-gray-700">Users must:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Provide accurate information</li>
                <li>Maintain credential confidentiality</li>
                <li>Use the platform responsibly</li>
                <li>Report suspicious activities</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-green-700 mt-4">5.2 Ethical Usage</h3>
              <p className="mt-2 text-gray-700">The platform prohibits:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Harassment</li>
                <li>Discriminatory behavior</li>
                <li>Misuse of personal information</li>
                <li>Fraudulent activities</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section id="ip" className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 pb-2 border-b border-gray-200">6. Intellectual Property</h2>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-green-700 mt-4">6.1 Ownership</h3>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Platform content remains SkillsAssess property</li>
                <li>Users retain ownership of personal assessment content</li>
                <li>User-generated content grants us a non-exclusive usage license</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-green-700 mt-4">6.2 Content Usage Rights</h3>
              <p className="mt-2 text-gray-700">Users may NOT:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Reproduce platform materials</li>
                <li>Distribute proprietary content</li>
                <li>Create derivative works without permission</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section id="transparency" className="mb-8">
            <h2 className="text-2xl font-bold text-green-700 pb-2 border-b border-gray-200">7. Transparency and Consent</h2>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-green-700 mt-4">7.1 User Control</h3>
              <p className="mt-2 text-gray-700">You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Access your data</li>
                <li>Request data corrections</li>
                <li>Delete your account</li>
                <li>Withdraw data processing consent</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-green-700 mt-4">7.2 Policy Updates</h3>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>We may update this policy periodically</li>
                <li>Continued platform use implies acceptance of changes</li>
                <li>Significant changes will be communicated directly</li>
              </ul>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-gray-600">
            <h3 className="text-lg font-semibold">Contact and Support</h3>
            <p className="mt-2">Support Email: support@skillsassess.com</p>
            <p className="mt-1">Last Updated: 28/03/2025</p>
          </div>

          {/* Declaration */}
          <div className="my-8 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <h3 className="text-lg font-semibold text-green-700">Declaration of Understanding</h3>
            <p className="mt-2 text-gray-700">
              By using SkillsAssess, you acknowledge that you have read, understood, and voluntarily agree 
              to the terms outlined in this comprehensive User Agreement and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default terms;
