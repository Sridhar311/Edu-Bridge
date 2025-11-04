import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background-gray">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome, {user?.name}! Manage the entire platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-hover">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-users text-primary-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Users
                </h3>
                <p className="text-gray-600 mb-4">
                  Manage all users and permissions
                </p>
                <button className="text-primary-600 font-medium hover:text-primary-700">
                  Manage Users →
                </button>
              </div>

              <div className="card-hover">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-book text-secondary-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Courses
                </h3>
                <p className="text-gray-600 mb-4">
                  Moderate and manage all courses
                </p>
                <button className="text-secondary-600 font-medium hover:text-secondary-700">
                  Manage Courses →
                </button>
              </div>

              <div className="card-hover">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-dollar-sign text-accent-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Revenue
                </h3>
                <p className="text-gray-600 mb-4">
                  View platform revenue and transactions
                </p>
                <button className="text-accent-600 font-medium hover:text-accent-700">
                  View Revenue →
                </button>
              </div>

              <div className="card-hover">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-cog text-purple-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Settings
                </h3>
                <p className="text-gray-600 mb-4">
                  Platform settings and configuration
                </p>
                <button className="text-purple-600 font-medium hover:text-purple-700">
                  Settings →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

