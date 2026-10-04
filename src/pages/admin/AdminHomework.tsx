import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, BookCheck, Trash2, Download } from 'lucide-react';
import type { Class, Batch } from '@/types';

export function AdminHomework() {
  const [homework, setHomework] = useState<any[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { show } = useToast();
  const [form, setForm] = useState({ title: '', description: '', subject: '', class_id: '', batch_id: '', due_date: '', file: null as File | null });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const [hRes, cRes, bRes] = await Promise.all([
      supabase.from('homework').select('*, class:classes(*), batch:batches(*)').order('created_at', { ascending: false }),
      supabase.from('classes').select('*').order('level'),
      supabase.from('batches').select('*').order('name'),
    ]);
    setHomework(hRes.data ?? []); setClasses(cRes.data ?? []); setBatches(bRes.data ?? []);
    setLoading(false);
  }

  async function handleSubmit() {
    let filePath = null, fileName = null;
    if (form.file) {
      const path = `homework/${Date.now()}_${form.file.name}`;
      const { error: upErr } = await supabase.storage.from('notes').upload(path, form.file);
      if (upErr) { show(upErr.message, 'error'); return; }
      const { data: urlData } = supabase.storage.from('notes').getPublicUrl(path);
      filePath = urlData.publicUrl; fileName = form.file.name;
    }
    const { error } = await supabase.from('homework').insert({
      title: form.title, description: form.description, subject: form.subject,
      class_id: form.class_id || null, batch_id: form.batch_id || null, due_date: form.due_date,
      file_path: filePath, file_name: fileName,
    });
    if (error) { show(error.message, 'error'); return; }
    show('Homework created', 'success');
    setModalOpen(false); load();
  }

  async function handleDelete(h: any) {
    if (!confirm(`Delete homework "${h.title}"?`)) return;
    const { error } = await supabase.from('homework').delete().eq('id', h.id);
    if (error) { show(error.message, 'error'); return; }
    show('Homework deleted', 'success'); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Homework" description="Create and manage assignments" action={<Button onClick={() => { setForm({ title: '', description: '', subject: '', class_id: '', batch_id: '', due_date: '', file: null }); setModalOpen(true); }}><Plus className="h-4 w-4" /> Add Homework</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : homework.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<BookCheck className="h-12 w-12" />} title="No homework created" action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Homework</Button>} /></div></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {homework.map((h) => (
            <Card key={h.id}><div className="p-6">
              <div className="flex items-start justify-between"><div><h3 className="font-semibold text-slate-900">{h.title}</h3><p className="text-sm text-blue-600">{h.subject}</p></div><button onClick={() => handleDelete(h)} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>
              {h.description && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{h.description}</p>}
              <div className="mt-3 space-y-1 text-sm text-slate-500"><p>Due: {h.due_date}</p>{h.class && <p>Class: {h.class.name}</p>}{h.batch && <p>Batch: {h.batch.name}</p>}</div>
              {h.file_path && <a href={h.file_path} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"><Download className="h-4 w-4" /> Attachment</a>}
            </div></Card>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Homework" size="lg">
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Subject *" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            <Input label="Due Date" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            <Select label="Class" value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}><option value="">Any</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
            <Select label="Batch" value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })}><option value="">Any</option>{batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Attachment (optional)</label><input type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })} className="w-full text-sm" /></div>
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>Create</Button></div>
        </div>
      </Modal>
    </div>
  );
}
