const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  verifyPayment,
  getMyEnrollments,
  updateProgress,
} = require('../controllers/studentController');

// All routes here require student auth
router.use(protect, authorize('student'));

// Payments
router.post('/enroll/create-order', createOrder);
router.post('/enroll/verify-payment', verifyPayment);

// Enrollments
router.get('/enroll/my', getMyEnrollments);

// Progress
router.post('/courses/:id/progress', updateProgress);

module.exports = router;
