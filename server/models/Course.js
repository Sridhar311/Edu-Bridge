const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  // Phase 1 field kept for compatibility
  thumbnail: {
    type: String,
    default: '',
  },
  // Phase 2 explicit URLs
  thumbnailUrl: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  notesUrl: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
  },
  // Phase 1 naming kept, Phase 2 uses createdBy
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  studentsEnrolled: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  lectures: [
    {
      title: String,
      videoUrl: String,
      description: String,
      duration: Number,
      order: Number,
    },
  ],
  resources: [
    {
      title: String,
      fileUrl: String,
      type: String, // pdf, doc, etc.
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CourseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', CourseSchema);

