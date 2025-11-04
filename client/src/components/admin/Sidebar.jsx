import React from 'react';

export default function Sidebar({ active, onSelect }) {
  const items = [
    { key: 'stats', label: 'Stats', icon: 'fas fa-chart-pie' },
    { key: 'users', label: 'Users', icon: 'fas fa-users' },
    { key: 'courses', label: 'Courses', icon: 'fas fa-book' },
    { key: 'transactions', label: 'Transactions', icon: 'fas fa-receipt' },
    { key: 'contacts', label: 'Contact Messages', icon: 'fas fa-envelope' },
  ];
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 backdrop-blur hidden md:block">
      <div className="p-4 text-lg font-bold">Admin</div>
      <nav className="px-2 py-2 space-y-1">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onSelect(it.key)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${active === it.key ? 'bg-gray-100 dark:bg-gray-800 font-semibold' : ''}`}
          >
            <i className={`${it.icon} w-5 text-gray-600`} />
            <span>{it.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
