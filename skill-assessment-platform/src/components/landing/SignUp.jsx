import React, { useState } from 'react';
//import { Button } from '@/components/ui/button'; // Import Button from shadcn/ui

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your sign-up logic here
    if (termsAgreed) {
      console.log('Sign up attempt:', { name, email, password });
      // Implement your sign-up logic here
    } else {
      alert('Please agree to the terms and conditions');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mr-2 text-green-600 focus:ring-green-500"
              required
            />
            <label htmlFor="terms" className="text-gray-700 text-sm">
              I agree with the terms and conditions
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Sign Up
          </button>
          <div className="mt-4 text-center">
            <span className="text-gray-600 text-sm">
              Already have an account?{' '}
              <a href="/SignIn" className="text-green-600 hover:underline">
                Sign In
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;