import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, Bell, Trash2 } from 'lucide-react';
import type { Class, Batch, Notice } from '@/types';

export function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { show } = useToast();
  const [form, setForm] = useState({ title: '', content: '', target: 'ALL', class_id: '', batch_id: '' });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const [nRes, cRes, bRes] = await Promise.all([
      supabase.from('notices').select('*, class:classes(*), batch:batches(*)').order('created_at', { ascending: false }),
      supabase.from('classes').select('*').order('level'),
      supabase.from('batches').select('*').order('name'),
    ]);
    setNotices((nRes.data as Notice[]) ?? []); setClasses(cRes.data ?? []); setBatches(bRes.data ?? []);
    setLoading(false);
  }

  async function handleSubmit() {
    const payload = { ...form, class_id: form.target === 'CLASS' ? form.class_id || null : null, batch_id: form.target === 'BATCH' ? form.batch_id || null : null };
    const { error } = await supabase.from('notices').insert(payload);
    if (error) { show(error.message, 'error'); return; }
    show('Notice created', 'success');
    setModalOpen(false); load();
  }

  async function handleDelete(n: Notice) {
    const { error } = await supabase.from('notices').delete().eq('id', n.id);
    if (error) { show(error.message, 'error'); return; }
    show('Notice deleted', 'success'); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Notices" description="Create announcements and notices" action={<Button onClick={() => { setForm({ title: '', content: '', target: 'ALL', class_id: '', batch_id: '' }); setModalOpen(true); }}><Plus className="h-4 w-4" /> Add Notice</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : notices.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<Bell className="h-12 w-12" />} title="No notices yet" action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Notice</Button>} /></div></Card>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <Card key={n.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{n.title}</h3>
                      <Badge color={n.target === 'ALL' ? 'blue' : n.target === 'CLASS' ? 'green' : 'amber'}>{n.target}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{n.content}</p>
                    <p className="mt-2 text-xs text-slate-400">{new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDelete(n)} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Notice">
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea label="Content *" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} required />
          <Select label="Target" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}>
            <option value="ALL">All</option><option value="CLASS">Class</option><option value="BATCH">Batch</option><option value="SELECTED">Selected Students</option>
          </Select>
          {form.target === 'CLASS' && <Select label="Class" value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}><option value="">Select class</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>}
          {form.target === 'BATCH' && <Select label="Batch" value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })}><option value="">Select batch</option>{batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>}
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>Create</Button></div>
        </div>
      </Modal>
    </div>
  );
}
