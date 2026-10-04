/*
# Helper Functions for RLS

Creates SECURITY DEFINER helper functions used in RLS policies:
- current_student_id(): returns the student record id for the current user
- is_parent_of(student uuid): checks if current user is parent of given student
- is_teacher_of_student(student uuid): checks if current user teaches the student's batch
*/

CREATE OR REPLACE FUNCTION public.current_student_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.students WHERE profile_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_parent_of(student uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.parent_student_links psl
    JOIN public.parents p ON p.id = psl.parent_id
    WHERE p.profile_id = auth.uid() AND psl.student_id = student
  );
$$;

CREATE OR REPLACE FUNCTION public.is_teacher_of_student(student uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students s
    JOIN public.batches b ON b.id = s.batch_id
    JOIN public.teachers t ON t.id = b.teacher_id
    WHERE s.id = student AND t.profile_id = auth.uid()
  );
$$;
