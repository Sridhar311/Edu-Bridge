import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Link to={getDashboardPath()}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-tachometer-alt text-gray-700"></i>
                </motion.button>
              </Link>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className={`w-full h-0.5 ${scrolled || isAuthenticated ? 'bg-gray-700' : 'bg-white'} transition-colors`}
                />
                <motion.span
                  animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className={`w-full h-0.5 ${scrolled || isAuthenticated ? 'bg-gray-700' : 'bg-white'} transition-colors`}
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className={`w-full h-0.5 ${scrolled || isAuthenticated ? 'bg-gray-700' : 'bg-white'} transition-colors`}
                />
              </div>
            </motion.button>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
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

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <i className="fas fa-times text-gray-700"></i>
                  </button>
                </div>

                {/* User Profile in Sidebar */}
                {isAuthenticated && user && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-lg font-semibold">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      </div>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="p-4">
                <div className="space-y-1">
                  <Link
                    to="/"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <i className="fas fa-home w-5 text-primary-600"></i>
                    <span className="font-medium">Home</span>
                  </Link>
                  <Link
                    to="/courses"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <i className="fas fa-book w-5 text-primary-600"></i>
                    <span className="font-medium">Courses</span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <i className="fas fa-info-circle w-5 text-primary-600"></i>
                    <span className="font-medium">About</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <i className="fas fa-envelope w-5 text-primary-600"></i>
                    <span className="font-medium">Contact</span>
                  </Link>
                </div>

                {/* Authenticated User Links */}
                {isAuthenticated && (
                  <>
                    <div className="my-4 border-t border-gray-200"></div>
                    <div className="space-y-1">
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <i className="fas fa-tachometer-alt w-5 text-primary-600"></i>
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <i className="fas fa-user w-5 text-primary-600"></i>
                        <span className="font-medium">Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <i className="fas fa-cog w-5 text-primary-600"></i>
                        <span className="font-medium">Settings</span>
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                        >
                          <i className="fas fa-shield-alt w-5 text-primary-600"></i>
                          <span className="font-medium">Admin Panel</span>
                        </Link>
                      )}
                    </div>
                    <div className="my-4 border-t border-gray-200"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                    >
                      <i className="fas fa-sign-out-alt w-5"></i>
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                )}

                {/* Guest Links */}
                {!isAuthenticated && (
                  <>
                    <div className="my-4 border-t border-gray-200"></div>
                    <div className="space-y-2">
                      <Link to="/login" className="block">
                        <button className="w-full px-4 py-3 rounded-lg border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors">
                          Login
                        </button>
                      </Link>
                      <Link to="/signup" className="block">
                        <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg">
                          Sign Up
                        </button>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Links */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="space-y-2 text-sm">
                  <Link to="/terms" className="block text-gray-600 hover:text-primary-600 transition-colors">
                    Terms of Service
                  </Link>
                  <Link to="/privacy" className="block text-gray-600 hover:text-primary-600 transition-colors">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
