import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title = 'Admin Dashboard' }) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/60 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
          <p className="text-sm text-gray-500">Platform moderation and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm"
          >
            Toggle Theme
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin'}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
