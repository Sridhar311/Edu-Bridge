import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { sandboxPay } from '../utils/paymentAPI';

export default function FakeCheckoutModal({ open, onClose, course }) {
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState('gpay'); // gpay | upi | netbanking

  if (!open) return null;

  const amount = Number(course?.price || 0);

  const onConfirm = async () => {
    try {
      setPaying(true);
      const res = await sandboxPay(course?._id || course?.id);
      if (res.success) {
        toast.success('Payment successful. You are enrolled!');
        onClose?.();
        window.location.href = `/course-player/${course?._id || course?.id}`;
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Sandbox payment failed');
    } finally {
      setPaying(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">Checkout</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Sandbox payment (testing only)</div>
          </div>
          <div className="px-6 py-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300">Course</div>
              <div className="font-semibold text-gray-900 dark:text-white line-clamp-1 ml-4">{course?.title || 'Course'}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300">Amount</div>
              <div className="font-bold text-gray-900 dark:text-white">₹{amount.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Select payment method</div>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={() => setMethod('gpay')} className={`px-4 py-3 rounded-xl border text-left ${method==='gpay' ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' : 'border-gray-300 dark:border-gray-600'}`}>
                  <div className="font-medium">GPay / PhonePe</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Pay via UPI apps</div>
                </button>
                <button onClick={() => setMethod('upi')} className={`px-4 py-3 rounded-xl border text-left ${method==='upi' ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' : 'border-gray-300 dark:border-gray-600'}`}>
                  <div className="font-medium">UPI ID</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Pay using your UPI ID</div>
                </button>
                <button onClick={() => setMethod('netbanking')} className={`px-4 py-3 rounded-xl border text-left ${method==='netbanking' ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' : 'border-gray-300 dark:border-gray-600'}`}>
                  <div className="font-medium">Netbanking</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Pay via Internet banking</div>
                </button>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">Cancel</button>
            <button onClick={onConfirm} disabled={paying} className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white disabled:opacity-60">
              {paying ? 'Processing…' : 'Confirm Pay'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
