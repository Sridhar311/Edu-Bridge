import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';

const Card = ({ title, value, icon, to }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="backdrop-blur bg-white/60 dark:bg-gray-800/60 border border-white/40 dark:border-gray-700/40 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white flex items-center justify-center text-xl">
        {icon}
      </div>
    </div>
    {to && (
      <Link to={to} className="inline-block mt-4 text-primary-600 font-medium">View</Link>
    )}
  </motion.div>
);

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalCourses: 0, studentsEnrolled: 0, totalRevenue: 0 });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/stats/teacher');
        setStats(res.data || {});
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 pb-10 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name} 👋</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your courses and content</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card title="Total Courses" value={String(stats.totalCourses ?? 0)} icon={<i className="fas fa-book" />} to="/teacher/my-courses" />
          <Card title="Students Enrolled" value={String(stats.studentsEnrolled ?? 0)} icon={<i className="fas fa-users" />} to="/teacher/students" />
          <Card title="Total Revenue" value={`₹${Number(stats.totalRevenue || 0).toLocaleString('en-IN')}`} icon={<i className="fas fa-rupee-sign" />} />
        </div>

        <div className="flex flex-wrap gap-4">
          <Link to="/teacher/create" className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl transition">
            <i className="fas fa-plus mr-2" /> Create New Course
          </Link>
          <Link to="/teacher/my-courses" className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            <i className="fas fa-layer-group mr-2" /> My Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
