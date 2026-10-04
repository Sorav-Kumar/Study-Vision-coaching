import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, ClipboardList, Pencil } from 'lucide-react';
import type { Class, Batch, Student, Test } from '@/types';

export function AdminTests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Test | null>(null);
  const [marksModal, setMarksModal] = useState<Test | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const { show } = useToast();
  const [form, setForm] = useState({ name: '', subject: '', class_id: '', batch_id: '', test_date: '', total_marks: '100', description: '', syllabus: '' });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const [tRes, cRes, bRes] = await Promise.all([
      supabase.from('tests').select('*, class:classes(*), batch:batches(*)').order('test_date', { ascending: false }),
      supabase.from('classes').select('*').order('level'),
      supabase.from('batches').select('*').order('name'),
    ]);
    setTests((tRes.data as Test[]) ?? []);
    setClasses(cRes.data ?? []);
    setBatches(bRes.data ?? []);
    setLoading(false);
  }

  async function handleSubmit() {
    const payload = { ...form, total_marks: parseInt(form.total_marks) || 100, class_id: form.class_id || null, batch_id: form.batch_id || null };
    if (editing) {
      const { error } = await supabase.from('tests').update(payload).eq('id', editing.id);
      if (error) { show(error.message, 'error'); return; }
      show('Test updated', 'success');
    } else {
      const { error } = await supabase.from('tests').insert(payload);
      if (error) { show(error.message, 'error'); return; }
      show('Test created', 'success');
    }
    setModalOpen(false); load();
  }

  async function openMarks(t: Test) {
    setMarksModal(t);
    const { data } = await supabase.from('students').select('*').eq('batch_id', t.batch_id).eq('status', 'ACTIVE').order('full_name');
    setStudents((data as Student[]) ?? []);
    const { data: existing } = await supabase.from('test_results').select('*').eq('test_id', t.id);
    const map: Record<string, string> = {};
    (existing ?? []).forEach((r: any) => { map[r.student_id] = String(r.marks_obtained); });
    setMarks(map);
  }

  async function saveMarks() {
    if (!marksModal) return;
    await supabase.from('test_results').delete().eq('test_id', marksModal.id);
    const records = students.map((s) => ({ test_id: marksModal.id, student_id: s.id, marks_obtained: parseFloat(marks[s.id]) || 0 })).filter((r) => marks[r.student_id] !== undefined);
    if (records.length > 0) {
      const { error } = await supabase.from('test_results').insert(records);
      if (error) { show(error.message, 'error'); return; }
    }
    show('Marks saved', 'success');
    setMarksModal(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tests" description="Create tests and manage marks" action={<Button onClick={() => { setEditing(null); setForm({ name: '', subject: '', class_id: '', batch_id: '', test_date: '', total_marks: '100', description: '', syllabus: '' }); setModalOpen(true); }}><Plus className="h-4 w-4" /> Create Test</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : tests.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<ClipboardList className="h-12 w-12" />} title="No tests created" action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Create Test</Button>} /></div></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((t) => (
            <Card key={t.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div><h3 className="font-semibold text-slate-900">{t.name}</h3><p className="text-sm text-blue-600">{t.subject}</p></div>
                  <Badge color="blue">{t.total_marks} marks</Badge>
                </div>
                <div className="mt-3 space-y-1 text-sm text-slate-500">
                  <p>Date: {t.test_date}</p>
                  {t.class && <p>Class: {t.class.name}</p>}
                  {t.batch && <p>Batch: {t.batch.name}</p>}
                </div>
                {t.syllabus && <p className="mt-2 text-xs text-slate-500 line-clamp-2">{t.syllabus}</p>}
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openMarks(t)}>Enter Marks</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(t); setForm({ name: t.name, subject: t.subject, class_id: t.class_id ?? '', batch_id: t.batch_id ?? '', test_date: t.test_date, total_marks: String(t.total_marks), description: t.description ?? '', syllabus: t.syllabus ?? '' }); setModalOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Test' : 'Create Test'} size="lg">
        <div className="space-y-4">
          <Input label="Test Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Subject *" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            <Input label="Total Marks" type="number" value={form.total_marks} onChange={(e) => setForm({ ...form, total_marks: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Class" value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}><option value="">Any</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
            <Select label="Batch" value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })}><option value="">Any</option>{batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
          </div>
          <Input label="Test Date" type="date" value={form.test_date} onChange={(e) => setForm({ ...form, test_date: e.target.value })} />
          <Textarea label="Syllabus" value={form.syllabus} onChange={(e) => setForm({ ...form, syllabus: e.target.value })} rows={2} />
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>{editing ? 'Update' : 'Create'}</Button></div>
        </div>
      </Modal>
      <Modal open={!!marksModal} onClose={() => setMarksModal(null)} title={`Enter Marks - ${marksModal?.name ?? ''}`} size="lg">
        <div className="space-y-3">
          {students.length === 0 ? <p className="text-sm text-slate-500">No students in this batch.</p> : students.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-900">{s.full_name}</span>
              <div className="flex items-center gap-2">
                <Input type="number" value={marks[s.id] ?? ''} onChange={(e) => setMarks({ ...marks, [s.id]: e.target.value })} className="w-24" placeholder="0" />
                <span className="text-sm text-slate-500">/ {marksModal?.total_marks}</span>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setMarksModal(null)}>Cancel</Button><Button onClick={saveMarks}>Save Marks</Button></div>
        </div>
      </Modal>
    </div>
  );
}
