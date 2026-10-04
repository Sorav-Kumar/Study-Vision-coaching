import { useEffect, useState } from 'react';
import { Users, UserCog, DollarSign, Calendar, ClipboardList, Mail, TrendingUp, GraduationCap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { StatCard, PageHeader, Card, CardBody, LoadingSpinner } from '@/components/ui';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalTeachers: 0,
    pendingFees: 0,
    newEnquiries: 0,
    upcomingTests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const [studentsRes, teachersRes, enquiriesRes] = await Promise.all([
        supabase.from('students').select('id, status'),
        supabase.from('teachers').select('id'),
        supabase.from('enquiries').select('id, status'),
      ]);

      const totalStudents = studentsRes.data?.length ?? 0;
      const activeStudents = studentsRes.data?.filter((s) => s.status === 'ACTIVE').length ?? 0;
      const totalTeachers = teachersRes.data?.length ?? 0;
      const newEnquiries = enquiriesRes.data?.filter((e) => e.status === 'New').length ?? 0;

      setStats({
        totalStudents,
        activeStudents,
        totalTeachers,
        pendingFees: 0,
        newEnquiries,
        upcomingTests: 0,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Overview of your coaching centre" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-6 w-6" />} label="Total Students" value={stats.totalStudents} color="blue" />
        <StatCard icon={<GraduationCap className="h-6 w-6" />} label="Active Students" value={stats.activeStudents} color="green" />
        <StatCard icon={<UserCog className="h-6 w-6" />} label="Total Teachers" value={stats.totalTeachers} color="purple" />
        <StatCard icon={<DollarSign className="h-6 w-6" />} label="Pending Fees" value={stats.pendingFees} color="amber" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={<Calendar className="h-6 w-6" />} label="Today's Classes" value="—" color="slate" />
        <StatCard icon={<ClipboardList className="h-6 w-6" />} label="Upcoming Tests" value={stats.upcomingTests} color="blue" />
        <StatCard icon={<Mail className="h-6 w-6" />} label="New Enquiries" value={stats.newEnquiries} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900">Recent Enquiries</h3>
            <p className="mt-1 text-sm text-slate-500">Latest admission enquiries</p>
            <RecentEnquiries />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
            <p className="mt-1 text-sm text-slate-500">Common administrative tasks</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Add Student', href: '/admin/students' },
                { label: 'Mark Attendance', href: '/admin/attendance' },
                { label: 'Create Test', href: '/admin/tests' },
                { label: 'Upload Notes', href: '/admin/notes' },
                { label: 'Add Notice', href: '/admin/notices' },
                { label: 'View Enquiries', href: '/admin/enquiries' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function RecentEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setEnquiries(data ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="mt-4"><LoadingSpinner /></div>;
  if (enquiries.length === 0) return <p className="mt-4 text-sm text-slate-500">No enquiries yet.</p>;

  return (
    <div className="mt-4 space-y-2">
      {enquiries.map((e) => (
        <div key={e.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2">
          <div>
            <p className="text-sm font-medium text-slate-900">{e.student_name}</p>
            <p className="text-xs text-slate-500">{e.mobile} • Class {e.class_name || '—'}</p>
          </div>
          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
            e.status === 'New' ? 'bg-blue-100 text-blue-700' :
            e.status === 'Contacted' ? 'bg-amber-100 text-amber-700' :
            e.status === 'Admitted' ? 'bg-green-100 text-green-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {e.status}
          </span>
        </div>
      ))}
    </div>
  );
}
