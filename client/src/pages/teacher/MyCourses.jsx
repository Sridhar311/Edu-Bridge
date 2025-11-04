import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getMyCourses, deleteCourse } from '../../utils/courseAPI';
import Navbar from '../../components/Navbar';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyCourses();
      setCourses(res.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm('Delete this course?')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted');
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Navbar />
        <div className="pt-24 flex items-center justify-center text-gray-600 dark:text-gray-300">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 pb-10 container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Courses</h1>
          <Link to="/teacher/create" className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl">Create New</Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">No courses yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((c, idx) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="group h-full rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/60 shadow-sm hover:shadow-xl hover:border-gray-400 dark:hover:border-gray-500 transition-all">
                <div className="h-40 bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-t-2xl overflow-hidden">
                  {c.thumbnailUrl ? (
                    <img src={c.thumbnailUrl} alt={c.title} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No thumbnail</div>
                  )}
                </div>
                <div className="p-4 flex flex-col h-[210px] border border-gray-300 dark:border-gray-600 rounded-b-2xl">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{c.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{c.description}</p>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gray-900 dark:text-gray-100 font-semibold">{c.price ? `₹${c.price}` : 'Free'}</span>
                      <span className="text-xs text-gray-500">{(c.studentsEnrolled?.length || c.students?.length || 0)} enrolled</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button onClick={() => navigate(`/teacher/edit/${c._id}`)} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                        <i className="fas fa-edit mr-1" /> Edit
                      </button>
                      <button onClick={() => onDelete(c._id)} className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
                        <i className="fas fa-trash mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
