import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getMyEnrollments } from '../utils/studentAPI';
import ProgressBar from '../components/ProgressBar';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyEnrollments();
        setItems(res.data || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load enrollments');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-20 md:pt-24 pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Continue your learning journey
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">My Courses</h2>
              <Link 
                to="/courses" 
                className="text-primary-600 hover:text-primary-700 transition-colors text-sm sm:text-base font-medium"
              >
                Browse all courses →
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
                  <p className="text-gray-600 text-sm">Loading your courses...</p>
                </div>
              </div>
            ) : items.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-book-open text-3xl sm:text-4xl text-primary-600"></i>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No courses yet</h3>
                <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto">
                  Start your learning journey by enrolling in courses that interest you
                </p>
                <Link to="/courses">
                  <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all shadow-lg text-sm sm:text-base">
                    Browse Courses
                  </button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((en, idx) => (
                  <motion.div
                    key={en._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group h-full rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/60 shadow-sm hover:shadow-xl hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                  >
                    <div className="h-40 bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-t-2xl overflow-hidden">
                      {en.course?.thumbnailUrl ? (
                        <img src={en.course.thumbnailUrl} alt={en.course?.title} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No thumbnail</div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col h-[210px] border border-gray-300 dark:border-gray-600 rounded-b-2xl">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{en.course?.title}</h3>
                      <div className="mt-3">
                        <ProgressBar value={en.progressPercent || 0} />
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{en.progressPercent || 0}% completed</div>
                      </div>
                      <div className="mt-auto flex gap-2">
                        <button 
                          onClick={() => navigate(`/course-player/${en.course?._id || en.course?.id}`)} 
                          className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-sm hover:from-primary-700 hover:to-secondary-700 transition-all text-sm font-medium"
                        >
                          Continue
                        </button>
                        {en.course?.notesUrl && (
                          <a 
                            href={en.course.notesUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm flex items-center"
                            title="Download Notes"
                          >
                            <i className="fas fa-file-pdf"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

