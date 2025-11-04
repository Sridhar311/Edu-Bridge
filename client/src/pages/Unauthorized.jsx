import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-background-gray">
      <Navbar />
      <div className="pt-32 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-lock text-red-600 text-4xl"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
          <Link
            to="/"
            className="btn-primary inline-block"
          >
            Go to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Unauthorized;

