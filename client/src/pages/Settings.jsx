import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { getProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [themeDark, setThemeDark] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/profile');
        setProfile(res.data?.user || null);
        setDisplayName(res.data?.user?.name || '');
      } catch (e) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pref_theme_dark');
      if (saved === 'true') {
        document.documentElement.classList.add('dark');
        setThemeDark(true);
      }
      const m = localStorage.getItem('pref_notif_email');
      if (m === 'false') setNotifEmail(false);
    } catch {}
  }, []);

  const saveTheme = (v) => {
    setThemeDark(v);
    try {
      localStorage.setItem('pref_theme_dark', String(v));
    } catch {}
    if (v) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    toast.success(`Theme ${v ? 'Dark' : 'Light'}`);
  };

  const saveNotif = (v) => {
    setNotifEmail(v);
    try { localStorage.setItem('pref_notif_email', String(v)); } catch {}
    toast.success('Preference saved');
  };

  const onSaveName = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch('/auth/profile', { name: displayName });
      setProfile(res.data.user);
      // Refresh global auth context so Navbar reflects the new name
      try { await getProfile(); } catch {}
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
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
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Settings</h1>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="font-semibold text-gray-900 dark:text-white">Account</div>
                <form onSubmit={onSaveName} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Display name</label>
                    <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Email</label>
                    <input value={profile?.email || ''} disabled className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-gray-500" />
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white">Save</button>
                </form>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="font-semibold text-gray-900 dark:text-white">Security</div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300">New password</label>
                    <input type="password" placeholder="••••••••" className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300">Confirm new password</label>
                    <input type="password" placeholder="••••••••" className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 outline-none" />
                  </div>
                </div>
                <button disabled className="mt-4 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed">Change password (disabled)</button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="font-semibold text-gray-900 dark:text-white">Profile</div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 text-white flex items-center justify-center text-lg">
                    {profile?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white font-semibold">{profile?.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{profile?.role}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/60 p-6">
                <div className="font-semibold text-gray-900 dark:text-white">Preferences</div>
                <div className="mt-4 space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-200">Dark theme</span>
                    <input type="checkbox" checked={themeDark} onChange={(e) => saveTheme(e.target.checked)} />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-200">Email notifications</span>
                    <input type="checkbox" checked={notifEmail} onChange={(e) => saveNotif(e.target.checked)} />
                  </label>
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
