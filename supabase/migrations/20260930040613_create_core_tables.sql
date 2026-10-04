/*
# Core Schema Part 1 — Profiles, Auth, Classes, Courses, Batches

Creates foundational tables for the coaching management system:
- profiles: extends Supabase auth.users with role (ADMIN/TEACHER/STUDENT/PARENT)
- classes: class levels (1st to 12th)
- courses: course programs
- batches: student groups within a class, assigned to a teacher

Security:
- RLS enabled on all tables.
- Helper function user_role() returns the current user's role.
*/

-- profiles: extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'STUDENT' CHECK (role IN ('ADMIN','TEACHER','STUDENT','PARENT')),
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper: return the current user's role from profiles
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Now policies that use user_role()
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR public.user_role() = 'ADMIN');

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- subjects
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "subjects_read_all" ON public.subjects;
CREATE POLICY "subjects_read_all" ON public.subjects FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "subjects_admin_write" ON public.subjects;
CREATE POLICY "subjects_admin_write" ON public.subjects FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "subjects_admin_update" ON public.subjects;
CREATE POLICY "subjects_admin_update" ON public.subjects FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN') WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "subjects_admin_delete" ON public.subjects;
CREATE POLICY "subjects_admin_delete" ON public.subjects FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

-- classes (class levels 1-12)
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  level int NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "classes_read_all" ON public.classes;
CREATE POLICY "classes_read_all" ON public.classes FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "classes_admin_write" ON public.classes;
CREATE POLICY "classes_admin_write" ON public.classes FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "classes_admin_update" ON public.classes;
CREATE POLICY "classes_admin_update" ON public.classes FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN') WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "classes_admin_delete" ON public.classes;
CREATE POLICY "classes_admin_delete" ON public.classes FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

-- courses
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  class_range text,
  stream text,
  features text[] DEFAULT '{}',
  display_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "courses_read_all" ON public.courses;
CREATE POLICY "courses_read_all" ON public.courses FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "courses_admin_insert" ON public.courses;
CREATE POLICY "courses_admin_insert" ON public.courses FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "courses_admin_update" ON public.courses;
CREATE POLICY "courses_admin_update" ON public.courses FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN') WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "courses_admin_delete" ON public.courses;
CREATE POLICY "courses_admin_delete" ON public.courses FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

-- batches
CREATE TABLE IF NOT EXISTS public.batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  teacher_id uuid,
  academic_year text,
  schedule text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "batches_read_authed" ON public.batches;
CREATE POLICY "batches_read_authed" ON public.batches FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "batches_admin_insert" ON public.batches;
CREATE POLICY "batches_admin_insert" ON public.batches FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "batches_admin_update" ON public.batches;
CREATE POLICY "batches_admin_update" ON public.batches FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN') WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "batches_admin_delete" ON public.batches;
CREATE POLICY "batches_admin_delete" ON public.batches FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

CREATE INDEX IF NOT EXISTS idx_batches_class ON public.batches(class_id);
CREATE INDEX IF NOT EXISTS idx_batches_teacher ON public.batches(teacher_id);
