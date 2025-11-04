# ⚡ Quick Start Guide

Get EduBridge running in under 5 minutes!

---

## 📋 Prerequisites

- ✅ Node.js (v16+) installed
- ✅ MongoDB (local or Atlas account)
- ✅ Git (optional)

---

## 🚀 Installation Steps

### Step 1: Clone/Download

If you cloned this repo:
```bash
cd EduBridge
```

### Step 2: Install Everything

```bash
npm run install-all
```

*Takes 2-3 minutes. Installs all dependencies for client, server, and root.*

### Step 3: Configure MongoDB

**Option A: MongoDB Atlas (Recommended for beginners)**

1. Go to https://mongodb.com/atlas
2. Sign up (free)
3. Create a free cluster
4. Get connection string
5. Update `.env` file

**Option B: Local MongoDB**

```bash
# Windows: Download from mongodb.com/download
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb
```

### Step 4: Create `.env` File

In the root directory, create `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edubridge
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
```

### Step 5: Start the App

```bash
npm run dev
```

You'll see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
Compiled successfully!
webpack compiled with 0 warnings
```

---

## ✅ Verify It's Working

1. Open http://localhost:3000
2. You should see the **beautiful landing page** with:
   - Gradient hero section
   - Animated background
   - Navbar with scroll effect
   - Footer with social icons

---

## 🧪 Test the API

1. Go to http://localhost:5000/api/test
2. You should see: `{"message":"EduBridge API is running!"}`

---

## 📝 Test Registration

1. Visit http://localhost:3000/register
2. Fill in the form
3. Submit
4. Check your MongoDB database for the new user

---

## 🎯 Common Issues

### Issue: `npm run install-all` fails

**Solution:**
```bash
# Install manually
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### Issue: MongoDB connection error

**Solution:**
1. Check if MongoDB is running
2. Verify connection string in `.env`
3. For Atlas: Whitelist your IP (0.0.0.0/0 for testing)

### Issue: Port 3000 or 5000 in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

---

## 🎉 Success!

If you see the landing page, you're ready to go!

---

## 📚 Next Steps

- Read `PROJECT_OVERVIEW.md` to understand the architecture
- Check `SETUP.md` for detailed documentation
- Start building features!

**Happy coding! 🚀**

