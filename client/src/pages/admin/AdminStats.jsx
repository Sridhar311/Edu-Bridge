import React, { useEffect, useState } from 'react';
import { getStats } from '../../utils/adminApi';
import toast from 'react-hot-toast';

export default function AdminStats() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ totalUsers: 0, totalCourses: 0, totalRevenue: 0, byRole: [] });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getStats();
        setData(res.data || {});
      } catch (e) {
        toast.error(e?.response?.data?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const roleMap = Object.fromEntries((data.byRole || []).map(r => [r._id, r.count]));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">Platform Overview</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-blue-600 dark:text-blue-400"></i>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{data.totalUsers || 0}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Registered accounts</p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <i className="fas fa-book text-green-600 dark:text-green-400"></i>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{data.totalCourses || 0}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available courses</p>
        </div>

        <div className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <i className="fas fa-rupee-sign text-purple-600 dark:text-purple-400"></i>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">₹{Number(data.totalRevenue || 0).toFixed(2)}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Platform earnings (10%)</p>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Role Distribution</h3>
        <div className="flex items-end justify-around sm:justify-start sm:gap-8 md:gap-12 h-48">
          {['student','teacher','admin'].map((r) => {
            const count = roleMap[r] || 0;
            const maxCount = Math.max(...Object.values(roleMap), 1);
            const heightPercent = (count / maxCount) * 100;
            
            return (
              <div key={r} className="flex flex-col items-center flex-1 sm:flex-none">
                <div className="relative w-full sm:w-16 md:w-20 bg-gradient-to-t from-primary-600 to-secondary-600 rounded-t-lg hover:opacity-80 transition-opacity" 
                     style={{ height: `${Math.max(heightPercent, 10)}%`, minHeight: '20px' }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                    {count} users
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{count}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">{r}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
