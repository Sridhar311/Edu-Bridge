# 🔧 MongoDB Connection Fix Guide

## ❌ The Error

```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```

This means MongoDB is **not running** or **not installed** on your machine.

---

## ✅ Solution Options

### **Option 1: MongoDB Atlas (Cloud - EASIEST & RECOMMENDED)** ⭐

**Best for beginners - No installation needed!**

1. **Sign up** at https://www.mongodb.com/atlas (Free tier available)

2. **Create a cluster**:
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a cloud provider & region
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `edubridge_user`
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update `.env` file**:
   ```env
   MONGODB_URI=mongodb+srv://edubridge_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/edubridge?retryWrites=true&w=majority
   ```
   Replace `YOUR_PASSWORD` with the password you created in step 3.

7. **Restart your server**:
   ```bash
   # Stop current server (Ctrl+C)
   cd server
   npm run dev
   ```

---

### **Option 2: Local MongoDB (Windows)**

**For local development**

1. **Download MongoDB**:
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and install

2. **Install MongoDB**:
   - Run the installer
   - Choose "Complete" installation
   - Install as Windows Service (recommended)
   - Install MongoDB Compass (optional GUI)

3. **Start MongoDB Service**:
   ```powershell
   # Check if service is running
   Get-Service MongoDB
   
   # If not running, start it
   Start-Service MongoDB
   ```

4. **Verify MongoDB is running**:
   ```bash
   # Test connection
   mongosh
   # If this works, MongoDB is running!
   ```

5. **Your `.env` is already correct**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/edubridge
   ```

6. **Restart your server**

---

### **Option 3: Docker (Alternative)**

**If you have Docker installed:**

```bash
# Run MongoDB in Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Check if running
docker ps

# Your .env is already correct
```

---

## 🧪 Test the Connection

After setting up MongoDB, test it:

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
```

---

## 🔍 Common Issues

### Issue: "Connection timeout"
- **MongoDB Atlas**: Check IP whitelist (allow 0.0.0.0/0)
- **Local**: Check if MongoDB service is running

### Issue: "Authentication failed"
- **MongoDB Atlas**: Verify username/password in connection string
- **Local**: MongoDB might not have authentication enabled (that's okay for dev)

### Issue: "ECONNREFUSED"
- MongoDB is not running
- Try: `Start-Service MongoDB` (Windows)
- Or: Use MongoDB Atlas instead

---

## 📝 Quick Checklist

- [ ] Created `.env` file in root directory
- [ ] Set `MONGODB_URI` in `.env`
- [ ] MongoDB is running (local) OR MongoDB Atlas cluster is created (cloud)
- [ ] Restarted the server after updating `.env`

---

## 💡 Recommendation

**For beginners**: Use **MongoDB Atlas** (Option 1)
- ✅ No installation needed
- ✅ Free tier available
- ✅ Works from anywhere
- ✅ Easy to set up

**For advanced users**: Use **Local MongoDB** (Option 2)
- ✅ Faster (no internet needed)
- ✅ Full control
- ✅ Offline development

---

## 🆘 Still Having Issues?

1. Check your `.env` file location (should be in root directory)
2. Verify the connection string format
3. Try connecting with MongoDB Compass to test
4. Check server console for detailed error messages

