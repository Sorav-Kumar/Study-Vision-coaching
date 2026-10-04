/*
# Operational Tables — Attendance, Fees, Notes, Tests, Homework, Timetable, Notices, Enquiries, Gallery, Faculty, Settings

Creates all operational tables for the coaching management system.
RLS enabled on all tables with role-based access control.
*/

-- attendance
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'PRESENT' CHECK (status IN ('PRESENT','ABSENT','LATE')),
  marked_by uuid,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, date)
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- fees
CREATE TABLE IF NOT EXISTS public.fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  total_amount numeric NOT NULL DEFAULT 0,
  paid_amount numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  due_date date,
  fee_type text NOT NULL DEFAULT 'Monthly',
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- fee_payments
CREATE TABLE IF NOT EXISTS public.fee_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_id uuid NOT NULL REFERENCES public.fees(id) ON DELETE CASCADE,
  receipt_number text NOT NULL,
  amount numeric NOT NULL,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text NOT NULL DEFAULT 'Cash' CHECK (payment_method IN ('Cash','UPI','Bank Transfer','Other')),
  month text,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- notes
CREATE TABLE IF NOT EXISTS public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  access_level text NOT NULL DEFAULT 'PUBLIC' CHECK (access_level IN ('PUBLIC','CLASS','BATCH','SELECTED')),
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  uploaded_by uuid,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- tests
CREATE TABLE IF NOT EXISTS public.tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  test_date date NOT NULL,
  total_marks int NOT NULL DEFAULT 100,
  description text,
  syllabus text,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

-- test_results
CREATE TABLE IF NOT EXISTS public.test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  marks_obtained numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(test_id, student_id)
);
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- homework
CREATE TABLE IF NOT EXISTS public.homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  due_date date NOT NULL,
  file_path text,
  file_name text,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;

-- timetable
CREATE TABLE IF NOT EXISTS public.timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL,
  date date,
  start_time text NOT NULL,
  end_time text NOT NULL,
  subject text NOT NULL,
  teacher_id uuid,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  room text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.timetable ENABLE ROW LEVEL SECURITY;

-- notices
CREATE TABLE IF NOT EXISTS public.notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  target text NOT NULL DEFAULT 'ALL' CHECK (target IN ('ALL','CLASS','BATCH','SELECTED')),
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  parent_name text NOT NULL,
  mobile text NOT NULL,
  email text,
  class_name text,
  course_stream text,
  preferred_batch text,
  message text,
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New','Contacted','Interested','Admitted','Not Interested')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- gallery
CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- faculty
CREATE TABLE IF NOT EXISTS public.faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  bio text,
  photo_url text,
  display_order int DEFAULT 0
);
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

-- site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coaching_name text NOT NULL DEFAULT 'Study Vision Coaching Centre',
  tagline text NOT NULL DEFAULT 'Learn Better • Build Strong Concepts • Achieve More',
  about_content text,
  phone text NOT NULL DEFAULT '9354024459',
  address text,
  instagram text,
  google_maps text,
  footer_text text,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_attendance_student ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_batch ON public.attendance(batch_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_fees_student ON public.fees(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_fee ON public.fee_payments(fee_id);
CREATE INDEX IF NOT EXISTS idx_notes_class ON public.notes(class_id);
CREATE INDEX IF NOT EXISTS idx_notes_batch ON public.notes(batch_id);
CREATE INDEX IF NOT EXISTS idx_tests_class ON public.tests(class_id);
CREATE INDEX IF NOT EXISTS idx_tests_batch ON public.tests(batch_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test ON public.test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_test_results_student ON public.test_results(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_class ON public.homework(class_id);
CREATE INDEX IF NOT EXISTS idx_homework_batch ON public.homework(batch_id);
CREATE INDEX IF NOT EXISTS idx_timetable_batch ON public.timetable(batch_id);
CREATE INDEX IF NOT EXISTS idx_notices_target ON public.notices(target);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);
