import { Link } from 'react-router-dom';
import {
  Phone, GraduationCap, ArrowRight, CheckCircle, Users, BookOpen,
  ClipboardCheck, MessageCircle, Target, ShieldCheck,
  Award, TrendingUp, Calendar, BarChart3, FileText, Bell,
} from 'lucide-react';

export function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-slate-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-amber-500/90 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
              Admissions Open | Limited Seats Available
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Quality Education for<br />Classes 1st to 12th
            </h1>
            <p className="mt-4 text-xl font-medium text-blue-200">
              Learn Better • Build Strong Concepts • Achieve More
            </p>
            <p className="mt-6 text-lg text-blue-100 leading-relaxed max-w-2xl">
              Study Vision Coaching Centre provides focused and student-friendly education for
              students from Class 1st to 12th. Our aim is to build strong concepts, improve
              academic performance and help every student achieve their educational goals.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                Enquire Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="tel:9354024459"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500/30 px-6 py-3 text-base font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-blue-500/50"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
            About Us
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
            About Study Vision Coaching Centre
          </h2>
          <div className="mt-6 space-y-4 text-lg text-slate-600 leading-relaxed">
            <p>
              Study Vision Coaching Centre is dedicated to providing quality education in a
              supportive and disciplined learning environment.
            </p>
            <p>
              We focus on concept clarity, regular practice, doubt solving and exam preparation
              so that students don't just memorize topics but actually understand them. Our
              approach is designed according to the learning needs of students from Class 1st to 12th.
            </p>
          </div>
          <Link
            to="/about"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Learn more about us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Courses */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Classes & Courses</h2>
            <p className="mt-4 text-lg text-slate-600">
              Structured coaching programs for every stage of school education.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Classes 1st – 5th', features: ['All Major Subjects', 'Basic Concept Building', 'Regular Practice', 'Homework & Revision'] },
              { title: 'Classes 6th – 8th', features: ['All Major Subjects', 'Concept-Based Learning', 'Regular Tests', 'Doubt Clearing'] },
              { title: 'Classes 9th – 10th', features: ['Mathematics', 'Science', 'Social Science', 'Board Exam Prep'] },
              { title: 'Classes 11th – 12th', features: ['Science Stream', 'Commerce Stream', 'Arts/Humanities', 'Board Exam Prep'] },
            ].map((course) => (
              <div key={course.title} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{course.title}</h3>
                <ul className="mt-4 space-y-2">
                  {course.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
              View all courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Why Choose Study Vision</h2>
          <p className="mt-4 text-lg text-slate-600">
            Six reasons why parents and students trust us with their education.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Users, title: 'Personal Attention', desc: 'We focus on the individual learning needs of students.' },
            { icon: Target, title: 'Strong Concept Building', desc: 'Students are encouraged to understand concepts instead of simply memorizing them.' },
            { icon: ClipboardCheck, title: 'Regular Tests', desc: 'Regular assessments help students track their preparation and improve.' },
            { icon: MessageCircle, title: 'Doubt Clearing', desc: 'Students get proper support to clear their doubts.' },
            { icon: Award, title: 'Exam-Oriented Preparation', desc: 'Special focus on school examinations and board examinations.' },
            { icon: ShieldCheck, title: 'Disciplined Learning Environment', desc: 'A positive and focused environment for effective learning.' },
          ].map((feature) => (
            <div key={feature.title} className="group rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Faculty */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Our Faculty</h2>
            <p className="mt-4 text-lg text-slate-600">Dedicated educators committed to student success.</p>
          </div>
          <div className="mt-12 max-w-md mx-auto">
            <div className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:shadow-xl hover:ring-blue-200">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-slate-800 text-white shadow-lg">
                <GraduationCap className="h-12 w-12" />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900">Shashank Sir</h3>
              <p className="mt-1 text-sm font-semibold text-blue-600">Mathematics Faculty</p>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                Focused on concept clarity, problem-solving and exam-oriented preparation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Our Students, Our Pride</h2>
          <p className="mt-4 text-lg text-slate-600">
            We believe that every student's improvement is an achievement.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Award, title: 'Academic Excellence', desc: 'Consistent academic performance across all classes.' },
            { icon: TrendingUp, title: 'Subject-wise Achievements', desc: 'Outstanding results in individual subjects.' },
            { icon: GraduationCap, title: 'Board Examination Results', desc: 'Strong board exam performance year after year.' },
            { icon: BarChart3, title: 'Performance Improvement', desc: 'Measurable progress for every student.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 text-center transition-all hover:shadow-lg hover:border-blue-200">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-slate-800 p-8 text-center">
          <p className="text-xl sm:text-2xl font-medium text-white italic">
            "Success is the result of consistent learning, practice and guidance."
          </p>
        </div>
      </section>

      {/* Regular Assessment */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Regular Assessment</h2>
            <p className="mt-4 text-lg text-slate-600">
              Continuous evaluation to track and improve student performance.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: Calendar, label: 'Weekly/Regular Tests' },
              { icon: FileText, label: 'Chapter-wise Tests' },
              { icon: ClipboardCheck, label: 'Revision Tests' },
              { icon: MessageCircle, label: 'Doubt Sessions' },
              { icon: Award, label: 'Exam Practice' },
              { icon: BarChart3, label: 'Performance Analysis' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center transition-all hover:shadow-lg hover:border-blue-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Admissions are open with limited seats. Enquire today to secure your place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors">
              Enquire Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="tel:9354024459" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-8 py-3 text-base font-semibold text-white hover:bg-slate-800 transition-colors">
              <Phone className="h-5 w-5" />
              9354024459
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
