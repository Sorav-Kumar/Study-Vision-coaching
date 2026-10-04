import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { UserCog, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Teacher } from '@/types';

export function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const { show } = useToast();
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', subject: '', bio: '', status: 'ACTIVE' });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('teachers').select('*').order('created_at', { ascending: false });
    setTeachers((data as Teacher[]) ?? []);
    setLoading(false);
  }

  function openAdd() { setEditing(null); setForm({ full_name: '', phone: '', email: '', subject: '', bio: '', status: 'ACTIVE' }); setModalOpen(true); }
  function openEdit(t: Teacher) { setEditing(t); setForm({ full_name: t.full_name, phone: t.phone ?? '', email: t.email ?? '', subject: t.subject ?? '', bio: t.bio ?? '', status: t.status }); setModalOpen(true); }

  async function handleSubmit() {
    if (editing) {
      const { error } = await supabase.from('teachers').update(form).eq('id', editing.id);
      if (error) { show(error.message, 'error'); return; }
      show('Teacher updated', 'success');
    } else {
      const { error } = await supabase.from('teachers').insert(form);
      if (error) { show(error.message, 'error'); return; }
      show('Teacher added', 'success');
    }
    setModalOpen(false); load();
  }

  async function handleDelete(t: Teacher) {
    if (!confirm(`Delete teacher "${t.full_name}"?`)) return;
    const { error } = await supabase.from('teachers').delete().eq('id', t.id);
    if (error) { show(error.message, 'error'); return; }
    show('Teacher deleted', 'success'); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Teachers" description="Manage teaching staff" action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Teacher</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : teachers.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<UserCog className="h-12 w-12" />} title="No teachers found" action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Teacher</Button>} /></div></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((t) => (
            <Card key={t.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-lg">{t.full_name.charAt(0)}</div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{t.full_name}</h3>
                      <p className="text-sm text-blue-600">{t.subject ?? '—'}</p>
                    </div>
                  </div>
                  <Badge color={t.status === 'ACTIVE' ? 'green' : 'slate'}>{t.status}</Badge>
                </div>
                {t.bio && <p className="mt-3 text-sm text-slate-600 line-clamp-2">{t.bio}</p>}
                <div className="mt-4 flex gap-2 text-sm text-slate-500">
                  {t.phone && <span>{t.phone}</span>}
                  {t.email && <span className="truncate">{t.email}</span>}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(t)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(t)} className="text-red-600"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Teacher' : 'Add Teacher'}>
        <div className="space-y-4">
          <Input label="Full Name *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
