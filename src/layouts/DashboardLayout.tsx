import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, type ComponentType } from 'react';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, DollarSign,
  FileText, ClipboardList, Clock, Bell, Image, Settings, Award, LogOut,
  Menu, X, UserCog, FolderTree, BarChart3, Mail, User, BookCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const navByRole: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/teachers', label: 'Teachers', icon: UserCog },
    { to: '/admin/parents', label: 'Parents', icon: Users },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/admin/batches', label: 'Batches', icon: FolderTree },
    { to: '/admin/attendance', label: 'Attendance', icon: Calendar },
    { to: '/admin/fees', label: 'Fees', icon: DollarSign },
    { to: '/admin/notes', label: 'Notes', icon: FileText },
    { to: '/admin/homework', label: 'Homework', icon: BookCheck },
    { to: '/admin/tests', label: 'Tests', icon: ClipboardList },
    { to: '/admin/timetable', label: 'Timetable', icon: Clock },
    { to: '/admin/notices', label: 'Notices', icon: Bell },
    { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
    { to: '/admin/gallery', label: 'Gallery', icon: Image },
    { to: '/admin/faculty', label: 'Faculty', icon: Award },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ],
  TEACHER: [
    { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard },
  ],
  STUDENT: [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/notes', label: 'Notes', icon: FileText },
    { to: '/student/homework', label: 'Homework', icon: BookCheck },
    { to: '/student/attendance', label: 'Attendance', icon: Calendar },
    { to: '/student/fees', label: 'Fees', icon: DollarSign },
    { to: '/student/tests', label: 'Tests & Results', icon: ClipboardList },
    { to: '/student/timetable', label: 'Timetable', icon: Clock },
    { to: '/student/notices', label: 'Notices', icon: Bell },
  ],
  PARENT: [
    { to: '/parent', label: 'Dashboard', icon: LayoutDashboard },
  ],
};

export function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!profile) return null;

  const navItems = navByRole[profile.role] ?? [];
  const roleLabel = profile.role.charAt(0) + profile.role.slice(1).toLowerCase();
  const homeLink = profile.role === 'ADMIN' ? '/admin' : `/${profile.role.toLowerCase()}`;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-slate-900 text-slate-300">
        <SidebarContent
          navItems={navItems}
          homeLink={homeLink}
          profile={profile}
          roleLabel={roleLabel}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Sidebar - mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col bg-slate-900 text-slate-300 animate-slide-in">
            <SidebarContent
              navItems={navItems}
              homeLink={homeLink}
              profile={profile}
              roleLabel={roleLabel}
              onSignOut={handleSignOut}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button className="lg:hidden text-slate-600" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{profile.full_name}</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
              <User className="h-5 w-5" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  navItems,
  homeLink,
  profile,
  roleLabel,
  onSignOut,
}: {
  navItems: NavItem[];
  homeLink: string;
  profile: { full_name: string; role: string };
  roleLabel: string;
  onSignOut: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="block text-sm font-bold text-white leading-tight">Study Vision</span>
            <span className="block text-xs text-slate-400 leading-tight">{roleLabel} Portal</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === homeLink}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-3">
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </>
  );
}
