import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { FileText, Download } from 'lucide-react';

export function StudentNotes() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data: student } = await supabase.from('students').select('class_id, batch_id').eq('profile_id', profile?.id).maybeSingle();
    const { data } = await supabase.from('notes').select('*, class:classes(*), batch:batches(*)').order('created_at', { ascending: false });
    // Filter: public notes + notes matching student's class or batch
    const filtered = (data ?? []).filter((n: any) => {
      if (n.access_level === 'PUBLIC') return true;
      if (n.access_level === 'CLASS' && student?.class_id && n.class_id === student.class_id) return true;
      if (n.access_level === 'BATCH' && student?.batch_id && n.batch_id === student.batch_id) return true;
      return false;
    });
    setNotes(filtered);
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Notes & Study Material" description="Download notes assigned to you" />
      {notes.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<FileText className="h-12 w-12" />} title="No notes available" description="Notes uploaded for your class or batch will appear here." /></div></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((n) => (
            <Card key={n.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><FileText className="h-5 w-5" /></div>
                  <Badge color={n.access_level === 'PUBLIC' ? 'green' : 'blue'}>{n.access_level}</Badge>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">{n.title}</h3>
                {n.subject && <p className="text-sm text-blue-600">{n.subject}</p>}
                {n.description && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{n.description}</p>}
                <a href={n.file_path} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"><Download className="h-4 w-4" /> Download</a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
