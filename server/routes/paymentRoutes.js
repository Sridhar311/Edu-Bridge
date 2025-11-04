const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/paymentController');

// Student-protected payment flows
router.post('/create-order', protect, authorize('student'), ctrl.createOrder);
router.post('/verify', protect, authorize('student'), ctrl.verifyPayment);
router.get('/my', protect, authorize('student'), ctrl.getMyEnrollments);
router.post('/enroll-free', protect, authorize('student'), ctrl.enrollFree);
router.post('/sandbox/pay', protect, authorize('student'), ctrl.sandboxPay);

// Admin
router.get('/all', protect, authorize('admin'), ctrl.getTransactionsAdmin);

module.exports = router;
