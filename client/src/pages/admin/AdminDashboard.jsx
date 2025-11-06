import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import AdminStats from './AdminStats';
import ContactMessages from './ContactMessages';
import UserManagement from './UserManagement';
import CourseManagement from './CourseManagement';
import Transactions from './Transactions';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
  const [active, setActive] = useState('stats');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { key: 'stats', label: 'Dashboard Stats', icon: 'fas fa-chart-pie' },
    { key: 'users', label: 'User Management', icon: 'fas fa-users' },
    { key: 'courses', label: 'Course Management', icon: 'fas fa-book' },
    { key: 'transactions', label: 'Transactions', icon: 'fas fa-receipt' },
    { key: 'contacts', label: 'Contact Messages', icon: 'fas fa-envelope' },
  ];

  const currentSection = sections.find(s => s.key === active);

  const handleSectionChange = (key) => {
    setActive(key);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <Header />
      
      <div className="pt-16 max-w-7xl mx-auto">
        {/* Mobile Section Selector */}
        <div className="md:hidden sticky top-16 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-lg hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-3">
              <i className={`${currentSection?.icon} text-primary-600 dark:text-primary-400`}></i>
              <span className="font-semibold text-gray-900 dark:text-white">{currentSection?.label}</span>
            </div>
            <i className={`fas fa-chevron-down text-gray-600 dark:text-gray-400 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {sections.map((section) => (
                    <button
                      key={section.key}
                      onClick={() => handleSectionChange(section.key)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                        active === section.key ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 font-semibold' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <i className={section.icon}></i>
                      <span>{section.label}</span>
                      {active === section.key && (
                        <i className="fas fa-check ml-auto text-primary-600 dark:text-primary-400"></i>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex">
          <Sidebar active={active} onSelect={setActive} />
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            {active === 'stats' && <AdminStats />}
            {active === 'users' && <UserManagement />}
            {active === 'courses' && <CourseManagement />}
            {active === 'transactions' && <Transactions />}
            {active === 'contacts' && <ContactMessages />}
          </main>
        </div>
      </div>
    </div>
  );
}
