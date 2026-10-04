import { Calculator, GraduationCap, Mail, Phone, User, BookOpen, Award, Users } from 'lucide-react';

export function FacultyPage() {
  const faculty = [
    {
      name: 'Shashank Sir',
      subject: 'Mathematics Faculty',
      bio: 'Focused on concept clarity, problem-solving and exam-oriented preparation. With years of teaching experience, Shashank Sir helps students build strong mathematical foundations and develop the analytical thinking needed for board exams and competitive tests.',
      icon: Calculator,
    },
  ];

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
              Our Faculty
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">
              Meet Our Educators
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed">
              Experienced and dedicated teachers who are passionate about helping students
              understand concepts, not just memorize them.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {faculty.map((member) => (
            <div key={member.name} className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-200">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-slate-800 text-white shadow-lg">
                <member.icon className="h-12 w-12" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900">{member.name}</h3>
              <p className="mt-1 text-sm font-semibold text-blue-600">{member.subject}</p>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">{member.bio}</p>
            </div>
          ))}

          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-700">More Faculty Joining Soon</h3>
            <p className="mt-2 text-sm text-slate-500">
              We are expanding our team of dedicated educators. Check back for updates.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Quality Teaching, Every Step
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Our faculty members are selected for their subject expertise, teaching ability,
            and genuine commitment to student success. Every teacher at Study Vision Coaching
            Centre focuses on building understanding, not just delivering content.
          </p>
        </div>
      </section>
    </div>
  );
}
