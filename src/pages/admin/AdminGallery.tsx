import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, Trash2, Image } from 'lucide-react';

export function AdminGallery() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { show } = useToast();
  const [form, setForm] = useState({ title: '', category: 'Classroom Activities', description: '', image_url: '' });

  const categories = ['Classroom Activities', 'Teaching Sessions', 'Test & Examination', 'Student Activities', 'Results & Achievements', 'Special Events'];

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  async function handleSubmit() {
    if (!form.image_url) { show('Please provide an image URL', 'error'); return; }
    const { error } = await supabase.from('gallery').insert(form);
    if (error) { show(error.message, 'error'); return; }
    show('Gallery item added', 'success');
    setModalOpen(false); load();
  }

  async function handleDelete(item: any) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const { error } = await supabase.from('gallery').delete().eq('id', item.id);
    if (error) { show(error.message, 'error'); return; }
    show('Item deleted', 'success'); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gallery" description="Manage gallery images" action={<Button onClick={() => { setForm({ title: '', category: 'Classroom Activities', description: '', image_url: '' }); setModalOpen(true); }}><Plus className="h-4 w-4" /> Add Image</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : items.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<Image className="h-12 w-12" />} title="No gallery images" action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Image</Button>} /></div></Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <div className="relative group">
                <img src={item.image_url} alt={item.title} className="h-40 w-full object-cover rounded-t-xl" />
                <button onClick={() => handleDelete(item)} className="absolute top-2 right-2 rounded-lg bg-white/90 p-1.5 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="p-3"><h3 className="text-sm font-medium text-slate-900">{item.title}</h3><p className="text-xs text-blue-600">{item.category}</p></div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Gallery Image">
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Select label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</Select>
          <Input label="Image URL *" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." required />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>Add</Button></div>
        </div>
      </Modal>
    </div>
  );
}
