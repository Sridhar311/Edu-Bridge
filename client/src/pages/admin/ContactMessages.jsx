import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { listContacts, deleteContact } from '../../utils/contactAPI';

export default function ContactMessages() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await listContacts();
        setRows(res.data || []);
      } catch (e) {
        toast.error(e?.response?.data?.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteContact(id);
      setRows((prev) => prev.filter((x) => x._id !== id));
      toast.success('Message deleted');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h2>
        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-medium">
          {rows.length} messages
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-envelope text-2xl text-gray-400"></i>
          </div>
          <p className="text-gray-600 dark:text-gray-400">No messages yet</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Message</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {rows.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{r.name}</td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${r.email}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                        {r.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{r.subject || '-'}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-md truncate">{r.message}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-xs font-medium"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {rows.map((r) => (
              <div key={r._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{r.name}</h3>
                    <a 
                      href={`mailto:${r.email}`} 
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline break-all"
                    >
                      {r.email}
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="ml-2 p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex-shrink-0"
                  >
                    <i className="fas fa-trash text-sm"></i>
                  </button>
                </div>

                {r.subject && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Subject:</span>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{r.subject}</p>
                  </div>
                )}

                <div className="mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Message:</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{r.message}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    <i className="fas fa-clock mr-1"></i>
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
