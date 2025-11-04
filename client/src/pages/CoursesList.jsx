import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getCoursesPublic } from '../utils/courseAPI';
import { getMyEnrollments } from '../utils/studentAPI';
import { useAuth } from '../context/AuthContext';
import { enrollFree } from '../utils/paymentAPI';
import Navbar from '../components/Navbar';

export default function CoursesList() {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [enrolled, setEnrolled] = useState([]);
  const limit = 12;

  const canBuy = isAuthenticated && user?.role === 'student';

  const onEnrollFree = async (courseId) => {
    try {
      if (!canBuy) return;
      const res = await enrollFree(courseId);
      if (res.success) {
        try {
          const r = await getMyEnrollments();
          setEnrolled(r.data || []);
        } catch {}
      }
    } catch (err) {
      // optional: handle error
    }
  };

  const load = async (p = 1, q = '') => {
    try {
      setLoading(true);
      const res = await getCoursesPublic({ page: p, limit, search: q });
      setItems(res.data || []);
      setTotal(res.total || 0);
      setPage(res.page || 1);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1, ''); }, []);

  useEffect(() => {
    (async () => {
      if (!(isAuthenticated && user?.role === 'student')) return;
      try {
        const res = await getMyEnrollments();
        setEnrolled(res.data || []);
      } catch (e) {
        // ignore silently
      }
    })();
  }, [isAuthenticated, user?.role]);

  const enrolledSet = useMemo(() => new Set(enrolled.map(e => String(e.course?._id || e.course?.id))), [enrolled]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 pb-10 container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Courses</h1>
          <div className="flex items-center gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses" className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 outline-none" />
            <button onClick={() => load(1, search)} className="px-4 py-2 rounded-xl bg-primary-600 text-white">Search</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-300">Loading…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((c, idx) => (
                <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  className="group h-full rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/60 shadow-sm hover:shadow-xl hover:border-gray-400 dark:hover:border-gray-500 transition-all">
                  <div className="h-40 bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-t-2xl overflow-hidden">
                    {c.thumbnailUrl ? (
                      <img src={c.thumbnailUrl} alt={c.title} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No thumbnail</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col h-[210px] border border-gray-300 dark:border-gray-600 rounded-b-2xl">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="flex-1 text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{c.title}</h3>
                      {enrolledSet.has(String(c._id)) && (
                        <span className="shrink-0 inline-block px-2 py-0.5 rounded-md text-xs bg-green-100 text-green-700">Purchased</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{c.description}</p>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-2">
                          {c.price ? `₹${c.price}` : 'Free'}
                          {!c.price && <span className="px-2 py-0.5 text-xs rounded-md bg-emerald-100 text-emerald-700">FREE</span>}
                        </span>
                        <span className="text-xs text-gray-500">{c.instructor?.name || '—'}</span>
                      </div>
                      {Number(c.price || 0) <= 0 && canBuy && !enrolledSet.has(String(c._id)) ? (
                        <button onClick={() => onEnrollFree(c._id)} className="mt-3 inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-sm group-hover:shadow transition">
                          Enroll for Free
                        </button>
                      ) : (
                        <Link to={`/course/${c._id}`} className="mt-3 inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-sm group-hover:shadow transition">
                          View Course
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
              <button disabled={page <= 1} onClick={() => load(page - 1, search)} className="px-3 py-1 rounded border disabled:opacity-50">Prev</button>
              <span className="text-gray-700 dark:text-gray-200">Page {page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => load(page + 1, search)} className="px-3 py-1 rounded border disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
