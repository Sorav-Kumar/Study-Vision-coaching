import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { ClipboardList, TrendingUp } from 'lucide-react';

export function StudentTests() {
  const { profile } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data: student } = await supabase.from('students').select('id').eq('profile_id', profile?.id).maybeSingle();
    if (student) {
      const { data } = await supabase.from('test_results').select('*, test:tests(*)').eq('student_id', student.id).order('created_at', { ascending: false });
      setResults(data ?? []);
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  const avgPct = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + (r.marks_obtained / (r.test?.total_marks || 100)) * 100, 0) / results.length) : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Tests & Results" description="View your test performance" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><div className="p-6"><p className="text-2xl font-bold text-slate-900">{results.length}</p><p className="text-sm text-slate-500">Tests Taken</p></div></Card>
        <Card><div className="p-6"><p className="text-2xl font-bold text-blue-600">{avgPct}%</p><p className="text-sm text-slate-500">Average Score</p></div></Card>
        <Card><div className="p-6"><p className="text-2xl font-bold text-green-600">{results.length > 0 ? Math.max(...results.map((r) => r.marks_obtained)) : 0}</p><p className="text-sm text-slate-500">Highest Marks</p></div></Card>
      </div>
      <Card>
        {results.length === 0 ? <div className="p-6"><EmptyState icon={<ClipboardList className="h-12 w-12" />} title="No test results" description="Your test results will appear here once available." /></div> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="px-4 py-3 text-left font-medium text-slate-600">Test</th><th className="px-4 py-3 text-left font-medium text-slate-600 hidden sm:table-cell">Subject</th><th className="px-4 py-3 text-left font-medium text-slate-600 hidden sm:table-cell">Date</th><th className="px-4 py-3 text-right font-medium text-slate-600">Marks</th><th className="px-4 py-3 text-right font-medium text-slate-600">%</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => {
                const pct = Math.round((r.marks_obtained / (r.test?.total_marks || 100)) * 100);
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{r.test?.name ?? 'Test'}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-slate-600">{r.test?.subject ?? '—'}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-slate-500">{r.test?.test_date ?? '—'}</td>
                    <td className="px-4 py-3 text-right"><Badge color={pct >= 60 ? 'green' : pct >= 40 ? 'amber' : 'red'}>{r.marks_obtained}/{r.test?.total_marks ?? 100}</Badge></td>
                    <td className="px-4 py-3 text-right text-slate-600">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        )}
      </Card>
    </div>
  );
}
