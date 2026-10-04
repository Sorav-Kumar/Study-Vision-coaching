import { Target, Lightbulb, ClipboardCheck, MessageCircle, GraduationCap, BookOpen, Users, Award } from 'lucide-react';

const pillars = [
  {
    icon: Target,
    title: 'Quality Education',
    description: 'We deliver high-quality teaching that builds a strong academic foundation and nurtures a genuine love for learning in every student.',
  },
  {
    icon: Lightbulb,
    title: 'Concept Clarity',
    description: 'Our teaching emphasises understanding over memorisation, helping students grasp the "why" behind every concept so knowledge lasts a lifetime.',
  },
  {
    icon: ClipboardCheck,
    title: 'Regular Practice',
    description: 'Structured practice sessions and carefully designed worksheets reinforce learning and keep students sharp and exam-ready throughout the year.',
  },
  {
    icon: MessageCircle,
    title: 'Doubt Solving',
    description: 'We maintain an open-door policy where every doubt is welcomed and resolved patiently, ensuring no student is ever left behind.',
  },
  {
    icon: GraduationCap,
    title: 'Exam Preparation',
    description: 'From school term exams to board examinations, our focused preparation strategy, mock tests and revision plans build confidence and results.',
  },
];

const approachSteps = [
  {
    icon: BookOpen,
    title: 'Understand the Student',
    description: 'We begin by assessing each student\'s current level, learning style and goals to create a personalised roadmap for growth.',
  },
  {
    icon: Users,
    title: 'Engage & Involve',
    description: 'Interactive classrooms, group discussions and real-world examples keep students engaged and make learning enjoyable and meaningful.',
  },
  {
    icon: ClipboardCheck,
    title: 'Practice & Assess',
    description: 'Regular tests, quizzes and assignments track progress and highlight areas that need extra attention before exams arrive.',
  },
  {
    icon: Award,
    title: 'Achieve & Excel',
    description: 'With consistent effort and the right guidance, students not only score well but also develop the confidence to excel in life.',
  },
];

export function AboutPage() {
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
              About Us
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">
              About Study Vision Coaching Centre
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-100 leading-relaxed">
              Where learning meets success. We are dedicated to nurturing young minds with
              quality education, concept clarity and the confidence to excel in every exam and in life.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Our Story
          </h2>
          <div className="mt-6 space-y-4 text-lg text-slate-600 leading-relaxed">
            <p>
              Study Vision Coaching Centre was founded with a simple yet powerful belief — every
              student deserves access to quality education that goes beyond rote learning. For years,
              we have been guiding students from Classes 1st to 12th across all major subjects and streams,
              helping them build strong academic foundations and lasting confidence.
            </p>
            <p>
              Our approach is rooted in <span className="font-semibold text-slate-800">concept clarity</span>,
              supported by <span className="font-semibold text-slate-800">regular practice</span>,
              patient <span className="font-semibold text-slate-800">doubt solving</span> and focused
              <span className="font-semibold text-slate-800"> exam preparation</span>. We believe that when a
              student truly understands a concept, results follow naturally.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              What We Stand For
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              The five pillars that shape every lesson, every test and every interaction at Study Vision.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-200"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <pillar.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">{pillar.title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
            Our Approach
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">
            How We Help Students Succeed
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A proven four-step methodology that turns confusion into clarity and effort into achievement.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {approachSteps.map((step, idx) => (
            <div key={step.title} className="relative">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-blue-300 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-bold text-slate-100">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
              {idx < approachSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 h-px w-8 bg-slate-200" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Begin Your Learning Journey?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Join Study Vision Coaching Centre and experience education that builds understanding, confidence and results.
          </p>
          <a
            href="/contact"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
