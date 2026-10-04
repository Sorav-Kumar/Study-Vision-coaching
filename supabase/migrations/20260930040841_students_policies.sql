/*
# Students RLS Policies
*/
DROP POLICY IF EXISTS "students_select_own_admin_teacher_parent" ON public.students;
CREATE POLICY "students_select_own_admin_teacher_parent" ON public.students FOR SELECT
  TO authenticated USING (
    public.user_role() = 'ADMIN'
    OR auth.uid() = profile_id
    OR public.is_parent_of(id)
    OR public.is_teacher_of_student(id)
  );
DROP POLICY IF EXISTS "students_admin_insert" ON public.students;
CREATE POLICY "students_admin_insert" ON public.students FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "students_admin_or_self_update" ON public.students;
CREATE POLICY "students_admin_or_self_update" ON public.students FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN' OR auth.uid() = profile_id) WITH CHECK (public.user_role() = 'ADMIN' OR auth.uid() = profile_id);
DROP POLICY IF EXISTS "students_admin_delete" ON public.students;
CREATE POLICY "students_admin_delete" ON public.students FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');
