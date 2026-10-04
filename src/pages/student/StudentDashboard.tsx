import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, Card, CardBody, LoadingSpinner, StatCard, EmptyState, Badge } from '@/components/ui';
import { Calendar, DollarSign, ClipboardList, Bell, FileText, BookCheck, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [stats, setStats] = useState({ attendancePct: 0, pendingFees: 0, recentMarks: [] as any[], notices: [] as any[] });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data: studentData } = await supabase.from('students').select('*, class:classes(*), batch:batches(*)').eq('profile_id', profile?.id).maybeSingle();
    setStudent(studentData);

    if (studentData) {
      const [attRes, feeRes, testRes, noticeRes] = await Promise.all([
        supabase.from('attendance').select('status').eq('student_id', studentData.id),
        supabase.from('fees').select('total_amount, paid_amount').eq('student_id', studentData.id),
        supabase.from('test_results').select('*, test:tests(name, subject, total_marks)').eq('student_id', studentData.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('notices').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      const att = attRes.data ?? [];
      const present = att.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
      const pct = att.length > 0 ? Math.round((present / att.length) * 100) : 0;
      const fees = feeRes.data ?? [];
      const pending = fees.reduce((sum, f) => sum + ((f.total_amount || 0) - (f.paid_amount || 0)), 0);
      setStats({ attendancePct: pct, pendingFees: pending, recentMarks: testRes.data ?? [], notices: noticeRes.data ?? [] });
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  if (!student) return <Card><CardBody><EmptyState title="Profile not found" description="Your student profile has not been set up yet. Please contact the administrator." /></CardBody></Card>;

  return (
    <div className="space-y-6">
      <PageHeader title="Student Dashboard" description={`Welcome, ${student.full_name}`} />

      {/* Profile card */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white text-2xl font-bold">{student.full_name.charAt(0)}</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">{student.full_name}</h2>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
              <span>Student ID: <strong className="text-slate-900">{student.student_id ?? '—'}</strong></span>
              <span>Class: <strong className="text-slate-900">{student.class?.name ?? '—'}</strong></span>
              <span>Batch: <strong className="text-slate-900">{student.batch?.name ?? '—'}</strong></span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar className="h-6 w-6" />} label="Attendance" value={`${stats.attendancePct}%`} color="blue" />
        <StatCard icon={<DollarSign className="h-6 w-6" />} label="Pending Fees" value={`₹${stats.pendingFees}`} color={stats.pendingFees > 0 ? 'amber' : 'green'} />
        <StatCard icon={<ClipboardList className="h-6 w-6" />} label="Recent Tests" value={stats.recentMarks.length} color="purple" />
        <StatCard icon={<Bell className="h-6 w-6" />} label="Notices" value={stats.notices.length} color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent marks */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-600" /> Recent Test Results</h3>
            {stats.recentMarks.length === 0 ? <p className="mt-4 text-sm text-slate-500">No test results yet.</p> : (
              <div className="mt-4 space-y-2">
                {stats.recentMarks.map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2">
                    <div><p className="text-sm font-medium text-slate-900">{r.test?.name ?? 'Test'}</p><p className="text-xs text-slate-500">{r.test?.subject}</p></div>
                    <Badge color="blue">{r.marks_obtained}/{r.test?.total_marks ?? 100}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Notices */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2"><Bell className="h-5 w-5 text-blue-600" /> Latest Notices</h3>
            {stats.notices.length === 0 ? <p className="mt-4 text-sm text-slate-500">No notices yet.</p> : (
              <div className="mt-4 space-y-2">
                {stats.notices.map((n: any) => (
                  <div key={n.id} className="rounded-lg border border-slate-200 px-4 py-2">
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/student/notes', icon: FileText, label: 'Notes' },
          { to: '/student/homework', icon: BookCheck, label: 'Homework' },
          { to: '/student/timetable', icon: Clock, label: 'Timetable' },
          { to: '/student/tests', icon: ClipboardList, label: 'Tests' },
        ].map((link) => (
          <Link key={link.to} to={link.to} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-lg">
            <link.icon className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
