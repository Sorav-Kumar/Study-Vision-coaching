import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import type { Batch, Class, Course, Teacher } from '@/types';

export function AdminBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Batch | null>(null);
  const { show } = useToast();
  const [form, setForm] = useState({ name: '', class_id: '', course_id: '', teacher_id: '', academic_year: '', schedule: '', is_active: true });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const [bRes, cRes, coRes, tRes] = await Promise.all([
      supabase.from('batches').select('*, class:classes(*), course:courses(*), teacher:teachers(*)').order('name'),
      supabase.from('classes').select('*').order('level'),
      supabase.from('courses').select('*').order('display_order'),
      supabase.from('teachers').select('*').order('full_name'),
    ]);
    setBatches((bRes.data as Batch[]) ?? []);
    setClasses(cRes.data ?? []);
    setCourses(coRes.data ?? []);
    setTeachers((tRes.data as Teacher[]) ?? []);
    setLoading(false);
  }
  function openAdd() { setEditing(null); setForm({ name: '', class_id: '', course_id: '', teacher_id: '', academic_year: '', schedule: '', is_active: true }); setModalOpen(true); }
  function openEdit(b: Batch) { setEditing(b); setForm({ name: b.name, class_id: b.class_id ?? '', course_id: b.course_id ?? '', teacher_id: b.teacher_id ?? '', academic_year: b.academic_year ?? '', schedule: b.schedule ?? '', is_active: b.is_active }); setModalOpen(true); }
  async function handleSubmit() {
    const payload = { ...form, class_id: form.class_id || null, course_id: form.course_id || null, teacher_id: form.teacher_id || null };
    if (editing) {
      const { error } = await supabase.from('batches').update(payload).eq('id', editing.id);
      if (error) { show(error.message, 'error'); return; }
      show('Batch updated', 'success');
    } else {
      const { error } = await supabase.from('batches').insert(payload);
      if (error) { show(error.message, 'error'); return; }
      show('Batch added', 'success');
    }
    setModalOpen(false); load();
  }
  async function handleDelete(b: Batch) {
    if (!confirm(`Delete batch "${b.name}"?`)) return;
    const { error } = await supabase.from('batches').delete().eq('id', b.id);
    if (error) { show(error.message, 'error'); return; }
    show('Batch deleted', 'success'); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Batches" description="Manage student batches" action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Batch</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : batches.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<FolderTree className="h-12 w-12" />} title="No batches found" action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Batch</Button>} /></div></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="px-4 py-3 text-left font-medium text-slate-600">Name</th><th className="px-4 py-3 text-left font-medium text-slate-600 hidden sm:table-cell">Class</th><th className="px-4 py-3 text-left font-medium text-slate-600 hidden md:table-cell">Teacher</th><th className="px-4 py-3 text-left font-medium text-slate-600">Status</th><th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{b.name}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-slate-600">{b.class?.name ?? '—'}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600">{b.teacher?.full_name ?? '—'}</td>
                  <td className="px-4 py-3"><Badge color={b.is_active ? 'green' : 'slate'}>{b.is_active ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="px-4 py-3 text-right"><div className="flex justify-end gap-1"><button onClick={() => openEdit(b)} className="rounded p-1.5 text-slate-500 hover:bg-slate-200"><Pencil className="h-4 w-4" /></button><button onClick={() => handleDelete(b)} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </Card>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Batch' : 'Add Batch'}>
        <div className="space-y-4">
          <Input label="Batch Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Select label="Class" value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}><option value="">Select class</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
          <Select label="Course" value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}><option value="">Select course</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
          <Select label="Teacher" value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}><option value="">Select teacher</option>{teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}</Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Academic Year" value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} placeholder="2025-26" />
            <Input label="Schedule" value={form.schedule} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Mon-Sat 4-6 PM" />
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" /> Active</label>
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'}</Button></div>
        </div>
      </Modal>
    </div>
  );
}
