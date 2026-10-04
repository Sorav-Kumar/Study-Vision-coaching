import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { FullPageLoader } from '@/components/ui';
import type { UserRole } from '@/types';
import { PublicLayout } from '@/layouts/PublicLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { HomePage } from '@/pages/public/HomePage';
import { AboutPage } from '@/pages/public/AboutPage';
import { CoursesPage } from '@/pages/public/CoursesPage';
import { FacultyPage } from '@/pages/public/FacultyPage';
import { GalleryPage } from '@/pages/public/GalleryPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminStudents } from '@/pages/admin/AdminStudents';
import { AdminTeachers } from '@/pages/admin/AdminTeachers';
import { AdminParents } from '@/pages/admin/AdminParents';
import { AdminCourses } from '@/pages/admin/AdminCourses';
import { AdminBatches } from '@/pages/admin/AdminBatches';
import { AdminAttendance } from '@/pages/admin/AdminAttendance';
import { AdminFees } from '@/pages/admin/AdminFees';
import { AdminNotes } from '@/pages/admin/AdminNotes';
import { AdminTests } from '@/pages/admin/AdminTests';
import { AdminHomework } from '@/pages/admin/AdminHomework';
import { AdminTimetable } from '@/pages/admin/AdminTimetable';
import { AdminNotices } from '@/pages/admin/AdminNotices';
import { AdminEnquiries } from '@/pages/admin/AdminEnquiries';
import { AdminGallery } from '@/pages/admin/AdminGallery';
import { AdminFaculty } from '@/pages/admin/AdminFaculty';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { AdminReports } from '@/pages/admin/AdminReports';
import { TeacherDashboard } from '@/pages/teacher/TeacherDashboard';
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentNotes } from '@/pages/student/StudentNotes';
import { StudentAttendance } from '@/pages/student/StudentAttendance';
import { StudentFees } from '@/pages/student/StudentFees';
import { StudentTests } from '@/pages/student/StudentTests';
import { StudentHomework } from '@/pages/student/StudentHomework';
import { StudentTimetable } from '@/pages/student/StudentTimetable';
import { StudentNotices } from '@/pages/student/StudentNotices';
import { ParentDashboard } from '@/pages/parent/ParentDashboard';

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: UserRole[] }) {
  const { session, profile, loading } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!session) return <Navigate to="/login" replace />;
  if (roles && profile && !roles.includes(profile.role)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Admin */}
      <Route
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/teachers" element={<AdminTeachers />} />
        <Route path="/admin/parents" element={<AdminParents />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/batches" element={<AdminBatches />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/admin/fees" element={<AdminFees />} />
        <Route path="/admin/notes" element={<AdminNotes />} />
        <Route path="/admin/tests" element={<AdminTests />} />
        <Route path="/admin/homework" element={<AdminHomework />} />
        <Route path="/admin/timetable" element={<AdminTimetable />} />
        <Route path="/admin/notices" element={<AdminNotices />} />
        <Route path="/admin/enquiries" element={<AdminEnquiries />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/faculty" element={<AdminFaculty />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/reports" element={<AdminReports />} />
      </Route>

      {/* Teacher */}
      <Route
        element={
          <ProtectedRoute roles={['TEACHER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Route>

      {/* Student */}
      <Route
        element={
          <ProtectedRoute roles={['STUDENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/notes" element={<StudentNotes />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/fees" element={<StudentFees />} />
        <Route path="/student/tests" element={<StudentTests />} />
        <Route path="/student/homework" element={<StudentHomework />} />
        <Route path="/student/timetable" element={<StudentTimetable />} />
        <Route path="/student/notices" element={<StudentNotices />} />
      </Route>

      {/* Parent */}
      <Route
        element={
          <ProtectedRoute roles={['PARENT']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/parent" element={<ParentDashboard />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
