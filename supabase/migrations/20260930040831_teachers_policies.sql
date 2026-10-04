/*
# Teachers RLS Policies
*/
DROP POLICY IF EXISTS "teachers_read_authed" ON public.teachers;
CREATE POLICY "teachers_read_authed" ON public.teachers FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "teachers_admin_insert" ON public.teachers;
CREATE POLICY "teachers_admin_insert" ON public.teachers FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "teachers_admin_or_self_update" ON public.teachers;
CREATE POLICY "teachers_admin_or_self_update" ON public.teachers FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN' OR auth.uid() = profile_id) WITH CHECK (public.user_role() = 'ADMIN' OR auth.uid() = profile_id);
DROP POLICY IF EXISTS "teachers_admin_delete" ON public.teachers;
CREATE POLICY "teachers_admin_delete" ON public.teachers FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');
