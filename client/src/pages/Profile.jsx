import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/profile');
        setProfile(res.data?.user || null);
      } catch (e) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Navbar />
        <div className="pt-24 flex items-center justify-center text-gray-600 dark:text-gray-300">Loading…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <Navbar />
        <div className="pt-24 text-center text-gray-600 dark:text-gray-300">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Profile</h1>
            <Link to="/settings" className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white">Edit Profile</Link>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-white flex items-center justify-center text-xl">
                    {profile?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{profile.email}</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Role</div>
                    <div className="mt-1 font-semibold text-gray-900 dark:text-white">{profile.role}</div>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="text-xs uppercase tracking-wide text-gray-500">Joined</div>
                    <div className="mt-1 font-semibold text-gray-900 dark:text-white">{new Date(profile.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="font-semibold text-gray-900 dark:text-white">Security</div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Password and 2FA settings are managed in Settings.</p>
                <Link to="/settings" className="mt-3 inline-block px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">Go to Settings</Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="font-semibold text-gray-900 dark:text-white">Account Status</div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${profile.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {profile.approved ? 'Approved' : 'Pending approval'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="font-semibold text-gray-900 dark:text-white">Quick Actions</div>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  <Link to="/courses" className="px-3 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-center">Browse Courses</Link>
                  <Link to="/student/dashboard" className="px-3 py-2 rounded-lg border text-center">Student Dashboard</Link>
                  <Link to="/teacher/dashboard" className="px-3 py-2 rounded-lg border text-center">Teacher Dashboard</Link>
                  <Link to="/admin/dashboard" className="px-3 py-2 rounded-lg border text-center">Admin Dashboard</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
