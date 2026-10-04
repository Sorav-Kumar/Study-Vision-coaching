import { BookOpen, Check, Calculator, FlaskConical, Globe2, Languages, Building2, Landmark, Palette, ArrowRight } from 'lucide-react';

interface CourseCard {
  icon: typeof BookOpen;
  title: string;
  subtitle: string;
  features: string[];
  highlight?: boolean;
}

const courses: CourseCard[] = [
  {
    icon: BookOpen,
    title: 'Classes 1st – 5th',
    subtitle: 'Primary Foundation',
    features: [
      'All Major Subjects',
      'Basic Concept Building',
      'Regular Practice',
      'Homework & Revision',
      'School Exam Preparation',
    ],
  },
  {
    icon: BookOpen,
    title: 'Classes 6th – 8th',
    subtitle: 'Middle School',
    features: [
      'All Major Subjects',
      'Concept-Based Learning',
      'Regular Tests',
      'Doubt Clearing',
      'School Examination Preparation',
    ],
  },
  {
    icon: BookOpen,
    title: 'Classes 9th – 10th',
    subtitle: 'Secondary / Board',
    highlight: true,
    features: [
      'Mathematics',
      'Science',
      'Social Science',
      'English',
      'Regular Tests & Practice',
      'Board Examination Preparation',
    ],
  },
];

interface StreamCard {
  icon: typeof BookOpen;
  title: string;
  subtitle: string;
  features: string[];
}

const streams: StreamCard[] = [
  {
    icon: FlaskConical,
    title: 'Science Stream',
    subtitle: 'Classes 11th – 12th',
    features: [
      'Physics',
      'Chemistry',
      'Mathematics / Biology',
      'English',
      'Regular Tests & Practice',
      'Board & Competitive Exam Prep',
    ],
  },
  {
    icon: Building2,
    title: 'Commerce Stream',
    subtitle: 'Classes 11th – 12th',
    features: [
      'Accountancy',
      'Business Studies',
      'Economics',
      'English',
      'Regular Tests & Practice',
      'Board Examination Preparation',
    ],
  },
  {
    icon: Landmark,
    title: 'Arts / Humanities',
    subtitle: 'Classes 11th – 12th',
    features: [
      'History',
      'Political Science',
      'Geography',
      'Economics',
      'English',
      'Board Examination Preparation',
    ],
  },
];

const subjectIcons = [
  { icon: Calculator, label: 'Mathematics' },
  { icon: FlaskConical, label: 'Science' },
  { icon: Globe2, label: 'Social Science' },
  { icon: Languages, label: 'English' },
  { icon: Building2, label: 'Commerce' },
  { icon: Palette, label: 'Humanities' },
];

export function CoursesPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-slate-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-500/30 px-4 py-1.5 text-sm font-medium text-blue-50 backdrop-blur-sm ring-1 ring-white/20">
              Our Courses
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">
              Courses for Every Stage of Learning
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed">
              From primary school foundations to senior secondary board preparation — across Science,
              Commerce and Humanities — we offer structured coaching for Classes 1st to 12th.
            </p>
          </div>
        </div>
      </section>

      {/* Subject icon strip */}
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {subjectIcons.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 transition-transform duration-300 hover:scale-110">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Primary / Middle / Secondary cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Classes 1st to 10th
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Building strong foundations through every stage of school education.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.title}
              className={`group relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                course.highlight
                  ? 'bg-slate-900 text-white shadow-xl ring-1 ring-slate-800'
                  : 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:shadow-xl hover:ring-blue-200'
              }`}
            >
              {course.highlight && (
                <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                  Board Years
                </span>
              )}
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300 ${
                course.highlight
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
              }`}>
                <course.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-2xl font-bold">{course.title}</h3>
              <p className={`mt-1 text-sm font-medium ${course.highlight ? 'text-blue-300' : 'text-blue-600'}`}>
                {course.subtitle}
              </p>
              <ul className="mt-6 space-y-3 flex-1">
                {course.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                      course.highlight ? 'bg-blue-600/30 text-blue-300' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className={`text-sm ${course.highlight ? 'text-slate-200' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="/contact"
                className={`mt-8 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                  course.highlight ? 'text-blue-300 hover:text-white' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Enquire Now
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Senior Secondary streams */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
              Classes 11th – 12th
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
              Senior Secondary Streams
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Specialised coaching across all three streams with focused board exam preparation.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {streams.map((stream) => (
              <div
                key={stream.title}
                className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-200"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <stream.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">{stream.title}</h3>
                <p className="mt-1 text-sm font-medium text-blue-600">{stream.subtitle}</p>
                <ul className="mt-6 space-y-3">
                  {stream.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  Enquire Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-slate-800 px-6 py-12 sm:px-12 sm:py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Not Sure Which Course to Choose?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Reach out to us and we'll help you find the perfect programme for your child's needs.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
}
