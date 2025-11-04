import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { createOrder, verifyPayment } from '../utils/paymentAPI';
import { useNavigate } from 'react-router-dom';
import ReceiptModal from './ReceiptModal';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutModal({ open, onClose, course }) {
  const [loading, setLoading] = useState(false);
  const [preferCard, setPreferCard] = useState(false);
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      // load sticky preference
      try {
        const pref = localStorage.getItem('checkout_prefer_card');
        setPreferCard(pref === 'true');
      } catch {}
      const ok = await loadRazorpayScript();
      if (!ok) toast.error('Failed to load payment SDK');
    })();
  }, [open]);

  const handlePay = async (opts = { upiIntent: false }) => {
    try {
      setLoading(true);
      const ok = await loadRazorpayScript();
      if (!ok) return toast.error('Failed to load Razorpay');

      // create order
      const resp = await createOrder(course._id);
      const { orderId, amount, keyId, enrollmentId } = resp.data || {};
      const displayAmount = (amount / 100).toFixed(2);

      const options = {
        key: keyId,
        amount,
        currency: 'INR',
        name: 'EduVerse',
        description: course.title,
        image: course.thumbnailUrl,
        order_id: orderId,
        prefill: {},
        handler: async function (response) {
          try {
            const payload = {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              enrollmentId,
            };
            const verifyRes = await verifyPayment(payload);
            if (verifyRes.success) {
              toast.success('Payment successful');
              setReceipt({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: displayAmount,
                courseTitle: course.title,
                date: new Date().toISOString(),
              });
            } else {
              toast.error('Verification failed');
            }
          } catch (e) {
            toast.error(e?.response?.data?.message || 'Failed to verify payment');
          }
        },
        theme: { color: '#4f46e5' },
        config: {
          display: {
            blocks: {
              upi: { name: 'UPI', instruments: [
                { method: 'upi', flows: ['intent', 'collect'] }
              ] },
              card: { name: 'Cards', instruments: [{ method: 'card' }] },
              netbanking: { name: 'NetBanking', instruments: [{ method: 'netbanking' }] },
              wallet: { name: 'Wallet', instruments: [{ method: 'wallet' }] },
              paylater: { name: 'PayLater', instruments: [{ method: 'paylater' }] },
            },
            sequence: (preferCard
              ? ['block.card', 'block.netbanking', 'block.wallet', 'block.paylater', 'block.upi']
              : ['block.upi', 'block.card', 'block.netbanking', 'block.wallet', 'block.paylater']
            ),
            preferences: { show_default_blocks: true, show_payment_mode_switch: true },
          },
        },
      };

      if (opts.upiIntent) {
        options.method = 'upi';
        options.config.display.sequence = ['block.upi'];
        options.config.display.preferences = { show_default_blocks: true, show_payment_mode_switch: true };
      }

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (resp) {
        const code = resp?.error?.code;
        const desc = resp?.error?.description;
        toast.error(`${code || 'payment_failed'}: ${desc || 'Payment failed'}`);
      });

      rzp.open();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl"
            initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Checkout</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {course?.thumbnailUrl ? (
                    <img src={course.thumbnailUrl} alt="thumb" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-500">No image</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{course?.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Price: {course?.price ? `₹${course.price}` : 'Free'}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                You can pay via UPI by scanning a QR code for <span className="font-semibold">₹{course?.price ? Number(course.price).toFixed(2) : (course.price / 100).toFixed(2)}</span>.
                <div className="mt-1 text-xs text-gray-500">
                  Tip: Use your UPI app (Google Pay/PhonePe/Paytm) scanner. Generic camera scanners may not work with UPI QR.
                </div>
              </div>
              <button
                disabled={loading}
                onClick={() => handlePay({ upiIntent: false })}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50"
              >
                {loading ? 'Processing…' : 'Proceed to Pay'}
              </button>
              <button
                disabled={loading}
                onClick={() => handlePay({ upiIntent: true })}
                className="w-full mt-2 py-3 rounded-xl border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 disabled:opacity-50"
              >
                Pay with UPI app (GPay/PhonePe)
              </button>
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <i className="fas fa-lock" /> Secure payment processed by Razorpay
              </p>
              <button
                onClick={() => { try { localStorage.setItem('checkout_prefer_card', 'true'); } catch {}; setPreferCard(true); handlePay({ upiIntent: false }); }}
                disabled={loading}
                className="text-primary-600 hover:underline"
              >
                Use Card / NetBanking instead
              </button>
              {preferCard && (
                <button
                  onClick={() => { try { localStorage.setItem('checkout_prefer_card', 'false'); } catch {}; setPreferCard(false); handlePay({ upiIntent: false }); }}
                  disabled={loading}
                  className="text-gray-600 hover:underline"
                >
                  Prefer UPI
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      {receipt && (
        <ReceiptModal data={receipt} onClose={() => {
          setReceipt(null);
          onClose?.();
          navigate('/student/dashboard');
        }} />
      )}
    </AnimatePresence>
  );
}
