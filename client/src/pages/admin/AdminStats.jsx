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

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Loading stats…</div>;

  const roleMap = Object.fromEntries((data.byRole || []).map(r => [r._id, r.count]));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow">
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{data.totalUsers || 0}</div>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow">
          <div className="text-sm text-gray-500">Total Courses</div>
          <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{data.totalCourses || 0}</div>
        </div>
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow">
          <div className="text-sm text-gray-500">Total Revenue</div>
          <div className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">₹{Number(data.totalRevenue || 0).toFixed(2)}</div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow">
        <div className="text-sm text-gray-500">Role Distribution</div>
        <div className="mt-2 flex items-end gap-6">
          {['student','teacher','admin'].map((r) => (
            <div key={r} className="flex flex-col items-center">
              <div className="w-10 bg-indigo-500 rounded" style={{ height: `${(roleMap[r] || 0) * 6}px` }} />
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">{r} ({roleMap[r] || 0})</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
