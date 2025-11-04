import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import api from '../../utils/api';

export default function TeacherStudents() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/stats/teacher/enrollments');
        setRows(res.data?.data || []);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 pb-10 container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Enrolled Students</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Students who enrolled in your courses</p>
        </div>

        {loading ? (
          <div className="text-gray-600 dark:text-gray-300">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-300">No enrollments yet.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white/70 dark:bg-gray-800/60 divide-y divide-gray-200 dark:divide-gray-700">
                {rows.map((r, idx) => (
                  <motion.tr key={r._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} className="">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{r.student?.name || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.student?.email || '-'}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{r.course?.title || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
