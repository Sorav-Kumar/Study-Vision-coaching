import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Calendar, Check, X, Clock } from 'lucide-react';
import type { Batch, Student } from '@/types';

export function AdminAttendance() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    supabase.from('batches').select('*, class:classes(*)').order('name').then(({ data }) => {
      setBatches((data as Batch[]) ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedBatch) return;
    loadStudents();
  }, [selectedBatch, date]);

  async function loadStudents() {
    const { data } = await supabase.from('students').select('*').eq('batch_id', selectedBatch).eq('status', 'ACTIVE').order('full_name');
    setStudents((data as Student[]) ?? []);
    const { data: existing } = await supabase.from('attendance').select('*').eq('batch_id', selectedBatch).eq('date', date);
    const map: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    (existing ?? []).forEach((a: any) => { map[a.student_id] = a.status; });
    setAttendance(map);
  }

  function markAllPresent() {
    const map: Record<string, 'PRESENT' | 'ABSENT' | 'LATE'> = {};
    students.forEach((s) => { map[s.id] = 'PRESENT'; });
    setAttendance(map);
  }

  async function save() {
    if (!selectedBatch) return;
    setSaving(true);
    const records = students.map((s) => ({
      student_id: s.id,
      batch_id: selectedBatch,
      date,
      status: attendance[s.id] ?? 'PRESENT',
    }));
    // Delete existing then insert
    await supabase.from('attendance').delete().eq('batch_id', selectedBatch).eq('date', date);
    if (records.length > 0) {
      const { error } = await supabase.from('attendance').insert(records);
      if (error) { show(error.message, 'error'); setSaving(false); return; }
    }
    show('Attendance saved', 'success');
    setSaving(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Mark and manage student attendance" />
      <Card>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Batch" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
              <option value="">Select batch</option>
              {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div className="flex items-end"><Button variant="outline" onClick={markAllPresent} disabled={!selectedBatch}>Mark All Present</Button></div>
          </div>
        </div>
      </Card>

      {selectedBatch && students.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<Calendar className="h-12 w-12" />} title="No students in this batch" /></div></Card>
      ) : selectedBatch ? (
        <Card>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="px-4 py-3 text-left font-medium text-slate-600">Student</th><th className="px-4 py-3 text-center font-medium text-slate-600">Present</th><th className="px-4 py-3 text-center font-medium text-slate-600">Absent</th><th className="px-4 py-3 text-center font-medium text-slate-600">Late</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.full_name}</td>
                  {([
                    { status: 'PRESENT', Icon: Check, active: 'border-green-600 bg-green-50 text-green-600' },
                    { status: 'ABSENT', Icon: X, active: 'border-red-600 bg-red-50 text-red-600' },
                    { status: 'LATE', Icon: Clock, active: 'border-amber-600 bg-amber-50 text-amber-600' },
                  ] as const).map(({ status, Icon, active }) => (
                    <td key={status} className="px-4 py-3 text-center">
                      <button
                        onClick={() => setAttendance({ ...attendance, [s.id]: status })}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-colors ${attendance[s.id] === status ? active : 'border-slate-200 text-slate-300 hover:border-slate-300'}`}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table></div>
          <div className="p-4 border-t border-slate-200 flex justify-end"><Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Attendance'}</Button></div>
        </Card>
      ) : null}
    </div>
  );
}
