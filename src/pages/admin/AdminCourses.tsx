import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import type { Course } from '@/types';

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const { show } = useToast();
  const [form, setForm] = useState({ name: '', description: '', class_range: '', stream: '', features: '', display_order: 0, is_active: true });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from('courses').select('*').order('display_order');
    setCourses((data as Course[]) ?? []);
    setLoading(false);
  }
  function openAdd() { setEditing(null); setForm({ name: '', description: '', class_range: '', stream: '', features: '', display_order: 0, is_active: true }); setModalOpen(true); }
  function openEdit(c: Course) { setEditing(c); setForm({ name: c.name, description: c.description ?? '', class_range: c.class_range ?? '', stream: c.stream ?? '', features: c.features.join('\n'), display_order: c.display_order, is_active: c.is_active }); setModalOpen(true); }
  async function handleSubmit() {
    const payload = { ...form, features: form.features.split('\n').map((f) => f.trim()).filter(Boolean) };
    if (editing) {
      const { error } = await supabase.from('courses').update(payload).eq('id', editing.id);
      if (error) { show(error.message, 'error'); return; }
      show('Course updated', 'success');
    } else {
      const { error } = await supabase.from('courses').insert(payload);
      if (error) { show(error.message, 'error'); return; }
      show('Course added', 'success');
    }
    setModalOpen(false); load();
  }
  async function handleDelete(c: Course) {
    if (!confirm(`Delete course "${c.name}"?`)) return;
    const { error } = await supabase.from('courses').delete().eq('id', c.id);
    if (error) { show(error.message, 'error'); return; }
    show('Course deleted', 'success'); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Courses" description="Manage course programs" action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Course</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : courses.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<BookOpen className="h-12 w-12" />} title="No courses found" action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Course</Button>} /></div></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <Card key={c.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div><h3 className="font-semibold text-slate-900">{c.name}</h3>{c.stream && <p className="text-sm text-blue-600">{c.stream}</p>}{c.class_range && <p className="text-xs text-slate-500">{c.class_range}</p>}</div>
                  <div className="flex gap-1"><button onClick={() => openEdit(c)} className="rounded p-1.5 text-slate-500 hover:bg-slate-200"><Pencil className="h-4 w-4" /></button><button onClick={() => handleDelete(c)} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>
                </div>
                {c.description && <p className="mt-2 text-sm text-slate-600">{c.description}</p>}
                {c.features.length > 0 && <ul className="mt-3 space-y-1">{c.features.slice(0, 4).map((f, i) => <li key={i} className="text-xs text-slate-500">• {f}</li>)}</ul>}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Course' : 'Add Course'} size="lg">
        <div className="space-y-4">
          <Input label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Class Range" value={form.class_range} onChange={(e) => setForm({ ...form, class_range: e.target.value })} placeholder="e.g. 1st-5th" />
            <Input label="Stream" value={form.stream} onChange={(e) => setForm({ ...form, stream: e.target.value })} placeholder="e.g. Science" />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <Textarea label="Features (one per line)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={5} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Display Order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
            <label className="flex items-center gap-2 pt-6"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" /> Active</label>
          </div>
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'}</Button></div>
        </div>
      </Modal>
    </div>
  );
}
