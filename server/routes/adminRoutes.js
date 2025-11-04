const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  approveTeacher,
  rejectTeacher,
  getAllCourses,
  deleteUser,
  deleteCourse,
  getStats,
} = require('../controllers/adminController');

// All admin routes are protected and require admin role
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/approve-teacher/:id', approveTeacher);
router.put('/reject-teacher/:id', rejectTeacher);
router.get('/courses', getAllCourses);
router.delete('/user/:id', deleteUser);
router.delete('/course/:id', deleteCourse);
router.get('/stats', getStats);

module.exports = router;
