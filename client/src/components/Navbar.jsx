import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'teacher':
        return 'bg-blue-100 text-blue-700';
      case 'student':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isAuthenticated
          ? 'bg-white shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-xl"></i>
              </div>
              <span
                className={`text-2xl font-bold ${
                  scrolled || isAuthenticated ? 'text-gray-900' : 'text-white'
                }`}
              >
                EduBridge
              </span>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`hover:text-primary-600 transition-colors ${
                scrolled || isAuthenticated ? 'text-gray-700' : 'text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className={`hover:text-primary-600 transition-colors ${
                scrolled || isAuthenticated ? 'text-gray-700' : 'text-white'
              }`}
            >
              Courses
            </Link>
            <Link
              to="/about"
              className={`hover:text-primary-600 transition-colors ${
                scrolled || isAuthenticated ? 'text-gray-700' : 'text-white'
              }`}
            >
              About
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`hover:text-primary-600 transition-colors ${
                  scrolled || isAuthenticated ? 'text-gray-700' : 'text-white'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="dropdown-container relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-gray-700 font-medium">
                    {user?.name}
                  </span>
                  <i className={`fas fa-chevron-down text-gray-600 text-xs transition-transform ${showDropdown ? 'rotate-180' : ''}`}></i>
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-gray-100 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getRoleBadgeColor(user?.role)}`}>
                            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="py-2">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <i className="fas fa-tachometer-alt text-primary-600 w-5"></i>
                          <span className="text-gray-700">Dashboard</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <i className="fas fa-user text-primary-600 w-5"></i>
                          <span className="text-gray-700">Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <i className="fas fa-cog text-primary-600 w-5"></i>
                          <span className="text-gray-700">Settings</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600"
                        >
                          <i className="fas fa-sign-out-alt w-5"></i>
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button
                    className={`px-4 py-2 rounded-lg transition-all ${
                      scrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
