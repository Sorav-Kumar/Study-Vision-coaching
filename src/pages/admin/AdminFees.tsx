import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Plus, DollarSign, Receipt } from 'lucide-react';
import type { Student } from '@/types';

export function AdminFees() {
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState<any | null>(null);
  const { show } = useToast();
  const [form, setForm] = useState({ student_id: '', total_amount: '', fee_type: 'Monthly', description: '', due_date: '' });
  const [payment, setPayment] = useState({ amount: '', payment_method: 'Cash', month: '' });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const [sRes, fRes] = await Promise.all([
      supabase.from('students').select('*').eq('status', 'ACTIVE').order('full_name'),
      supabase.from('fees').select('*, student:students(full_name, student_id)').order('created_at', { ascending: false }),
    ]);
    setStudents((sRes.data as Student[]) ?? []);
    setFees(fRes.data ?? []);
    setLoading(false);
  }

  async function handleCreateFee() {
    const payload = { ...form, total_amount: parseFloat(form.total_amount) || 0, paid_amount: 0, discount: 0, due_date: form.due_date || null };
    const { error } = await supabase.from('fees').insert(payload);
    if (error) { show(error.message, 'error'); return; }
    show('Fee record created', 'success');
    setModalOpen(false); load();
  }

  async function handlePayment() {
    if (!paymentModal) return;
    const amount = parseFloat(payment.amount) || 0;
    const receiptNumber = `RCP${Date.now().toString().slice(-8)}`;
    const { error: payError } = await supabase.from('fee_payments').insert({ fee_id: paymentModal.id, receipt_number: receiptNumber, amount, payment_date: new Date().toISOString().split('T')[0], payment_method: payment.payment_method, month: payment.month || null });
    if (payError) { show(payError.message, 'error'); return; }
    const newPaid = (paymentModal.paid_amount || 0) + amount;
    const { error: feeError } = await supabase.from('fees').update({ paid_amount: newPaid }).eq('id', paymentModal.id);
    if (feeError) { show(feeError.message, 'error'); return; }
    show('Payment recorded', 'success');
    setPaymentModal(null); setPayment({ amount: '', payment_method: 'Cash', month: '' }); load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Fees" description="Manage student fees and payments" action={<Button onClick={() => { setForm({ student_id: '', total_amount: '', fee_type: 'Monthly', description: '', due_date: '' }); setModalOpen(true); }}><Plus className="h-4 w-4" /> Create Fee</Button>} />
      {loading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : fees.length === 0 ? (
        <Card><div className="p-6"><EmptyState icon={<DollarSign className="h-12 w-12" />} title="No fee records" action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Create Fee</Button>} /></div></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="px-4 py-3 text-left font-medium text-slate-600">Student</th><th className="px-4 py-3 text-left font-medium text-slate-600 hidden sm:table-cell">Type</th><th className="px-4 py-3 text-right font-medium text-slate-600">Total</th><th className="px-4 py-3 text-right font-medium text-slate-600">Paid</th><th className="px-4 py-3 text-right font-medium text-slate-600">Pending</th><th className="px-4 py-3 text-center font-medium text-slate-600">Action</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {fees.map((f) => {
                const pending = (f.total_amount || 0) - (f.paid_amount || 0);
                return (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{f.student?.full_name ?? '—'}</td>
                    <td className="px-4 py-3 hidden sm:table-cell"><Badge color="blue">{f.fee_type}</Badge></td>
                    <td className="px-4 py-3 text-right text-slate-600">₹{f.total_amount}</td>
                    <td className="px-4 py-3 text-right text-green-600">₹{f.paid_amount || 0}</td>
                    <td className="px-4 py-3 text-right"><Badge color={pending > 0 ? 'red' : 'green'}>₹{pending}</Badge></td>
                    <td className="px-4 py-3 text-center">{pending > 0 && <Button size="sm" variant="outline" onClick={() => { setPaymentModal(f); setPayment({ amount: String(pending), payment_method: 'Cash', month: '' }); }}><Receipt className="h-3.5 w-3.5" /> Pay</Button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        </Card>
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Fee Record">
        <div className="space-y-4">
          <Select label="Student *" value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })}><option value="">Select student</option>{students.map((s) => <option key={s.id} value={s.id}>{s.full_name}</option>)}</Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Total Amount *" type="number" value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} required />
            <Select label="Fee Type" value={form.fee_type} onChange={(e) => setForm({ ...form, fee_type: e.target.value })}><option>Monthly</option><option>Course</option><option>Admission</option><option>Other</option></Select>
          </div>
          <Input label="Due Date" type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleCreateFee}>Create</Button></div>
        </div>
      </Modal>
      <Modal open={!!paymentModal} onClose={() => setPaymentModal(null)} title="Record Payment" size="sm">
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4 text-sm"><p className="font-medium text-slate-900">{paymentModal?.student?.full_name}</p><p className="text-slate-500">Pending: ₹{(paymentModal?.total_amount || 0) - (paymentModal?.paid_amount || 0)}</p></div>
          <Input label="Amount *" type="number" value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} required />
          <Select label="Payment Method" value={payment.payment_method} onChange={(e) => setPayment({ ...payment, payment_method: e.target.value })}><option>Cash</option><option>UPI</option><option>Bank Transfer</option><option>Other</option></Select>
          <Input label="Month" value={payment.month} onChange={(e) => setPayment({ ...payment, month: e.target.value })} placeholder="e.g. October 2025" />
          <div className="flex justify-end gap-3 pt-2"><Button variant="outline" onClick={() => setPaymentModal(null)}>Cancel</Button><Button onClick={handlePayment}>Record Payment</Button></div>
        </div>
      </Modal>
    </div>
  );
}
