import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, Pencil, Trash2, Award } from 'lucide-react';
import type { Faculty } from '@/types';

export function AdminFaculty() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Faculty | null>(null);
  const { show } = useToast();
  const [form, setForm] = useState({ name: '', subject: '', bio: '', photo_url: '', display_order: 0 });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from('faculty').select('*').order('display_order');
    setFaculty((data as Faculty[]) ?? []);
    setLoading(false);
  }

  function openAdd() { setEditing(null); setForm({ name: '', subject: '', bio: '', photo_url: '', display_order: 0 }); setModalOpen(true); }
  function openEdit(f: Faculty) { setEditing(f); setForm({ name: f.name, subject: f.subject, bio: f.bio ?? '', photo_url: f.photo_url ?? '', display_order: f.display_order }); setModalOpen(true); }

  async function handleSubmit() {
    if (editing) {
      const { error } = await supabase.from('faculty').update(form).eq('id', editing.id);
      if (error) { show(error.message, 'error'); return; }
      show('Faculty updated', 'success');
    } else {
      const { error } = await supabase.from('faculty').insert(form);
      if (error) { show(error.message, 'error'); return; }
      show('Faculty added', 'success');
    }
    setModalOpen(false); load();
  }

  async function handleDelete(f: Faculty) {
    if (!confirm(`Delete faculty "${f.name}"?`)) return;
    const { error } = await supabase.from('faculty').delete().eq('id', f.id);
    if (error) { show(error.message, 'error'); return; }
    show('Faculty deleted', 'success'); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Faculty" description="Manage faculty profiles" action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Faculty</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : faculty.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<Award className="h-12 w-12" />} title="No faculty members" action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Faculty</Button>} /></div></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map((f) => (
            <Card key={f.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {f.photo_url ? <img src={f.photo_url} alt={f.name} className="h-16 w-16 rounded-xl object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-white text-xl font-semibold">{f.name.charAt(0)}</div>}
                    <div><h3 className="font-semibold text-slate-900">{f.name}</h3><p className="text-sm text-blue-600">{f.subject}</p></div>
                  </div>
                  <div className="flex gap-1"><button onClick={() => openEdit(f)} className="rounded p-1.5 text-slate-500 hover:bg-slate-200"><Pencil className="h-4 w-4" /></button><button onClick={() => handleDelete(f)} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>
                </div>
                {f.bio && <p className="mt-3 text-sm text-slate-600">{f.bio}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Faculty' : 'Add Faculty'}>
        <div className="space-y-4">
          <Input label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Subject *" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
          <Input label="Photo URL" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="https://..." />
          <Input label="Display Order" type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'}</Button></div>
        </div>
      </Modal>
    </div>
  );
}
