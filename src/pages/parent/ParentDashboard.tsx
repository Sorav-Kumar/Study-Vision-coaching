import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, Card, CardBody, LoadingSpinner, EmptyState, StatCard, Badge } from '@/components/ui';
import { Users, Calendar, DollarSign, ClipboardList, Bell, BookCheck, Clock } from 'lucide-react';

export function ParentDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [childData, setChildData] = useState<Record<string, any>>({});

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data: parent } = await supabase.from('parents').select('id').eq('profile_id', profile?.id).maybeSingle();
    if (parent) {
      const { data: links } = await supabase.from('parent_student_links').select('student:students(*, class:classes(*), batch:batches(*))').eq('parent_id', parent.id);
      const kids = (links ?? []).map((l: any) => l.student).filter(Boolean);
      setChildren(kids);
      for (const child of kids) {
        const [attRes, feeRes, testRes] = await Promise.all([
          supabase.from('attendance').select('status').eq('student_id', child.id),
          supabase.from('fees').select('total_amount, paid_amount').eq('student_id', child.id),
          supabase.from('test_results').select('*, test:tests(name, subject, total_marks)').eq('student_id', child.id).order('created_at', { ascending: false }).limit(3),
        ]);
        const att = attRes.data ?? [];
        const present = att.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
        const pct = att.length > 0 ? Math.round((present / att.length) * 100) : 0;
        const fees = feeRes.data ?? [];
        const pending = fees.reduce((s, f) => s + ((f.total_amount || 0) - (f.paid_amount || 0)), 0);
        setChildData((prev) => ({ ...prev, [child.id]: { attendancePct: pct, pendingFees: pending, recentTests: testRes.data ?? [] } }));
      }
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Parent Dashboard" description={`Welcome, ${profile?.full_name}`} />
      {children.length === 0 ? (
        <Card><CardBody><EmptyState icon={<Users className="h-12 w-12" />} title="No linked children" description="Your child's profile has not been linked yet. Please contact the administrator." /></CardBody></Card>
      ) : (
        <div className="space-y-6">
          {children.map((child) => {
            const data = childData[child.id] ?? { attendancePct: 0, pendingFees: 0, recentTests: [] };
            return (
              <div key={child.id} className="space-y-4">
                <Card>
                  <CardBody className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white text-xl font-bold">{child.full_name.charAt(0)}</div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-slate-900">{child.full_name}</h2>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-600">
                        <span>ID: <strong className="text-slate-900">{child.student_id ?? '—'}</strong></span>
                        <span>Class: <strong className="text-slate-900">{child.class?.name ?? '—'}</strong></span>
                        <span>Batch: <strong className="text-slate-900">{child.batch?.name ?? '—'}</strong></span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard icon={<Calendar className="h-6 w-6" />} label="Attendance" value={`${data.attendancePct}%`} color="blue" />
                  <StatCard icon={<DollarSign className="h-6 w-6" />} label="Pending Fees" value={`₹${data.pendingFees}`} color={data.pendingFees > 0 ? 'amber' : 'green'} />
                  <StatCard icon={<ClipboardList className="h-6 w-6" />} label="Recent Tests" value={data.recentTests.length} color="purple" />
                </div>
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Test Results</h3>
                    {data.recentTests.length === 0 ? <p className="text-sm text-slate-500">No test results yet.</p> : (
                      <div className="space-y-2">
                        {data.recentTests.map((r: any) => (
                          <div key={r.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2">
                            <div><p className="text-sm font-medium text-slate-900">{r.test?.name ?? 'Test'}</p><p className="text-xs text-slate-500">{r.test?.subject}</p></div>
                            <Badge color="blue">{r.marks_obtained}/{r.test?.total_marks ?? 100}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
