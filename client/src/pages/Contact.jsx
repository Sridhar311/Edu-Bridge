import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { submitContact } from '../utils/contactAPI';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in your name, email and message');
      return;
    }
    try {
      setSubmitting(true);
      await submitContact(form);
      toast.success('Thanks! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 pb-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-gray-900 dark:text-white">
            Contact Us
          </motion.h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
            Have questions, feedback, or need support? Send us a message and we will respond as soon as possible.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur bg-white/70 dark:bg-gray-800/60 shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <textarea rows={6} name="message" value={form.message} onChange={handleChange} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="flex items-center justify-end">
                  <button disabled={submitting} className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60">
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur bg-white/70 dark:bg-gray-800/60 shadow">
                <div className="text-sm text-gray-500">Email</div>
                <div className="mt-1 font-medium text-gray-900 dark:text-white">sridharcurious135@gmail.com</div>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur bg-white/70 dark:bg-gray-800/60 shadow">
                <div className="text-sm text-gray-500">Address</div>
                <div className="mt-1 font-medium text-gray-900 dark:text-white">Coimbatore, IN</div>
              </div>
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur bg-white/70 dark:bg-gray-800/60 shadow">
                <div className="text-sm text-gray-500">Hours</div>
                <div className="mt-1 font-medium text-gray-900 dark:text-white">Mon–Fri, 9:00 AM – 6:00 PM IST</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
