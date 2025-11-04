import React, { useState } from 'react';
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <Header />
      <div className="pt-16 max-w-7xl mx-auto flex">
        <Sidebar active={active} onSelect={setActive} />
        <main className="flex-1 p-4 md:p-6">
          {active === 'stats' && <AdminStats />}
          {active === 'users' && <UserManagement />}
          {active === 'courses' && <CourseManagement />}
          {active === 'transactions' && <Transactions />}
          {active === 'contacts' && <ContactMessages />}
        </main>
      </div>
    </div>
  );
}
