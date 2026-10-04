import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, Card, CardBody, LoadingSpinner, EmptyState, StatCard, Badge } from '@/components/ui';
import { DollarSign, Receipt } from 'lucide-react';

export function StudentFees() {
  const { profile } = useAuth();
  const [fees, setFees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0 });

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data: student } = await supabase.from('students').select('id').eq('profile_id', profile?.id).maybeSingle();
    if (student) {
      const { data: feeData } = await supabase.from('fees').select('*').eq('student_id', student.id).order('created_at', { ascending: false });
      const total = (feeData ?? []).reduce((s, f) => s + (f.total_amount || 0), 0);
      const paid = (feeData ?? []).reduce((s, f) => s + (f.paid_amount || 0), 0);
      setStats({ total, paid, pending: total - paid });
      setFees(feeData ?? []);
      const feeIds = (feeData ?? []).map((f) => f.id);
      if (feeIds.length > 0) {
        const { data: payData } = await supabase.from('fee_payments').select('*').in('fee_id', feeIds).order('payment_date', { ascending: false });
        setPayments(payData ?? []);
      }
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="My Fees" description="View fee details and payment history" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<DollarSign className="h-6 w-6" />} label="Total Fee" value={`₹${stats.total}`} color="blue" />
        <StatCard icon={<DollarSign className="h-6 w-6" />} label="Paid" value={`₹${stats.paid}`} color="green" />
        <StatCard icon={<DollarSign className="h-6 w-6" />} label="Pending" value={`₹${stats.pending}`} color="amber" />
      </div>
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Fee Records</h3>
          {fees.length === 0 ? <EmptyState icon={<DollarSign className="h-12 w-12" />} title="No fee records" /> : (
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="border-b border-slate-200"><tr><th className="px-4 py-2 text-left font-medium text-slate-600">Type</th><th className="px-4 py-2 text-right font-medium text-slate-600">Total</th><th className="px-4 py-2 text-right font-medium text-slate-600">Paid</th><th className="px-4 py-2 text-right font-medium text-slate-600">Pending</th><th className="px-4 py-2 text-left font-medium text-slate-600">Due Date</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((f) => (
                  <tr key={f.id}><td className="px-4 py-2"><Badge color="blue">{f.fee_type}</Badge></td><td className="px-4 py-2 text-right">₹{f.total_amount}</td><td className="px-4 py-2 text-right text-green-600">₹{f.paid_amount || 0}</td><td className="px-4 py-2 text-right text-amber-600">₹{(f.total_amount || 0) - (f.paid_amount || 0)}</td><td className="px-4 py-2 text-slate-500">{f.due_date ?? '—'}</td></tr>
                ))}
              </tbody>
            </table></div>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Receipt className="h-5 w-5 text-blue-600" /> Payment History</h3>
          {payments.length === 0 ? <EmptyState icon={<Receipt className="h-12 w-12" />} title="No payments yet" /> : (
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead className="border-b border-slate-200"><tr><th className="px-4 py-2 text-left font-medium text-slate-600">Receipt #</th><th className="px-4 py-2 text-right font-medium text-slate-600">Amount</th><th className="px-4 py-2 text-left font-medium text-slate-600">Date</th><th className="px-4 py-2 text-left font-medium text-slate-600">Method</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id}><td className="px-4 py-2 font-mono text-xs">{p.receipt_number}</td><td className="px-4 py-2 text-right text-green-600">₹{p.amount}</td><td className="px-4 py-2 text-slate-500">{p.payment_date}</td><td className="px-4 py-2"><Badge color="slate">{p.payment_method}</Badge></td></tr>
                ))}
              </tbody>
            </table></div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
