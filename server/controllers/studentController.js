const crypto = require('crypto');
const mongoose = require('mongoose');
const razorpay = require('../utils/razorpay');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid course id' });
    }
    const course = await Course.findById(courseId).lean();
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const amountPaise = Math.max(0, Math.round((course.price || 0) * 100));

    // Idempotency: ensure single active enrollment per student/course
    let enrollment = await Enrollment.findOne({ course: courseId, student: req.user.id });
    if (!enrollment) {
      // create placeholder to prevent races
      enrollment = await Enrollment.create({ course: courseId, student: req.user.id, amount: course.price || 0, currency: 'INR', status: 'created' });
    }

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${enrollment._id.toString()}`,
      notes: { courseId: String(courseId), studentId: String(req.user.id) },
    });

    enrollment.razorpayOrderId = order.id;
    enrollment.amount = (course.price || 0);
    await enrollment.save();

    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        enrollmentId: enrollment._id,
        course: { id: String(course._id), title: course.title, price: course.price, thumbnailUrl: course.thumbnailUrl },
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature, enrollmentId } = req.body;
    if (!enrollmentId) return res.status(400).json({ success: false, message: 'Missing enrollmentId' });

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
    if (String(enrollment.student) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(order_id + '|' + payment_id);
    const expectedSignature = hmac.digest('hex');

    if (expectedSignature === signature) {
      // Mark paid
      enrollment.status = 'paid';
      enrollment.razorpayPaymentId = payment_id;
      enrollment.razorpaySignature = signature;
      await enrollment.save();

      // Add to course.studentsEnrolled
      await Course.findByIdAndUpdate(enrollment.course, { $addToSet: { studentsEnrolled: req.user.id } });

      return res.status(200).json({ success: true, data: { enrollmentId: enrollment._id, status: enrollment.status } });
    } else {
      enrollment.status = 'failed';
      await enrollment.save();
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const list = await Enrollment.find({ student: req.user.id, status: 'paid' })
      .populate('course', 'title thumbnailUrl price videoUrl notesUrl lectures')
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params; // courseId
    const { lectureId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course id' });
    }

    let enrollment = await Enrollment.findOne({ course: id, student: req.user.id, status: 'paid' });
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });

    if (lectureId) {
      await Enrollment.updateOne(
        { _id: enrollment._id },
        { $addToSet: { completedLectures: String(lectureId) } }
      );
      enrollment = await Enrollment.findById(enrollment._id);
    }

    const course = await Course.findById(id).lean();
    let totalLectures = (course?.lectures?.length) || 0;
    // If there are no structured lectures but there is a single videoUrl, treat it as 1 lecture
    if (totalLectures === 0 && course?.videoUrl) {
      totalLectures = 1;
    }
    const completed = totalLectures === 1
      ? ((enrollment.completedLectures || []).length > 0 ? 1 : 0)
      : (enrollment.completedLectures || []).length;
    const percent = totalLectures > 0 ? Math.round((completed / totalLectures) * 100) : 0;

    enrollment.progressPercent = percent;
    await enrollment.save();

    return res.status(200).json({ success: true, data: { progressPercent: percent, completedLectures: enrollment.completedLectures } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
