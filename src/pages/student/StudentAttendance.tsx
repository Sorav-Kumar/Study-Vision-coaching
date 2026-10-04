import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, Card, CardBody, LoadingSpinner, EmptyState, StatCard } from '@/components/ui';
import { Calendar, Check, X, Clock } from 'lucide-react';

export function StudentAttendance() {
  const { profile } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, pct: 0 });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data: student } = await supabase.from('students').select('id').eq('profile_id', profile?.id).maybeSingle();
    if (student) {
      const { data } = await supabase.from('attendance').select('*').eq('student_id', student.id).order('date', { ascending: false });
      const att = data ?? [];
      const present = att.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
      const absent = att.filter((a) => a.status === 'ABSENT').length;
      const pct = att.length > 0 ? Math.round((present / att.length) * 100) : 0;
      setStats({ total: att.length, present, absent, pct });
      setRecords(att);
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="My Attendance" description="View your attendance records" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar className="h-6 w-6" />} label="Total Classes" value={stats.total} color="blue" />
        <StatCard icon={<Check className="h-6 w-6" />} label="Present" value={stats.present} color="green" />
        <StatCard icon={<X className="h-6 w-6" />} label="Absent" value={stats.absent} color="red" />
        <StatCard icon={<Clock className="h-6 w-6" />} label="Percentage" value={`${stats.pct}%`} color="amber" />
      </div>
      <Card>
        <CardBody>
          {records.length === 0 ? <EmptyState icon={<Calendar className="h-12 w-12" />} title="No attendance records" /> : (
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="border-b border-slate-200"><tr><th className="px-4 py-2 text-left font-medium text-slate-600">Date</th><th className="px-4 py-2 text-left font-medium text-slate-600">Status</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id}><td className="px-4 py-2 text-slate-600">{r.date}</td><td className="px-4 py-2"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${r.status === 'PRESENT' ? 'bg-green-100 text-green-700' : r.status === 'LATE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span></td></tr>
                ))}
              </tbody>
            </table></div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
