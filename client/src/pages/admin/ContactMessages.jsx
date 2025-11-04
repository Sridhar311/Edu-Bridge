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

  if (loading) return <div className="text-gray-600 dark:text-gray-300">Loading messages…</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Messages</h2>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/70 dark:bg-gray-800/60 divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((r) => (
              <tr key={r._id}>
                <td className="px-4 py-3 text-gray-900 dark:text-white">{r.name}</td>
                <td className="px-4 py-3 text-primary-600"><a href={`mailto:${r.email}`}>{r.email}</a></td>
                <td className="px-4 py-3 text-gray-900 dark:text-white">{r.subject || '-'}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-200 max-w-xl">{r.message}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={async () => {
                      if (!window.confirm('Delete this message?')) return;
                      try {
                        await deleteContact(r._id);
                        setRows((prev) => prev.filter((x) => x._id !== r._id));
                        toast.success('Deleted');
                      } catch (e) {
                        toast.error(e?.response?.data?.message || 'Failed to delete');
                      }
                    }}
                    className="px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
