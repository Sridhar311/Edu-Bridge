import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReceiptModal({ data, onClose }) {
  if (!data) return null;
  const onPrint = () => {
    const win = window.open('', '_blank');
    const html = `<!doctype html><html><head><title>Receipt</title><style>body{font-family:system-ui,Segoe UI,Arial;padding:24px}h1{font-size:20px}table{width:100%;border-collapse:collapse;margin-top:12px}td{padding:8px;border-bottom:1px solid #eee}</style></head><body><h1>EduVerse Payment Receipt</h1><table><tr><td>Course</td><td>${data.courseTitle}</td></tr><tr><td>Amount</td><td>₹${data.amount}</td></tr><tr><td>Order ID</td><td>${data.orderId}</td></tr><tr><td>Payment ID</td><td>${data.paymentId}</td></tr><tr><td>Date</td><td>${new Date(data.date).toLocaleString()}</td></tr></table></body></html>`;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl"
          initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Receipt</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="mt-4 space-y-2 text-gray-800 dark:text-gray-200">
            <div className="flex justify-between"><span>Course</span><span className="font-medium">{data.courseTitle}</span></div>
            <div className="flex justify-between"><span>Amount</span><span className="font-medium">₹{data.amount}</span></div>
            <div className="flex justify-between"><span>Order ID</span><span className="font-mono text-xs">{data.orderId}</span></div>
            <div className="flex justify-between"><span>Payment ID</span><span className="font-mono text-xs">{data.paymentId}</span></div>
            <div className="flex justify-between"><span>Date</span><span>{new Date(data.date).toLocaleString()}</span></div>
          </div>
          <div className="mt-6 flex gap-2">
            <button onClick={onPrint} className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white">Download / Print</button>
            <button onClick={onClose} className="px-4 py-2 rounded-xl border">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
