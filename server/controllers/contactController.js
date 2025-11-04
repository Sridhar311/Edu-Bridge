const ContactMessage = require('../models/ContactMessage');
const mongoose = require('mongoose');

// Public: submit a contact message
exports.submit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const doc = await ContactMessage.create({ name, email, subject, message });
    return res.status(201).json({ success: true, data: { id: doc._id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: list messages
exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ContactMessage.countDocuments(),
    ]);

    return res.status(200).json({ success: true, data: items, page, limit, total });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: delete message
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: 'Invalid id' });
    const doc = await ContactMessage.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ success: false, message: 'Message not found' });
    return res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
