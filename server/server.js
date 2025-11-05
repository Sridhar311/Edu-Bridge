const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const expressRaw = require('express').raw;
const cookieParser = require('cookie-parser');

// Load environment variables from root directory
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://edu-bridge-henna-pi.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools
    const ok = allowedOrigins.some((o) => o === origin);
    callback(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  credentials: true,
}));
// Razorpay webhook needs raw body for signature verification; register this endpoint BEFORE json parser
const paymentController = require('./controllers/paymentController');
app.post('/api/payment/webhook', expressRaw({ type: 'application/json' }), paymentController.webhook);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const contactRoutes = require('./routes/contactRoutes');

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'EduBridge API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);
// app.use('/api/payments', paymentRoutes);

// 404 handler (must be before error handler)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edubridge', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

module.exports = app;

