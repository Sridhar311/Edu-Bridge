import React, { useEffect, useMemo, useState } from 'react';
import { getAllCourses, deleteCourse } from '../../utils/adminApi';
import toast from 'react-hot-toast';

export default function CourseManagement() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res = await getAllCourses();
      setCourses(res.data || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => courses.filter(c => {
    const q = query.trim().toLowerCase();
    return !q || c.title?.toLowerCase().includes(q) || c?.teacher?.name?.toLowerCase().includes(q);
  }), [courses, query]);

  const onDelete = async (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted');
      setCourses(prev => prev.filter(c => String(c._id) !== String(id)));
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Course Management</h2>
        <div className="flex items-center gap-2">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search title/teacher" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60"/>
          <button onClick={load} className="px-3 py-2 rounded-lg border">Refresh</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2">Teacher</th>
              <th className="px-4 py-2">Enrolled</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-center text-gray-600" colSpan={5}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="px-4 py-6 text-center text-gray-600" colSpan={5}>No courses</td></tr>
            ) : filtered.map(c => (
              <tr key={c._id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-10 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                      {c.thumbnailUrl ? <img src={c.thumbnailUrl} alt={c.title} className="w-full h-full object-cover"/> : <span className="text-xs text-gray-500">No img</span>}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white line-clamp-1">{c.title}</div>
                      <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{c.teacher?.name || '—'}</td>
                <td className="px-4 py-3 text-center">{c.enrolledCount || 0}</td>
                <td className="px-4 py-3 text-center">{c.price ? `₹${c.price}` : 'Free'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => onDelete(c._id)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
