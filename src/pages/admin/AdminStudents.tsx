import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PageHeader, Card, CardBody, LoadingSpinner, EmptyState, Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { Users, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import type { Student, Class, Course, Batch } from '@/types';

export function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const { show } = useToast();

  const [form, setForm] = useState({
    full_name: '', student_id: '', date_of_birth: '', gender: 'Male',
    parent_name: '', parent_phone: '', alternate_phone: '', email: '',
    address: '', school_name: '', class_id: '', course_id: '', batch_id: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [studentsRes, classesRes, coursesRes, batchesRes] = await Promise.all([
      supabase.from('students').select('*, class:classes(*), course:courses(*), batch:batches(*)').order('created_at', { ascending: false }),
      supabase.from('classes').select('*').order('level'),
      supabase.from('courses').select('*').order('display_order'),
      supabase.from('batches').select('*').order('name'),
    ]);
    setStudents((studentsRes.data as Student[]) ?? []);
    setClasses(classesRes.data ?? []);
    setCourses(coursesRes.data ?? []);
    setBatches(batchesRes.data ?? []);
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    const nextId = `SVC${String(students.length + 1).padStart(4, '0')}`;
    setForm({ full_name: '', student_id: nextId, date_of_birth: '', gender: 'Male', parent_name: '', parent_phone: '', alternate_phone: '', email: '', address: '', school_name: '', class_id: '', course_id: '', batch_id: '', status: 'ACTIVE' });
    setModalOpen(true);
  }

  function openEdit(s: Student) {
    setEditing(s);
    setForm({
      full_name: s.full_name, student_id: s.student_id ?? '', date_of_birth: s.date_of_birth ?? '',
      gender: s.gender ?? 'Male', parent_name: s.parent_name ?? '', parent_phone: s.parent_phone ?? '',
      alternate_phone: s.alternate_phone ?? '', email: s.email ?? '', address: s.address ?? '',
      school_name: s.school_name ?? '', class_id: s.class_id ?? '', course_id: s.course_id ?? '',
      batch_id: s.batch_id ?? '', status: s.status,
    });
    setModalOpen(true);
  }

  async function handleSubmit() {
    const payload = {
      ...form,
      class_id: form.class_id || null,
      course_id: form.course_id || null,
      batch_id: form.batch_id || null,
      date_of_birth: form.date_of_birth || null,
    };

    if (editing) {
      const { error } = await supabase.from('students').update(payload).eq('id', editing.id);
      if (error) { show(error.message, 'error'); return; }
      show('Student updated successfully', 'success');
    } else {
      const { error } = await supabase.from('students').insert(payload);
      if (error) { show(error.message, 'error'); return; }
      show('Student added successfully', 'success');
    }
    setModalOpen(false);
    loadData();
  }

  async function handleDelete(s: Student) {
    if (!confirm(`Delete student "${s.full_name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('students').delete().eq('id', s.id);
    if (error) { show(error.message, 'error'); return; }
    show('Student deleted', 'success');
    loadData();
  }

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return !search || s.full_name.toLowerCase().includes(q) || (s.student_id ?? '').toLowerCase().includes(q) || (s.parent_phone ?? '').includes(q);
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Manage student records" action={
        <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Student</Button>
      } />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by name, ID, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardBody><EmptyState icon={<Users className="h-12 w-12" />} title="No students found" description="Add your first student to get started." action={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Student</Button>} /></CardBody></Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Student ID</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 hidden sm:table-cell">Class</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 hidden md:table-cell">Batch</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 hidden lg:table-cell">Parent Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.student_id ?? '—'}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{s.full_name}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-slate-600">{s.class?.name ?? '—'}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-600">{s.batch?.name ?? '—'}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-600">{s.parent_phone ?? '—'}</td>
                    <td className="px-4 py-3"><Badge color={s.status === 'ACTIVE' ? 'green' : 'slate'}>{s.status}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(s)} className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(s)} className="rounded p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Student' : 'Add Student'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name *" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            <Input label="Student ID" value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} />
            <Input label="Date of Birth" type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
            <Select label="Gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </Select>
            <Input label="Parent/Guardian Name" value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })} />
            <Input label="Parent Phone" value={form.parent_phone} onChange={(e) => setForm({ ...form, parent_phone: e.target.value })} />
            <Input label="Alternate Phone" value={form.alternate_phone} onChange={(e) => setForm({ ...form, alternate_phone: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="School Name" value={form.school_name} onChange={(e) => setForm({ ...form, school_name: e.target.value })} />
            <Select label="Class" value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}>
              <option value="">Select class</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label="Course" value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })}>
              <option value="">Select course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label="Batch" value={form.batch_id} onChange={(e) => setForm({ ...form, batch_id: e.target.value })}>
              <option value="">Select batch</option>
              {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="GRADUATED">Graduated</option><option value="LEFT">Left</option>
            </Select>
          </div>
          <Textarea label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editing ? 'Update' : 'Add'} Student</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
