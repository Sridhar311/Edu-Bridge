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
      <div className="pt-24 pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Continue your learning journey
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">My Courses</h2>
              <Link to="/courses" className="text-primary-600">Browse courses →</Link>
            </div>

            {loading ? (
              <div className="text-gray-600">Loading…</div>
            ) : items.length === 0 ? (
              <div className="text-gray-600">No enrollments yet.</div>
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
                        <button onClick={() => navigate(`/course-player/${en.course?._id || en.course?.id}`)} className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-sm">
                          Continue
                        </button>
                        {en.course?.notesUrl && (
                          <a href={en.course.notesUrl} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600">Notes</a>
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

