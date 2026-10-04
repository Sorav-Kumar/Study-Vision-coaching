import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, Clock, Trash2 } from 'lucide-react';
import type { Class, Batch, Timetable } from '@/types';

export function AdminTimetable() {
  const [entries, setEntries] = useState<Timetable[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { show } = useToast();
  const [form, setForm] = useState({ day: 'Monday', date: '', start_time: '', end_time: '', subject: '', teacher_id: '', class_id: '', batch_id: '', room: '' });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const [tRes, cRes, bRes] = await Promise.all([
      supabase.from('timetable').select('*, class:classes(*), batch:batches(*)').order('start_time'),
      supabase.from('classes').select('*').order('level'),
      supabase.from('batches').select('*').order('name'),
    ]);
    setEntries((tRes.data as Timetable[]) ?? []); setClasses(cRes.data ?? []); setBatches(bRes.data ?? []);
    setLoading(false);
  }

  async function handleSubmit() {
    const payload = { ...form, date: form.date || null, teacher_id: form.teacher_id || null, class_id: form.class_id || null, batch_id: form.batch_id || null };
    const { error } = await supabase.from('timetable').insert(payload);
    if (error) { show(error.message, 'error'); return; }
    show('Timetable entry added', 'success');
    setModalOpen(false); load();
  }

  async function handleDelete(t: Timetable) {
    const { error } = await supabase.from('timetable').delete().eq('id', t.id);
    if (error) { show(error.message, 'error'); return; }
    show('Entry deleted', 'success'); load();
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" description="Manage class schedules" action={<Button onClick={() => { setForm({ day: 'Monday', date: '', start_time: '', end_time: '', subject: '', teacher_id: '', class_id: '', batch_id: '', room: '' }); setModalOpen(true); }}><Plus className="h-4 w-4" /> Add Entry</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : entries.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<Clock className="h-12 w-12" />} title="No timetable entries" action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Add Entry</Button>} /></div></Card>
      ) : (
        <div className="space-y-4">
          {days.map((day) => {
            const dayEntries = entries.filter((e) => e.day === day);
            if (dayEntries.length === 0) return null;
            return (
              <Card key={day}>
                <div className="p-4"><h3 className="font-semibold text-slate-900 mb-3">{day}</h3>
                  <div className="space-y-2">
                    {dayEntries.map((t) => (
                      <div key={t.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-mono text-slate-600">{t.start_time} - {t.end_time}</span>
                          <span className="text-sm font-medium text-slate-900">{t.subject}</span>
                          {t.class && <span className="text-xs text-slate-500">{t.class.name}</span>}
                          {t.room && <span className="text-xs text-slate-500">Room: {t.room}</span>}
                        </div>
                        <button onClick={() => handleDelete(t)} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Timetable Entry">
        <div className="space-y-4">
          <Select label="Day" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>{days.map((d) => <option key={d} value={d}>{d}</option>)}</Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
            <Input label="End Time" type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
          </div>
          <Input label="Subject *" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Class" value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}><option value="">Any</option>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
            <Select label="Batch" value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })}><option value="">Any</option>{batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
          </div>
          <Input label="Room" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit}>Add</Button></div>
        </div>
      </Modal>
    </div>
  );
}
