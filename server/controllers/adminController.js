const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
let Transaction;
try { Transaction = require('../models/Transaction'); } catch (e) { /* optional */ }

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email role approved createdAt').lean();
    const grouped = users.reduce((acc, u) => {
      acc[u.role] = acc[u.role] || [];
      acc[u.role].push(u);
      return acc;
    }, {});
    return res.status(200).json({ success: true, data: { users, grouped } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid user id' });
    const user = await User.findByIdAndUpdate(id, { $set: { approved: true, role: 'teacher' } }, { new: true }).select('name email role approved');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.rejectTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid user id' });
    const user = await User.findByIdAndUpdate(id, { $set: { approved: false } }, { new: true }).select('name email role approved');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .select('title price createdAt createdBy instructor studentsEnrolled thumbnailUrl')
      .populate('instructor', 'name email')
      .lean();
    const mapped = courses.map(c => ({
      ...c,
      enrolledCount: Array.isArray(c.studentsEnrolled) ? c.studentsEnrolled.length : (Array.isArray(c.students) ? c.students.length : 0),
      teacher: c.instructor,
    }));
    return res.status(200).json({ success: true, data: mapped });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid user id' });

    await Enrollment.deleteMany({ student: id });
    await Course.updateMany({}, { $pull: { studentsEnrolled: id, students: id } });

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // If user was a teacher, optionally remove their courses
    await Course.deleteMany({ $or: [{ createdBy: id }, { instructor: id }] });

    return res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid course id' });

    await Enrollment.deleteMany({ course: id });
    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    return res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalCourses] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
    ]);

    let totalRevenue = 0;
    if (Enrollment) {
      const paid = await Enrollment.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, revenue: { $sum: { $multiply: [{ $ifNull: ['$amount', 0] }, 0.10] } } } },
      ]);
      totalRevenue += paid?.[0]?.revenue || 0;
    }
    if (Transaction) {
      const t = await Transaction.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, revenue: { $sum: '$amount' } } },
      ]);
      totalRevenue += t?.[0]?.revenue || 0;
    }

    // Role distribution
    const byRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    return res.status(200).json({ success: true, data: { totalUsers, totalCourses, totalRevenue, byRole } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
