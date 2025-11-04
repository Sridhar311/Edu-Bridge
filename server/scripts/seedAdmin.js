const path = require('path');
// Load .env from project root (two levels up from /server/scripts)
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/edubridge';
  try {
    console.log('Connecting to MongoDB...');
    console.log('Using URI:', MONGO.replace(/:[^:@/]+@/g, ':****@')); // mask password if any
    await mongoose.connect(MONGO, {});

    const email = 'admin@eduverse.com';
    const password = 'admin@123';

    let user = await User.findOne({ email });
    if (user) {
      console.log('Admin user exists. Updating role/approval and resetting password...');
      user.role = 'admin';
      user.approved = true;
      user.password = password; // will be hashed by pre-save hook
      await user.save();
    } else {
      console.log('Creating admin user...');
      user = await User.create({
        name: 'Admin',
        email,
        password,
        role: 'admin',
        approved: true,
      });
    }

    console.log('Admin ready:', { id: user._id.toString(), email: user.email, role: user.role, approved: user.approved });
    console.log('Use these credentials to login via the app:');
    console.log('Email: admin@eduverse.com');
    console.log('Password: admin@123');
  } catch (err) {
    console.error('Seed failed:', err?.message || err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
