import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { BookCheck, Download } from 'lucide-react';

export function StudentHomework() {
  const { profile } = useAuth();
  const [homework, setHomework] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data: student } = await supabase.from('students').select('class_id, batch_id').eq('profile_id', profile?.id).maybeSingle();
    if (student) {
      const { data } = await supabase.from('homework').select('*').order('due_date', { ascending: false });
      const filtered = (data ?? []).filter((h: any) => {
        if (student.batch_id && h.batch_id === student.batch_id) return true;
        if (student.class_id && h.class_id === student.class_id) return true;
        return false;
      });
      setHomework(filtered);
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Homework" description="View your assignments" />
      {homework.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<BookCheck className="h-12 w-12" />} title="No homework assigned" /></div></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {homework.map((h) => {
            const overdue = new Date(h.due_date) < new Date();
            return (
              <Card key={h.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div><h3 className="font-semibold text-slate-900">{h.title}</h3><p className="text-sm text-blue-600">{h.subject}</p></div>
                    <Badge color={overdue ? 'red' : 'amber'}>Due: {h.due_date}</Badge>
                  </div>
                  {h.description && <p className="mt-2 text-sm text-slate-600">{h.description}</p>}
                  {h.file_path && <a href={h.file_path} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"><Download className="h-4 w-4" /> Attachment</a>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
