const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { protect, authorize } = require('../middleware/auth');

// GET /api/stats/summary
router.get('/summary', async (req, res) => {
  try {
    const [students, teachers, courses, enrollments] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      Course.countDocuments({}),
      Enrollment.countDocuments({ status: { $in: ['paid', 'created', 'failed'] } }),
    ]);

    res.json({ students, teachers, courses, enrollments });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// GET /api/stats/teacher/enrollments - list students enrolled in teacher's courses
router.get('/teacher/enrollments', protect, authorize('teacher'), async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await Course.find({ $or: [{ instructor: teacherId }, { createdBy: teacherId }] }).select('_id title').lean();
    const courseIds = courses.map((c) => c._id);
    if (courseIds.length === 0) return res.json({ data: [] });

    const list = await Enrollment.find({ course: { $in: courseIds }, status: 'paid' })
      .sort({ createdAt: -1 })
      .populate('student', 'name email')
      .populate('course', 'title')
      .lean();

    return res.json({ data: list });
  } catch (err) {
    console.error('Teacher enrollments error:', err);
    return res.status(500).json({ message: 'Failed to fetch enrollments' });
  }
});

// GET /api/stats/teacher - teacher-specific KPIs
router.get('/teacher', protect, authorize('teacher'), async (req, res) => {
  try {
    const teacherId = req.user.id;
    // Courses authored by teacher (support both instructor and createdBy fields)
    const courses = await Course.find({ $or: [{ instructor: teacherId }, { createdBy: teacherId }] }).select('_id').lean();
    const courseIds = courses.map(c => c._id);

    const totalCourses = courseIds.length;

    if (totalCourses === 0) {
      return res.json({ totalCourses: 0, studentsEnrolled: 0, totalRevenue: 0 });
    }

    // Distinct students enrolled (paid)
    const distinctStudents = await Enrollment.distinct('student', { course: { $in: courseIds }, status: 'paid' });
    const studentsEnrolled = distinctStudents.length;

    // Sum revenue from paid enrollments (teacher share 90%)
    const paidEnrollments = await Enrollment.aggregate([
      { $match: { course: { $in: courseIds }, status: 'paid' } },
      { $group: { _id: null, total: { $sum: { $multiply: [{ $ifNull: ['$amount', 0] }, 0.9] } } } },
    ]);
    const totalRevenue = paidEnrollments[0]?.total || 0;

    return res.json({ totalCourses, studentsEnrolled, totalRevenue });
  } catch (err) {
    console.error('Teacher stats error:', err);
    return res.status(500).json({ message: 'Failed to fetch teacher stats' });
  }
});

module.exports = router;
