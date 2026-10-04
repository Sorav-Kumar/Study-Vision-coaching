import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, Card, CardBody, LoadingSpinner, StatCard, EmptyState } from '@/components/ui';
import { Users, ClipboardList, Calendar, BookCheck } from 'lucide-react';

export function TeacherDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ batches: 0, students: 0, tests: 0, homework: 0 });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data: teacher } = await supabase.from('teachers').select('id').eq('profile_id', profile?.id).maybeSingle();
    if (teacher) {
      const [bRes, sRes, tRes, hRes] = await Promise.all([
        supabase.from('batches').select('id', { count: 'exact', head: true }).eq('teacher_id', teacher.id),
        supabase.from('students').select('id', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
        supabase.from('tests').select('id', { count: 'exact', head: true }),
        supabase.from('homework').select('id', { count: 'exact', head: true }),
      ]);
      setStats({ batches: bRes.count ?? 0, students: sRes.count ?? 0, tests: tRes.count ?? 0, homework: hRes.count ?? 0 });
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Teacher Dashboard" description={`Welcome, ${profile?.full_name}`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Calendar className="h-6 w-6" />} label="My Batches" value={stats.batches} color="blue" />
        <StatCard icon={<Users className="h-6 w-6" />} label="My Students" value={stats.students} color="green" />
        <StatCard icon={<ClipboardList className="h-6 w-6" />} label="Tests Created" value={stats.tests} color="amber" />
        <StatCard icon={<BookCheck className="h-6 w-6" />} label="Homework" value={stats.homework} color="purple" />
      </div>
      <Card><CardBody><EmptyState icon={<Users className="h-12 w-12" />} title="Teacher Portal" description="Your assigned batches, students, and teaching tools will appear here." /></CardBody></Card>
    </div>
  );
}
