import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getCoursePublic } from '../utils/courseAPI';
import CheckoutModal from '../components/CheckoutModal';
import FakeCheckoutModal from '../components/FakeCheckoutModal';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { enrollFree } from '../utils/paymentAPI';
import { getMyEnrollments } from '../utils/studentAPI';

export default function CourseDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openFake, setOpenFake] = useState(false);
  const sandbox = String(import.meta.env.VITE_PAYMENT_SANDBOX || '').toLowerCase() === 'true';
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getCoursePublic(id);
        setCourse(res.data);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        if (!(isAuthenticated && user?.role === 'student')) return;
        const r = await getMyEnrollments();
        const set = new Set((r.data || []).map(e => String(e.course?._id || e.course?.id)));
        setIsEnrolled(set.has(String(id)));
      } catch {}
    })();
  }, [isAuthenticated, user?.role, id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 flex items-center justify-center text-gray-600 dark:text-gray-300">Loading…</div>
    </div>
  );
  if (!course) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 text-center text-gray-600 dark:text-gray-300">Course not found</div>
    </div>
  );

  const canBuy = isAuthenticated && user?.role === 'student';

  const onEnrollFree = async () => {
    try {
      if (!canBuy) return toast.error('Login as student to enroll');
      const res = await enrollFree(id);
      if (res.success) {
        toast.success('Enrolled successfully');
        // Redirect to player
        window.location.href = `/course-player/${id}`;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to enroll');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 pb-10 container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</motion.h1>
            <p className="mt-3 text-gray-700 dark:text-gray-300">{course.description}</p>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">What you'll learn</h2>
              <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                {(course.lectures || []).slice(0, 6).map((l, i) => (
                  <li key={i}>{l.title}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="sticky top-24 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow-xl">
              <div className="aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400">No thumbnail</span>
                )}
              </div>
              <div className="p-5">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{course.price ? `₹${course.price}` : 'Free'}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">By {course?.instructor?.name || '—'}</div>
                {isEnrolled ? (
                  <button onClick={() => (window.location.href = `/course-player/${id}`)} className="mt-4 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl">
                    Continue
                  </button>
                ) : Number(course.price || 0) <= 0 ? (
                  <button onClick={onEnrollFree} className="mt-4 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl">
                    {canBuy ? 'Enroll for Free' : 'Login as Student to Enroll'}
                  </button>
                ) : (
                  <button onClick={() => (canBuy ? (sandbox ? setOpenFake(true) : setOpen(true)) : toast.error('Login as student to purchase'))} className="mt-4 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl">
                    {canBuy ? 'Buy Now' : 'Login as Student to Buy'}
                  </button>
                )}
                <button className="mt-3 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">Preview Lecture</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal open={open} onClose={() => setOpen(false)} course={{ ...course, _id: id }} />
      {/* <FakeCheckoutModal open={openFake} onClose={() => setOpenFake(false)} course={{ ...course, _id: id }} /> */}
    </div>
  );
}
