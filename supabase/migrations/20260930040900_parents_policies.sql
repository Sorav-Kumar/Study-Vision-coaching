/*
# Parents RLS Policies
*/
DROP POLICY IF EXISTS "parents_read_admin_or_self" ON public.parents;
CREATE POLICY "parents_read_admin_or_self" ON public.parents FOR SELECT
  TO authenticated USING (public.user_role() = 'ADMIN' OR auth.uid() = profile_id);
DROP POLICY IF EXISTS "parents_admin_insert" ON public.parents;
CREATE POLICY "parents_admin_insert" ON public.parents FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "parents_admin_or_self_update" ON public.parents;
CREATE POLICY "parents_admin_or_self_update" ON public.parents FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN' OR auth.uid() = profile_id) WITH CHECK (public.user_role() = 'ADMIN' OR auth.uid() = profile_id);
DROP POLICY IF EXISTS "parents_admin_delete" ON public.parents;
CREATE POLICY "parents_admin_delete" ON public.parents FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');
