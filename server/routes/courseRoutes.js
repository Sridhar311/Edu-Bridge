const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { protect, authorize } = require('../middleware/auth');
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  getAllCourses,
  getCourseById,
  getCoursesPublic,
  getCoursePublic,
} = require('../controllers/courseController');

// Public
router.get('/public', getCoursesPublic);
router.get('/public/:id', getCoursePublic);
router.get('/all', getAllCourses);

// Teacher protected
router.use(protect, authorize('teacher'));

router.post(
  '/',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'notes', maxCount: 1 },
  ]),
  createCourse
);

// Static routes first
router.get('/my', getMyCourses);

// Parameter routes after static to avoid conflicts
router.put(
  '/:id',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'notes', maxCount: 1 },
  ]),
  updateCourse
);

router.get('/:id', getCourseById);
router.delete('/:id', deleteCourse);

module.exports = router;
