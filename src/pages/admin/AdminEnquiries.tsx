import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Mail, Phone } from 'lucide-react';
import type { Enquiry } from '@/types';

const statusColors: Record<string, string> = {
  'New': 'blue', 'Contacted': 'amber', 'Interested': 'purple', 'Admitted': 'green', 'Not Interested': 'red',
};

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModal, setStatusModal] = useState<Enquiry | null>(null);
  const [newStatus, setNewStatus] = useState('New');
  const { show } = useToast();

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    setEnquiries((data as Enquiry[]) ?? []);
    setLoading(false);
  }

  async function updateStatus() {
    if (!statusModal) return;
    const { error } = await supabase.from('enquiries').update({ status: newStatus }).eq('id', statusModal.id);
    if (error) { show(error.message, 'error'); return; }
    show('Status updated', 'success');
    setStatusModal(null); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Enquiries" description="Manage admission enquiries" />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : enquiries.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<Mail className="h-12 w-12" />} title="No enquiries yet" /></div></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enquiries.map((e) => (
            <Card key={e.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div><h3 className="font-semibold text-slate-900">{e.student_name}</h3><p className="text-sm text-slate-500">Parent: {e.parent_name}</p></div>
                  <button onClick={() => { setStatusModal(e); setNewStatus(e.status); }}><Badge color={statusColors[e.status]}>{e.status}</Badge></button>
                </div>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {e.mobile}</p>
                  {e.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {e.email}</p>}
                  <p>Class: {e.class_name ?? '—'}</p>
                  <p>Course: {e.course_stream ?? '—'}</p>
                  <p>Batch: {e.preferred_batch ?? '—'}</p>
                </div>
                {e.message && <p className="mt-2 text-sm text-slate-500 italic">"{e.message}"</p>}
                <p className="mt-2 text-xs text-slate-400">{new Date(e.created_at).toLocaleDateString()}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={!!statusModal} onClose={() => setStatusModal(null)} title="Update Enquiry Status" size="sm">
        <div className="space-y-4">
          <Select label="Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option>New</option><option>Contacted</option><option>Interested</option><option>Admitted</option><option>Not Interested</option>
          </Select>
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setStatusModal(null)}>Cancel</Button><Button onClick={updateStatus}>Update</Button></div>
        </div>
      </Modal>
    </div>
  );
}
