const crypto = require('crypto');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(courseId)) return res.status(400).json({ success: false, message: 'Invalid course id' });

    const course = await Course.findById(courseId).select('price title');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const price = Number(course.price || 0);
    if (price <= 0) return res.status(400).json({ success: false, message: 'Course is not purchasable' });

    // Prevent duplicate paid enrollment
    const existsPaid = await Enrollment.findOne({ course: courseId, student: req.user.id, status: 'paid' });
    if (existsPaid) return res.status(400).json({ success: false, message: 'Already purchased' });

    const receipt = crypto.randomUUID();
    const options = {
      amount: Math.round(price * 100),
      currency: 'INR',
      receipt,
      payment_capture: 1,
    };
    const order = await rzp.orders.create(options);

    // Reuse existing enrollment doc for this course+student if any (status may be 'created'/'failed')
    const enrollment = await Enrollment.findOneAndUpdate(
      { course: courseId, student: req.user.id },
      {
        $set: {
          amount: price,
          currency: 'INR',
          razorpayOrderId: order.id,
          status: 'created',
          receipt,
        },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt,
        keyId: process.env.RAZORPAY_KEY_ID,
        enrollmentId: enrollment._id,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Sandbox: simulate a successful payment for paid courses
exports.sandboxPay = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(courseId)) return res.status(400).json({ success: false, message: 'Invalid course id' });

    const course = await Course.findById(courseId).select('price title');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const price = Number(course.price || 0);
    if (price <= 0) return res.status(400).json({ success: false, message: 'Use free enroll for free courses' });

    // Upsert to avoid duplicate key errors on (course,student)
    const enrollment = await Enrollment.findOneAndUpdate(
      { course: courseId, student: req.user.id },
      { $set: { amount: price, currency: 'INR', status: 'paid' } },
      { upsert: true, new: true }
    );

    await Course.findByIdAndUpdate(courseId, { $addToSet: { studentsEnrolled: req.user.id } });

    const populated = await Enrollment.findById(enrollment._id).populate('course', 'title thumbnailUrl notesUrl videoUrl lectures price').lean();
    return res.status(200).json({ success: true, data: populated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, payment_id, signature, enrollmentId } = req.body;
    if (!order_id || !payment_id || !signature || !enrollmentId) return res.status(400).json({ success: false, message: 'Missing parameters' });

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${order_id}|${payment_id}`);
    const digest = shasum.digest('hex');

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });

    if (digest === signature) {
      if (enrollment.status !== 'paid') {
        enrollment.status = 'paid';
        enrollment.razorpayPaymentId = payment_id;
        enrollment.razorpaySignature = signature;
        await enrollment.save();
        // Ensure student added to course's enrolled list (avoid duplicates)
        await Course.findByIdAndUpdate(enrollment.course, { $addToSet: { studentsEnrolled: enrollment.student } });
      }
      const populated = await Enrollment.findById(enrollmentId).populate('course', 'title thumbnailUrl notesUrl videoUrl lectures price').lean();
      return res.status(200).json({ success: true, data: populated });
    } else {
      enrollment.status = 'failed';
      await enrollment.save();
      return res.status(400).json({ success: false, message: 'Signature verification failed' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.webhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return res.status(400).end();

    const signature = req.headers['x-razorpay-signature'];
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(req.body); // raw buffer
    const digest = hmac.digest('hex');

    if (digest !== signature) return res.status(400).end();

    const event = JSON.parse(req.body.toString('utf8'));
    if (event?.entity === 'event') {
      const payload = event.payload || {};
      const orderId = payload?.payment?.entity?.order_id || payload?.order?.entity?.id;
      const status = payload?.payment?.entity?.status || event?.event;

      if (orderId) {
        const enr = await Enrollment.findOne({ razorpayOrderId: orderId });
        if (enr && status === 'captured') {
          if (enr.status !== 'paid') {
            enr.status = 'paid';
            enr.razorpayPaymentId = payload?.payment?.entity?.id || enr.razorpayPaymentId;
            await enr.save();
            await Course.findByIdAndUpdate(enr.course, { $addToSet: { studentsEnrolled: enr.student } });
          }
        }
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const list = await Enrollment.find({ student: req.user.id }).sort({ createdAt: -1 }).populate('course').lean();
    return res.status(200).json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTransactionsAdmin = async (req, res) => {
  try {
    const list = await Enrollment.find().sort({ createdAt: -1 }).populate('course', 'title').populate('student', 'name email').lean();
    return res.status(200).json({ success: true, data: list });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Enroll a student in a free course (price <= 0)
exports.enrollFree = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(courseId)) return res.status(400).json({ success: false, message: 'Invalid course id' });

    const course = await Course.findById(courseId).select('price title');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const price = Number(course.price || 0);
    if (price > 0) return res.status(400).json({ success: false, message: 'Course is paid' });

    // If already enrolled as paid/free, return success
    let enr = await Enrollment.findOne({ course: courseId, student: req.user.id });
    if (enr && enr.status === 'paid') {
      return res.status(200).json({ success: true, data: enr });
    }

    if (!enr) {
      enr = await Enrollment.create({
        course: courseId,
        student: req.user.id,
        amount: 0,
        currency: 'INR',
        status: 'paid',
      });
    } else {
      enr.status = 'paid';
      enr.amount = 0;
      await enr.save();
    }

    await Course.findByIdAndUpdate(courseId, { $addToSet: { studentsEnrolled: req.user.id } });

    const populated = await Enrollment.findById(enr._id).populate('course', 'title thumbnailUrl notesUrl videoUrl lectures price').lean();
    return res.status(200).json({ success: true, data: populated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
