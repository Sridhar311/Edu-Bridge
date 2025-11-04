import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../../utils/paymentAPI';
import toast from 'react-hot-toast';

export default function Transactions() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getAllTransactions();
        setItems(res.data || []);
      } catch (e) {
        toast.error(e?.response?.data?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transactions</h2>
        <button onClick={() => window.location.reload()} className="px-3 py-2 rounded-lg border">Refresh</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2 text-left">Course</th>
              <th className="px-4 py-2 text-left">Student</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-center text-gray-600" colSpan={7}>Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-4 py-6 text-center text-gray-600" colSpan={7}>No transactions</td></tr>
            ) : items.map(t => (
              <tr key={t._id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 text-center">{new Date(t.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">{t.course?.title}</td>
                <td className="px-4 py-3">{t.student?.name} <span className="text-gray-500 text-xs">({t.student?.email})</span></td>
                <td className="px-4 py-3 text-center">₹{Number(t.amount || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded ${t.status === 'paid' ? 'bg-green-100 text-green-700' : t.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{t.status}</span>
                </td>
                <td className="px-4 py-3 text-xs font-mono">{t.razorpayOrderId}</td>
                <td className="px-4 py-3 text-xs font-mono">{t.razorpayPaymentId || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
