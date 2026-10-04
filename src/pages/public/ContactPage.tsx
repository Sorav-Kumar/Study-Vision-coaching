import { useState, type FormEvent } from 'react';
import { Phone, MapPin, Instagram, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    student_name: '',
    parent_name: '',
    mobile: '',
    email: '',
    class_name: '',
    course_stream: '',
    preferred_batch: '',
    message: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!form.student_name || !form.parent_name || !form.mobile) {
      setError('Please fill in student name, parent name, and mobile number.');
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('enquiries').insert({
      ...form,
      status: 'New',
    });

    if (insertError) {
      setError('Something went wrong. Please try again or call us directly.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setForm({
      student_name: '',
      parent_name: '',
      mobile: '',
      email: '',
      class_name: '',
      course_stream: '',
      preferred_batch: '',
      message: '',
    });
  };

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-slate-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-500/30 px-4 py-1.5 text-sm font-medium text-blue-50 backdrop-blur-sm ring-1 ring-white/20">
              Contact Us
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">
              Get in Touch
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed">
              Have questions about admissions, courses, or anything else? We're here to help.
              Fill out the enquiry form below or reach us directly.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
            <p className="mt-3 text-slate-600">
              Reach out to us through any of these channels. We're happy to answer your questions.
            </p>

            <div className="mt-8 space-y-4">
              <a href="tel:9354024459" className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Call us</p>
                  <p className="text-lg font-semibold text-slate-900">9354024459</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-700 text-white">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Visit us</p>
                  <p className="text-lg font-semibold text-slate-900">Study Vision Coaching Centre</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-600 text-white">
                  <Instagram className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Follow us</p>
                  <p className="text-lg font-semibold text-slate-900">@studyvisioncoaching</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl overflow-hidden border border-slate-200">
              <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.0070665673775!2d77.40172358094443!3d28.539507313100128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce93db40d7e35%3A0xe9aa6940374e4f56!2sStudy%20vision!5e0!3m2!1sen!2sin!4v1791128897891!5m2!1sen!2sin"
  width="100%"
  height="400"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
  referrerPolicy="strict-origin-when-cross-origin"
  title="Study Vision Coaching Centre Location"
/>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Admission Enquiry</h2>
            <p className="mt-3 text-slate-600">
              Fill in the form below and we'll get back to you as soon as possible.
            </p>

            {submitted ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-green-200 bg-green-50 p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">Enquiry Submitted!</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Thank you for your interest. We will contact you shortly.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSubmitted(false)}
                >
                  Submit Another Enquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                  label="Student Name *"
                  value={form.student_name}
                  onChange={(e) => handleChange('student_name', e.target.value)}
                  placeholder="Enter student's full name"
                  required
                />
                <Input
                  label="Parent/Guardian Name *"
                  value={form.parent_name}
                  onChange={(e) => handleChange('parent_name', e.target.value)}
                  placeholder="Enter parent or guardian name"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Number *"
                    value={form.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    placeholder="10-digit mobile number"
                    required
                  />
                  <Input
                    label="Email (optional)"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Class"
                    value={form.class_name}
                    onChange={(e) => handleChange('class_name', e.target.value)}
                  >
                    <option value="">Select class</option>
                    {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map((c) => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </Select>
                  <Select
                    label="Course/Stream"
                    value={form.course_stream}
                    onChange={(e) => handleChange('course_stream', e.target.value)}
                  >
                    <option value="">Select course/stream</option>
                    <option value="All Subjects">All Subjects</option>
                    <option value="Science">Science Stream</option>
                    <option value="Commerce">Commerce Stream</option>
                    <option value="Arts">Arts/Humanities</option>
                  </Select>
                </div>
                <Select
                  label="Preferred Batch"
                  value={form.preferred_batch}
                  onChange={(e) => handleChange('preferred_batch', e.target.value)}
                >
                  <option value="">Select preferred batch</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </Select>
                <Textarea
                  label="Message"
                  value={form.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Any additional information or questions"
                  rows={4}
                />

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
                )}

                <Button type="submit" disabled={submitting} className="w-full" size="lg">
                  {submitting ? 'Submitting...' : 'Submit Enquiry'}
                  {!submitting && <Send className="h-4 w-4" />}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
