/*
# People Tables — Tables only (no policies/functions)

Creates teacher, student, parent, link, and enrollment tables.
*/

CREATE TABLE IF NOT EXISTS public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  email text,
  subject text,
  bio text,
  photo_url text,
  status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id text UNIQUE,
  full_name text NOT NULL,
  date_of_birth date,
  gender text CHECK (gender IN ('Male','Female','Other')),
  photo_url text,
  parent_name text,
  parent_phone text,
  alternate_phone text,
  email text,
  address text,
  school_name text,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  admission_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE','GRADUATED','LEFT')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.parents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  email text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.parents(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  relation text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, student_id)
);
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE SET NULL,
  enrollment_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','COMPLETED','DROPPED')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_students_profile ON public.students(profile_id);
CREATE INDEX IF NOT EXISTS idx_students_batch ON public.students(batch_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_teachers_profile ON public.teachers(profile_id);
CREATE INDEX IF NOT EXISTS idx_parents_profile ON public.parents(profile_id);
CREATE INDEX IF NOT EXISTS idx_psl_parent ON public.parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_psl_student ON public.parent_student_links(student_id);
