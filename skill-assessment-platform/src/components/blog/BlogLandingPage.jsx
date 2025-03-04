import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import profilePic from "../../assets/profile.jpg";
import blogPic from "../../assets/blogimage.jpeg";
import axios from "axios";
import Navbar from '../Navbar';

const BlogLandingPage = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  
  const postsPerPage = 4;
  
  const categories = [
    'All',
    'Company',
    'Design',
    'Technology',
    'Crypto',
    'Artificial Intelligence',
    'Work'
  ];

  const tools = [
    'Guidelines',
    'Mentorship',
    'Tutorial',
    'Training',
    'Career',
    'Self Care'
  ];

  useEffect(() => {
    Promise.all([fetchUserData(), fetchBlogPosts()]);
  }, []);
  
  useEffect(() => {
    filterPosts();
  }, [searchQuery, selectedCategory, blogPosts]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No authentication token found, using default profile image");
        setIsLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/blog-posts");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      
      try {
        const data = JSON.parse(text);
        
        if (!Array.isArray(data)) {
          console.log("Response is not an array:", data);
          setBlogPosts([]);
          return;
        }
        
        // Format the image URLs properly using image_path instead of image
        const formattedData = data.map(post => ({
          ...post,
          image_path: post.image_path 
            ? (post.image_path.startsWith('http') 
                ? post.image_path 
                : `http://localhost:5000/${post.image_path.startsWith('/') ? post.image_path.substring(1) : post.image_path}`)
            : blogPic
        }));
        
        setBlogPosts(formattedData);
      } catch (parseError) {
        console.error("JSON parse error:", parseError, "Response text:", text);
        setBlogPosts([]);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setBlogPosts([]);
    }
  };
  
  const filterPosts = () => {
    let results = [...blogPosts];
    
    // Filter by category
    if (selectedCategory !== 'All') {
      results = results.filter(post => post.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredPosts(results);
    setTotalPages(Math.ceil(results.length / postsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailStatus('Please enter a valid email address');
        setIsSubscribing(false);
        return;
      }
      
      const response = await axios.post("http://localhost:5000/api/newsletter/subscribe", { email });
      setEmailStatus('Thank you for subscribing!');
      setEmail('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setEmailStatus('');
      }, 3000);
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      setEmailStatus(
        error.response?.status === 409
          ? 'You are already subscribed!'
          : 'Subscription failed. Please try again later.'
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  const getPaginatedPosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
          Previous
        </button>
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          >
            {index + 1}
          </button>
        ))}
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`mx-1 px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 md:px-8 py-6 bg-gray-50">
      {/* Navbar */}
      <Navbar userData={userData}/>

      {/* Hero Section */}
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-green-700">Insights from our team</h2>
            <p className="text-gray-600">Advanced Assessment Tools and Features for Skill-Driven Learners</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles, skills, authors..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full border border-gray-300 p-2 pl-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 space-y-6 mb-8 md:mb-0">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-3">Blog Topics</h3>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left py-1 px-2 rounded transition-colors ${
                        selectedCategory === category
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                      {selectedCategory === category && (
                        <span className="float-right text-green-700">•</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-3">Guides and Tools</h3>
              <ul className="space-y-1">
                {tools.map((tool) => (
                  <li key={tool}>
                    <a 
                      href={`#${tool.toLowerCase().replace(' ', '-')}`}
                      className="block py-1 px-2 rounded text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      {tool}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Featured Article */}
            {blogPosts.find(post => post.featured) && (
              <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                <span className="text-xs font-medium text-green-800 bg-green-200 px-2 py-1 rounded-full">Featured</span>
                <h4 className="font-medium text-green-900 mt-2">
                  {blogPosts.find(post => post.featured).title}
                </h4>
                <p className="text-sm text-green-700 mt-2">
                  {blogPosts.find(post => post.featured).excerpt.substring(0, 70)}...
                </p>
                <Link 
                  to={`/blog/${blogPosts.find(post => post.featured).id}`}
                  className="text-sm font-medium text-green-700 hover:text-green-800 mt-2 inline-block"
                >
                  Read more →
                </Link>
              </div>
            )}
          </aside>

          {/* Blog Section */}
          <section className="w-full md:w-3/4">
            {isLoading ? (
              // Loading state
              <div className="flex flex-col space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-1/4 bg-gray-200 h-32 rounded-lg"></div>
                      <div className="w-3/4">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="flex mt-4">
                          <div className="h-6 bg-gray-200 rounded w-12"></div>
                          <div className="ml-4 h-6 bg-gray-200 rounded w-24"></div>
                          <div className="ml-4 h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <>
                {getPaginatedPosts().map((post) => (
                  <article key={post.id} className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full md:w-1/4">
                    <img
                      src={post.image_path || blogPic}
                      alt={post.title}
                      className="w-full h-48 md:h-32 rounded-lg object-cover shadow-sm hover:opacity-90 transition-opacity"
                      onError={(e) => {
                      console.log("Blog image failed to load");
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = blogPic;
                      }}
                    />
                    </div>
                    <div className="w-full md:w-3/4">
                      <div className="flex items-center text-sm">
                      <p className="text-green-600">
                      {post.date.split('T')[0]}
                      </p>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                          {post.category}
                        </span>
                      </div>
                      <Link to={`/blog/${post.id}`}>
                        <h3 className="text-xl font-bold mt-1 hover:text-green-700 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mt-1">{post.excerpt}</p>
                      <div className="flex items-center mt-3 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {post.author}
                        </span>
                        <span className="ml-4 flex items-center text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {post.read_time}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
                
                {renderPagination()}
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-700 mt-4">No matching articles found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or category filters</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 p-6 md:p-8 text-center rounded-lg mt-8 shadow-inner">
        <h3 className="text-lg font-semibold text-green-700">Stay up to date</h3>
        <p className="text-gray-700 text-xl font-bold">Join Our Newsletter</p>
        <form onSubmit={handleSubscribe} className="mt-4 flex flex-col md:flex-row justify-center max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded-lg md:rounded-r-none w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" 
          />
          <button 
            type="submit"
            disabled={isSubscribing}
            className="mt-2 md:mt-0 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg md:rounded-l-none transition-colors flex justify-center items-center"
          >
            {isSubscribing ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Subscribe"}
          </button>
        </form>
        {emailStatus && (
          <p className={`text-sm mt-2 ${emailStatus.includes('valid') ? 'text-red-600' : 'text-green-700'}`}>
            {emailStatus}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2">*You can unsubscribe anytime</p>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow-inner text-center p-8 mt-8 rounded-lg">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="text-gray-500 hover:text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
            </svg>
          </a>
        </div>
        <h1 className="text-green-700 font-bold">SkillsAssess</h1>
        <div className="max-w-md mx-auto mt-2">
          <p className="text-sm text-gray-600">&copy; 2023 SkillsAssess. All rights reserved.</p>
          <div className="flex justify-center mt-2 text-xs text-gray-500 space-x-4">
            <a href="#" className="hover:text-green-600">Privacy Policy</a>
            <a href="#" className="hover:text-green-600">Terms of Service</a>
            <a href="#" className="hover:text-green-600">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogLandingPage;