Live link->https://edu-bridge-henna-pi.vercel.app/
<div align="center">

# 🎓 EduBridge

### Empowering Learning for Everyone

A modern, full-stack online learning platform where students enroll in courses, teachers upload content, and admins manage the entire ecosystem.


[Features](#-features) • [Tech Stack](#-tech-stack)  • [Branding](#-branding)

</div>

## 🧩 Tech Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Additional Services
- **Razorpay** - Payment gateway
- **Cloudinary** - Media storage

## 📁 Project Structure

```
EduBridge/
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
│
├── server/              # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── .env                 # Environment variables
├── .gitignore
└── README.md
```

## 🚀 Features

### 👥 Authentication & Authorization
- JWT-based login/signup
- Role-based access control (Admin, Teacher, Student)
- Secure route protection

### 🧑‍🏫 Teacher Panel
- Dashboard for course management
- Upload course content (videos, PDFs)
- Track enrolled students

### 🎓 Student Panel
- Browse and enroll in courses
- Access purchased content
- Track learning progress

### 🧑‍💼 Admin Panel
- Manage all users
- Moderate courses
- Platform analytics

### 💰 Payments
- Razorpay integration
- Secure checkout flow
- Transaction tracking

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd EduBridge
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Configure environment variables
```bash
# Create .env file in root directory
cp .env.example .env
# Edit .env with your credentials
```

5. Start development servers

Backend (Terminal 1):
```bash
cd server
npm run dev
```

Frontend (Terminal 2):
```bash
cd client
npm run dev
```

Or run both together:
```bash
npm run dev  # From root directory
```

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/edubridge

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
CLIENT_URL=http://localhost:5173
```

## 🎯 Development

### Backend API Endpoints

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Courses** (Protected)
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Teacher/Admin)
- `PUT /api/courses/:id` - Update course (Teacher/Admin)
- `DELETE /api/courses/:id` - Delete course (Teacher/Admin)

**Payments**
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

### Frontend Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/admin/*` - Admin dashboard (protected)
- `/teacher/*` - Teacher dashboard (protected)
- `/student/*` - Student dashboard (protected)

## 🎨 Branding

EduBridge follows a modern, professional design system with consistent branding throughout.

### Design System
- **Colors:** Primary (Indigo), Secondary (Blue), Accent (Sky/Cyan)
- **Typography:** Inter (body), Poppins (headings)
- **Shadows:** Soft, Medium, Strong for depth hierarchy
- **Border Radius:** Consistent rounded corners (8px - 32px)
- **Spacing:** 4px base scale for consistent layouts

### Logo & Assets
- **Favicon:** SVG graduation cap with gradient
- **Logo Mark:** Graduation cap icon in brand colors
- **Brand Colors:** Indigo-600 to Blue-500 gradient


### Why Early Branding Matters

1. **UI Consistency** - All components use the same color palette and spacing
2. **Developer Experience** - Pre-defined tokens speed up development
3. **User Experience** - Professional appearance builds trust
4. **Scalability** - New components follow existing patterns
5. **Future-Proofing** - Easy to implement dark mode and theme switching

## 📄 License

MIT

## 👥 Author
Sridhar ->[LinkedIn-http://linkedin.com/in/r-sridhar-5324b52a6/]
        ->[GIT-https://github.com/Sridhar311]
        ->[LEETCODE-https://leetcode.com/u/Sridhar_curious/]
Built with ❤️ for empowering education

