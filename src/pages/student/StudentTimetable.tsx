import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { Clock } from 'lucide-react';

export function StudentTimetable() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data: student } = await supabase.from('students').select('batch_id, class_id').eq('profile_id', profile?.id).maybeSingle();
    if (student) {
      const { data } = await supabase.from('timetable').select('*').order('start_time');
      const filtered = (data ?? []).filter((t: any) => {
        if (student.batch_id && t.batch_id === student.batch_id) return true;
        if (student.class_id && t.class_id === student.class_id) return true;
        return false;
      });
      setEntries(filtered);
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <PageHeader title="My Timetable" description="Your class schedule" />
      {entries.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<Clock className="h-12 w-12" />} title="No timetable entries" /></div></Card>
      ) : (
        <div className="space-y-4">
          {days.map((day) => {
            const dayEntries = entries.filter((e) => e.day === day);
            if (dayEntries.length === 0) return null;
            return (
              <Card key={day}>
                <div className="p-4"><h3 className="font-semibold text-slate-900 mb-3">{day}</h3>
                  <div className="space-y-2">
                    {dayEntries.map((t) => (
                      <div key={t.id} className="flex items-center gap-4 rounded-lg border border-slate-200 px-4 py-2">
                        <span className="text-sm font-mono text-slate-600">{t.start_time} - {t.end_time}</span>
                        <span className="text-sm font-medium text-slate-900">{t.subject}</span>
                        {t.room && <span className="text-xs text-slate-500">Room: {t.room}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
