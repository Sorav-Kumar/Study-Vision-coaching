/*
# Parent-Student Links RLS Policies
*/
DROP POLICY IF EXISTS "psl_read_admin_or_self" ON public.parent_student_links;
CREATE POLICY "psl_read_admin_or_self" ON public.parent_student_links FOR SELECT
  TO authenticated USING (
    public.user_role() = 'ADMIN'
    OR EXISTS (SELECT 1 FROM public.parents p WHERE p.id = parent_id AND p.profile_id = auth.uid())
    OR public.is_parent_of(student_id)
  );
DROP POLICY IF EXISTS "psl_admin_insert" ON public.parent_student_links;
CREATE POLICY "psl_admin_insert" ON public.parent_student_links FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "psl_admin_delete" ON public.parent_student_links;
CREATE POLICY "psl_admin_delete" ON public.parent_student_links FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');
