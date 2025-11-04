const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  // Simple progress tracking
  completedLectures: [{ type: String }],
  progressPercent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

EnrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
