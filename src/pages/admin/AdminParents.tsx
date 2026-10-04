import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import type { Parent } from '@/types';

export function AdminParents() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Parent | null>(null);
  const { show } = useToast();
  const [form, setForm] = useState({ full_name: '', phone: '', email: '' });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from('parents').select('*').order('created_at', { ascending: false });
    setParents((data as Parent[]) ?? []);
    setLoading(false);
  }
  function openAdd() { setEditing(null); setForm({ full_name: '', phone: '', email: '' }); setModalOpen(true); }
  function openEdit(p: Parent) { setEditing(p); setForm({ full_name: p.full_name, phone: p.phone ?? '', email: p.email ?? '' }); setModalOpen(true); }
  async function handleSubmit() {
    if (editing) {
      const { error } = await supabase.from('parents').update(form).eq('id', editing.id);
      if (error) { show(error.message, 'error'); return; }
      show('Parent updated', 'success');
    } else {
      const { error } = await supabase.from('parents').insert(form);
      if (error) { show(error.message, 'error'); return; }
      show('Parent added', 'success');
    }
    setModalOpen(false); load();
  }
  async function handleDelete(p: Parent) {
    if (!confirm(`Delete parent "${p.full_name}"?`)) return;
    const { error } = await supabase.from('parents').delete().eq('id', p.id);
    if (error) { show(error.message, 'error'); return; }
    show('Parent deleted', 'success'); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Parents" description="Manage parent/guardian records" action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Parent</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : parents.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<Users className="h-12 w-12" />} title="No parents found" action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Parent</Button>} /></div></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr><th className="px-4 py-3 text-left font-medium text-slate-600">Name</th><th className="px-4 py-3 text-left font-medium text-slate-600">Phone</th><th className="px-4 py-3 text-left font-medium text-slate-600 hidden sm:table-cell">Email</th><th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parents.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.full_name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.phone ?? '—'}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-slate-600">{p.email ?? '—'}</td>
                    <td className="px-4 py-3 text-right"><div className="flex justify-end gap-1"><button onClick={() => openEdit(p)} className="rounded p-1.5 text-slate-500 hover:bg-slate-200"><Pencil className="h-4 w-4" /></button><button onClick={() => handleDelete(p)} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Parent' : 'Add Parent'}>
        <div className="space-y-4">
          <Input label="Full Name *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'}</Button></div>
        </div>
      </Modal>
    </div>
  );
}
