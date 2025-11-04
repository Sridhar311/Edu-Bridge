import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">About EduBridge</h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">We empower learners and educators with a modern, delightful, and data-driven platform for teaching and learning.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white flex items-center justify-center text-xl"><i className="fas fa-rocket" /></div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Our Mission</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Make quality education accessible with engaging content, trusted instructors, and seamless payments.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xl"><i className="fas fa-shield-alt" /></div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Secure & Reliable</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Razorpay-powered payments, protected sessions, and role-based access to keep your data safe.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-2xl p-6 border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center text-xl"><i className="fas fa-chart-line" /></div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">Insights & Progress</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Track enrollments, progress, and revenue with a professional admin dashboard.</p>
            </motion.div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.img initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} src="/hero-education.jpg" alt="Learning" className="w-full rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 object-cover" onError={(e)=>{e.currentTarget.style.display='none';}} />
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Built with modern tech</h2>
              <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
                <li><i className="fas fa-check text-emerald-600 mr-2"/>React, Tailwind CSS, Framer Motion</li>
                <li><i className="fas fa-check text-emerald-600 mr-2"/>Node.js, Express, MongoDB (Mongoose)</li>
                <li><i className="fas fa-check text-emerald-600 mr-2"/>JWT Auth with httpOnly cookies</li>
                <li><i className="fas fa-check text-emerald-600 mr-2"/>Razorpay UPI, Cards, NetBanking</li>
              </ul>
              <div className="mt-6 flex gap-3">
                <a href="/courses" className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-lg">Browse Courses</a>
                <a href="/signup" className="px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">Get Started</a>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 rounded-2xl p-8 bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-xl">
            <h3 className="text-2xl font-bold">Join EduBridge today</h3>
            <p className="mt-1 opacity-90">Learn, teach, and grow with a platform designed for success.</p>
            <div className="mt-4">
              <a href="/signup" className="inline-block px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20">Create an account</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
