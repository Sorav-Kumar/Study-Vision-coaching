import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2, FileText, Download } from 'lucide-react';
import type { Class, Batch } from '@/types';

export function AdminNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { show } = useToast();
  const [form, setForm] = useState({ title: '', description: '', subject: '', class_id: '', batch_id: '', access_level: 'PUBLIC', file: null as File | null });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const [nRes, cRes, bRes] = await Promise.all([
      supabase.from('notes').select('*, class:classes(*), batch:batches(*)').order('created_at', { ascending: false }),
      supabase.from('classes').select('*').order('level'),
      supabase.from('batches').select('*').order('name'),
    ]);
    setNotes(nRes.data ?? []);
    setClasses(cRes.data ?? []);
    setBatches(bRes.data ?? []);
    setLoading(false);
  }

  async function handleUpload() {
    if (!form.file) { show('Please select a file', 'error'); return; }
    const filePath = `notes/${Date.now()}_${form.file.name}`;
    const { error: uploadError } = await supabase.storage.from('notes').upload(filePath, form.file);
    if (uploadError) { show(uploadError.message, 'error'); return; }
    const { data: urlData } = supabase.storage.from('notes').getPublicUrl(filePath);
    const { error } = await supabase.from('notes').insert({
      title: form.title, description: form.description, subject: form.subject,
      class_id: form.class_id || null, batch_id: form.batch_id || null, access_level: form.access_level,
      file_path: urlData.publicUrl, file_name: form.file.name, file_size: form.file.size,
    });
    if (error) { show(error.message, 'error'); return; }
    show('Note uploaded', 'success');
    setModalOpen(false); load();
  }

  async function handleDelete(n: any) {
    if (!confirm(`Delete note "${n.title}"?`)) return;
    const { error } = await supabase.from('notes').delete().eq('id', n.id);
    if (error) { show(error.message, 'error'); return; }
    show('Note deleted', 'success'); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Notes" description="Upload and manage study material" action={<Button onClick={() => { setForm({ title: '', description: '', subject: '', class_id: '', batch_id: '', access_level: 'PUBLIC', file: null }); setModalOpen(true); }}><Plus className="h-4 w-4" /> Upload Note</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : notes.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<FileText className="h-12 w-12" />} title="No notes uploaded" action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Upload Note</Button>} /></div></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((n) => (
            <Card key={n.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><FileText className="h-5 w-5" /></div>
                  <Badge color={n.access_level === 'PUBLIC' ? 'green' : n.access_level === 'CLASS' ? 'blue' : n.access_level === 'BATCH' ? 'amber' : 'red'}>{n.access_level}</Badge>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">{n.title}</h3>
                {n.subject && <p className="text-sm text-blue-600">{n.subject}</p>}
                {n.description && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{n.description}</p>}
                {n.class && <p className="mt-2 text-xs text-slate-500">Class: {n.class.name}</p>}
                <div className="mt-4 flex gap-2">
                  <a href={n.file_path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"><Download className="h-4 w-4" /> Download</a>
                  <button onClick={() => handleDelete(n)} className="ml-auto rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload Note" size="lg">
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <Select label="Access Level" value={form.access_level} onChange={(e) => setForm({ ...form, access_level: e.target.value })}><option value="PUBLIC">Public</option><option value="CLASS">Class</option><option value="BATCH">Batch</option><option value="SELECTED">Selected Students</option></Select>
            <Select label="Class" value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}><option value="">Any</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
            <Select label="Batch" value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })}><option value="">Any</option>{batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">File *</label><input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })} className="w-full text-sm" /></div>
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleUpload}>Upload</Button></div>
        </div>
      </Modal>
    </div>
  );
}
