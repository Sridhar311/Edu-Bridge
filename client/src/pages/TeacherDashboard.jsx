import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background-gray">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome, {user?.name}! Manage your courses and students
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card-hover">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-chalkboard-teacher text-primary-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  My Courses
                </h3>
                <p className="text-gray-600 mb-4">
                  Create, edit, and manage your courses
                </p>
                <button className="text-primary-600 font-medium hover:text-primary-700">
                  Manage Courses →
                </button>
              </div>

              <div className="card-hover">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-users text-secondary-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Students
                </h3>
                <p className="text-gray-600 mb-4">
                  View enrolled students and their progress
                </p>
                <button className="text-secondary-600 font-medium hover:text-secondary-700">
                  View Students →
                </button>
              </div>

              <div className="card-hover">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-analytics text-accent-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Analytics
                </h3>
                <p className="text-gray-600 mb-4">
                  Track course performance and revenue
                </p>
                <button className="text-accent-600 font-medium hover:text-accent-700">
                  View Analytics →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

