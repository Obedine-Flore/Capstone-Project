import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import profilePic from "../assets/profile.jpg";

const Navbar = ({ userData }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log('Full userData object:', userData);
    console.log('Admin status:', userData?.is_admin);
    console.log('Type of admin status:', typeof userData?.is_admin);
  }, [userData]);

  useEffect(() => {
    console.log('Full userData object:', userData);
    console.log('Admin status:', userData?.is_admin);
    console.log('Type of admin status:', typeof userData?.is_admin);
  }, [userData]);

  // Debug logging
  useEffect(() => {
    console.log('userData in Navbar:', userData);
    if (userData) {
      console.log('Profile Picture:', userData.profile_picture);
    }
  }, [userData]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Active link styling
  const activeNavLinkStyle = "text-green-700 font-semibold border-b-2 border-green-500 pb-1";
  const inactiveNavLinkStyle = "text-gray-700 hover:text-green-600 transition-colors";

  return (
    <header className="flex justify-between items-center px-4 md:px-8 py-4 shadow-sm bg-white sticky top-0 z-10">
      {/* Logo */}
      <Link to="/dashboard" ><h1 className="text-xl font-bold text-green-600">Skills<span className="text-gray-900">Assess</span></h1></Link>
      
      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button 
          onClick={toggleMobileMenu} 
          className="text-green-700 focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            isActive ? activeNavLinkStyle : inactiveNavLinkStyle
          }
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/assessments" 
          className={({ isActive }) => 
            isActive ? activeNavLinkStyle : inactiveNavLinkStyle
          }
        >
          Assessments
        </NavLink>
        <NavLink 
          to="/Leaderboard" 
          className={({ isActive }) => 
            isActive ? activeNavLinkStyle : inactiveNavLinkStyle
          }
        >
          Leaderboard
        </NavLink>
        <NavLink 
          to="/blog" 
          className={({ isActive }) => 
            isActive ? activeNavLinkStyle : inactiveNavLinkStyle
          }
        >
          Blog
        </NavLink>
        {/* Admin Link - Only visible for admin users */}
        {userData?.is_admin === 1 && (
        <NavLink 
          to="/admin" 
          className={({ isActive }) => 
          isActive ? activeNavLinkStyle : inactiveNavLinkStyle
          }
        >
        <div className="flex items-center">
        <Shield size={16} className="mr-1" />
          Admin
        </div>
        </NavLink>
      )}
      </nav>

      {/* Profile Picture */}
      <Link to="/profile" className="hidden md:block hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-green-500 ring-offset-2">
          {userData?.profile_picture ? (
            <img 
              src={userData.profile_picture ? `http://localhost:5000/${userData.profile_picture}` : profilePic}
              alt="Profile" 
              className="w-10 h-10 object-cover" 
            />
          ) 
          : (
            <img 
              src={profilePic} 
              alt="Profile" 
              className="w-10 h-10 object-cover" 
            />
          )}
        </div>
      </Link>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg">
          <nav className="flex flex-col items-center space-y-4 py-6">
            <NavLink 
              to="/dashboard" 
              onClick={toggleMobileMenu}
              className={({ isActive }) => 
                isActive ? activeNavLinkStyle : inactiveNavLinkStyle
              }
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/assessments" 
              onClick={toggleMobileMenu}
              className={({ isActive }) => 
                isActive ? activeNavLinkStyle : inactiveNavLinkStyle
              }
            >
              Assessments
            </NavLink>
            <NavLink 
              to="/Leaderboard" 
              onClick={toggleMobileMenu}
              className={({ isActive }) => 
                isActive ? activeNavLinkStyle : inactiveNavLinkStyle
              }
            >
              Leaderboard
            </NavLink>
            <NavLink 
              to="/blog" 
              onClick={toggleMobileMenu}
              className={({ isActive }) => 
                isActive ? activeNavLinkStyle : inactiveNavLinkStyle
              }
            >
              Blog
            </NavLink>
            
            {/* Admin Link in Mobile Menu - Only visible for admin users */}
            {userData?.is_admin && (
              <NavLink 
                to="/admin" 
                onClick={toggleMobileMenu}
                className={({ isActive }) => 
                  isActive ? activeNavLinkStyle : inactiveNavLinkStyle
                }
              >
                <div className="flex items-center">
                  <Shield size={16} className="mr-1" />
                  Admin
                </div>
              </NavLink>
            )}

            {/* Mobile Profile Picture */}
            <Link 
              to="/profile" 
              onClick={toggleMobileMenu}
              className="block md:hidden"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-500 ring-offset-2">
                {userData?.profile_picture ? (
                  <img 
                  src={userData.profile_picture ? `http://localhost:5000/${userData.profile_picture}` : profilePic}
                  alt="Profile" 
                  className="w-12 h-12 object-cover" 
                />
              ) 
              : (
                <img 
                  src={profilePic} 
                  alt="Profile" 
                  className="w-12 h-12 object-cover" 
                  />
                )}
              </div>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;