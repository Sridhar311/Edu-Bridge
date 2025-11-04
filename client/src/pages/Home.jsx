import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ students: 0, teachers: 0, courses: 0, enrollments: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/stats/summary');
        setStats(res.data || {});
      } catch (e) {
        // ignore, keep defaults
      }
    })();
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: 2,
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Empowering Learning
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                for Everyone
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto"
            >
              Join thousands of learners and unlock your potential with our
              comprehensive courses taught by industry experts.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/courses">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold text-lg shadow-2xl hover:bg-gray-100 transition-all"
                >
                  <i className="fas fa-book-open mr-2"></i>
                  Explore Courses
                </motion.button>
              </Link>
              {!isAuthenticated && (
                <Link to="/signup?role=teacher">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
                  >
                    <i className="fas fa-chalkboard-teacher mr-2"></i>
                    Join as Teacher
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <i className="fas fa-chevron-down text-white text-2xl opacity-70"></i>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose EduBridge?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the best in online education with our innovative
              platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-users text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Expert Instructors
              </h3>
              <p className="text-gray-600">
                Learn from industry professionals and subject matter experts
                with years of experience.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-laptop text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Flexible Learning
              </h3>
              <p className="text-gray-600">
                Study at your own pace, anytime, anywhere with our
                easy-to-access platform.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-certificate text-white text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Verified Certificates
              </h3>
              <p className="text-gray-600">
                Receive industry-recognized certificates upon course completion
                to boost your career.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section (real-time) */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-5xl font-bold text-white mb-2">{stats.students}</div>
              <div className="text-xl text-white/90">Active Students</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-5xl font-bold text-white mb-2">{stats.teachers}</div>
              <div className="text-xl text-white/90">Expert Instructors</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-5xl font-bold text-white mb-2">{stats.courses}</div>
              <div className="text-xl text-white/90">Online Courses</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-5xl font-bold text-white mb-2">{stats.enrollments}</div>
              <div className="text-xl text-white/90">Course Enrollments</div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

