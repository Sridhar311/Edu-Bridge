const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/contactController');

// Public submit
router.post('/', ctrl.submit);

// Admin list
router.get('/', protect, authorize('admin'), ctrl.list);
router.delete('/:id', protect, authorize('admin'), ctrl.remove);

module.exports = router;
