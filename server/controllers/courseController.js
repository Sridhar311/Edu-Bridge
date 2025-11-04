const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const cloudinary = require('../utils/cloudinary');

function removeLocal(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, () => {});
}

async function uploadToCloudinary(file, type) {
  if (!file) return null;
  const options = {};
  if (type === 'image') options.resource_type = 'image';
  else if (type === 'video') options.resource_type = 'video';
  else options.resource_type = 'raw';

  try {
    let res;
    if (type === 'video') {
      // Use chunked upload for large videos
      res = await cloudinary.uploader.upload_large(file.path, { ...options, chunk_size: 6_000_000 });
    } else {
      res = await cloudinary.uploader.upload(file.path, options);
    }
    return res.secure_url;
  } finally {
    removeLocal(file.path);
  }
}

// Public endpoints
exports.getCoursesPublic = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '12', 10);
    const skip = (page - 1) * limit;
    const search = (req.query.search || '').trim();

    const q = {};
    if (search) q.title = { $regex: search, $options: 'i' };

    const [items, total] = await Promise.all([
      Course.find(q)
        .select('title description price thumbnailUrl createdAt instructor rating')
        .populate('instructor', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(q),
    ]);

    return res.status(200).json({ success: true, data: items, page, limit, total });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCoursePublic = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course id' });
    }
    const course = await Course.findById(id)
      .select('title description price thumbnailUrl category createdAt rating reviews instructor lectures')
      .populate('instructor', 'name email')
      .lean();

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (course.lectures && Array.isArray(course.lectures)) {
      course.lectures = course.lectures.map(l => ({ title: l.title, description: l.description, duration: l.duration, order: l.order }));
    }

    return res.status(200).json({ success: true, data: course });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    // Upload files if present
    const files = req.files || {};
    const thumbnailFile = files.thumbnail?.[0];
    const videoFile = files.video?.[0];
    const notesFile = files.notes?.[0];

    const [thumbnailUrl, videoUrl, notesUrl] = await Promise.all([
      uploadToCloudinary(thumbnailFile, 'image'),
      uploadToCloudinary(videoFile, 'video'),
      uploadToCloudinary(notesFile, 'raw'),
    ]);

    const course = await Course.create({
      title,
      description,
      price: price ? Number(price) : 0,
      category,
      thumbnail: thumbnailUrl || '',
      thumbnailUrl: thumbnailUrl || '',
      videoUrl: videoUrl || '',
      notesUrl: notesUrl || '',
      instructor: req.user.id,
      createdBy: req.user.id,
    });

    return res.status(201).json({ success: true, data: course });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course id' });
    }
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const ownerId = String(course.createdBy || course.instructor);
    if (String(req.user.id) !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    const updates = {};
    const allowed = ['title', 'description', 'price', 'category'];
    for (const key of allowed) if (req.body[key] !== undefined) updates[key] = key === 'price' ? Number(req.body[key]) : req.body[key];

    const files = req.files || {};
    if (files.thumbnail?.[0]) {
      const url = await uploadToCloudinary(files.thumbnail[0], 'image');
      updates.thumbnail = url;
      updates.thumbnailUrl = url;
    }
    if (files.video?.[0]) {
      const url = await uploadToCloudinary(files.video[0], 'video');
      updates.videoUrl = url;
    }
    if (files.notes?.[0]) {
      const url = await uploadToCloudinary(files.notes[0], 'raw');
      updates.notesUrl = url;
    }

    const updated = await Course.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course id' });
    }
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const ownerId = String(course.createdBy || course.instructor);
    if (String(req.user.id) !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();
    return res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await Course.find({ $or: [{ createdBy: teacherId }, { instructor: teacherId }] })
      .populate('students', 'name email')
      .lean();
    return res.status(200).json({ success: true, data: courses });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().select('-reviews').lean();
    return res.status(200).json({ success: true, data: courses });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course id' });
    }
    const course = await Course.findById(id).lean();
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const ownerId = String(course.createdBy || course.instructor);
    if (String(req.user.id) !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this course' });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
