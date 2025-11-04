# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

Run from the root directory:
```bash
npm run install-all
```

Or manually:
```bash
# Root dependencies (concurrently)
npm install

# Backend dependencies
cd server
npm install
cd ..

# Frontend dependencies  
cd client
npm install
cd ..
```

### Step 2: Configure Environment

Create a `.env` file in the root directory:
```bash
# Copy the example
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
# Minimum required for development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edubridge
JWT_SECRET=your_super_secret_jwt_key_here

# For production, add:
# - Razorpay keys
# - Cloudinary credentials
```

### Step 3: Start MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

**Option B: Local MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 4: Run the Application

**Option A: Run Both Servers Together**
```bash
# From root directory
npm run dev
```

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

### Step 5: Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Test API**: http://localhost:5000/api/test

## ✅ Verify Installation

1. Backend should show: `✅ MongoDB Connected` and `🚀 Server running on port 5000`
2. Frontend should open in browser at http://localhost:3000
3. You should see the beautiful landing page with gradient hero section

## 🔧 Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB is running: `mongosh`
- Verify connection string in `.env`
- Try: `mongodb://127.0.0.1:27017/edubridge`

### Port 3000 or 5000 Already in Use
```bash
# Find and kill process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### Module Not Found Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
cd server && rm -rf node_modules package-lock.json
cd ../client && rm -rf node_modules package-lock.json
cd ..
npm run install-all
```

### Tailwind Not Working
```bash
cd client
npm install -D tailwindcss postcss autoprefixer
```

## 🎯 Next Steps

1. **Explore the Code**
   - `client/src/pages/Home.js` - Landing page
   - `server/routes/auth.js` - Authentication routes
   - `server/models/User.js` - User model

2. **Test Authentication**
   - Register a new user
   - Login with credentials
   - Check JWT token in response

3. **Customize**
   - Edit colors in `client/tailwind.config.js`
   - Modify hero text in `client/src/pages/Home.js`
   - Add more routes in `client/src/App.js`

## 📚 Documentation

- [README.md](./README.md) - Full documentation
- [API Endpoints](./README.md#backend-api-endpoints) - API reference
- [Tech Stack](./README.md#tech-stack) - Technologies used

## 💡 Need Help?

Check existing issues or create a new one on GitHub!

