import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Bell } from 'lucide-react';

export function StudentNotices() {
  const { profile } = useAuth();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data: student } = await supabase.from('students').select('class_id, batch_id').eq('profile_id', profile?.id).maybeSingle();
    const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    const filtered = (data ?? []).filter((n: any) => {
      if (n.target === 'ALL') return true;
      if (n.target === 'CLASS' && student?.class_id && n.class_id === student.class_id) return true;
      if (n.target === 'BATCH' && student?.batch_id && n.batch_id === student.batch_id) return true;
      return false;
    });
    setNotices(filtered);
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Notices" description="Announcements and updates" />
      {notices.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<Bell className="h-12 w-12" />} title="No notices" /></div></Card>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <Card key={n.id}>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">{n.title}</h3>
                  <Badge color={n.target === 'ALL' ? 'blue' : 'amber'}>{n.target}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">{n.content}</p>
                <p className="mt-2 text-xs text-slate-400">{new Date(n.created_at).toLocaleDateString()}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
