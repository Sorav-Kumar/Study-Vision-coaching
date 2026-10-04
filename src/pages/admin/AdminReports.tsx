import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, CardBody, LoadingSpinner, EmptyState } from '@/components/ui';
import { Users, DollarSign, Calendar, ClipboardList, Mail, BarChart3 } from 'lucide-react';

export function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [feeTotal, setFeeTotal] = useState(0);
  const [feePending, setFeePending] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const [sRes, eRes, fRes, tRes, aRes] = await Promise.all([
      supabase.from('students').select('id', { count: 'exact', head: true }),
      supabase.from('enquiries').select('id', { count: 'exact', head: true }),
      supabase.from('fees').select('total_amount, paid_amount'),
      supabase.from('tests').select('id', { count: 'exact', head: true }),
      supabase.from('attendance').select('status'),
    ]);
    setStudentCount(sRes.count ?? 0);
    setEnquiryCount(eRes.count ?? 0);
    const fees = fRes.data ?? [];
    setFeeTotal(fees.reduce((sum, f) => sum + (f.total_amount || 0), 0));
    setFeePending(fees.reduce((sum, f) => sum + ((f.total_amount || 0) - (f.paid_amount || 0)), 0));
    setTestCount(tRes.count ?? 0);
    const att = aRes.data ?? [];
    if (att.length > 0) {
      const present = att.filter((a) => a.status === 'PRESENT' || a.status === 'LATE').length;
      setAttendanceRate(Math.round((present / att.length) * 100));
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  };

  const reports = [
    { icon: Users, title: 'Student List', desc: 'Complete list of all students', value: `${studentCount} students`, color: 'blue' },
    { icon: DollarSign, title: 'Fee Collection', desc: 'Total fees collected', value: `₹${feeTotal}`, color: 'green' },
    { icon: DollarSign, title: 'Pending Fees', desc: 'Outstanding fee amount', value: `₹${feePending}`, color: 'amber' },
    { icon: Calendar, title: 'Attendance', desc: 'Overall attendance rate', value: `${attendanceRate}%`, color: 'blue' },
    { icon: ClipboardList, title: 'Tests', desc: 'Total tests conducted', value: `${testCount} tests`, color: 'purple' },
    { icon: Mail, title: 'Enquiries', desc: 'Total admission enquiries', value: `${enquiryCount} enquiries`, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Overview and analytics" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <Card key={r.title}>
            <CardBody className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorMap[r.color]}`}>
                <r.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{r.value}</p>
                <p className="text-sm text-slate-500">{r.title}</p>
                <p className="text-xs text-slate-400">{r.desc}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      <Card>
        <CardBody>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Report Summary</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-100 py-2"><span className="text-sm text-slate-600">Total Students</span><span className="text-sm font-semibold text-slate-900">{studentCount}</span></div>
            <div className="flex justify-between border-b border-slate-100 py-2"><span className="text-sm text-slate-600">Total Fees Collected</span><span className="text-sm font-semibold text-green-600">₹{feeTotal}</span></div>
            <div className="flex justify-between border-b border-slate-100 py-2"><span className="text-sm text-slate-600">Pending Fees</span><span className="text-sm font-semibold text-amber-600">₹{feePending}</span></div>
            <div className="flex justify-between border-b border-slate-100 py-2"><span className="text-sm text-slate-600">Attendance Rate</span><span className="text-sm font-semibold text-blue-600">{attendanceRate}%</span></div>
            <div className="flex justify-between border-b border-slate-100 py-2"><span className="text-sm text-slate-600">Total Tests</span><span className="text-sm font-semibold text-slate-900">{testCount}</span></div>
            <div className="flex justify-between py-2"><span className="text-sm text-slate-600">Total Enquiries</span><span className="text-sm font-semibold text-slate-900">{enquiryCount}</span></div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
