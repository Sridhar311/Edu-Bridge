import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateCourse from './pages/teacher/CreateCourse';
import MyCourses from './pages/teacher/MyCourses';
import EditCourse from './pages/teacher/EditCourse';
import AdminDashboard from './pages/AdminDashboard';
import AdminMain from './pages/admin/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import CoursesList from './pages/CoursesList';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';
import About from './pages/About';
import Terms from './pages/Terms';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import TeacherStudents from './pages/teacher/TeacherStudents';
import Contact from './pages/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4f46e5',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Student */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course-player/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Teacher */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/create"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/my-courses"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <EditCourse />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminMain />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
