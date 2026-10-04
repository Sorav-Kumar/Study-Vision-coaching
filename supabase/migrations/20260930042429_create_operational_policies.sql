/*
# RLS Policies for Operational Tables

Policies for: attendance, fees, fee_payments, notes, tests, test_results,
homework, timetable, notices, notifications, enquiries, gallery, faculty, site_settings.

Access rules:
- ADMIN: full CRUD on all tables
- TEACHER: read + write for their assigned batches
- STUDENT: read only their own data
- PARENT: read only their linked child's data
- Enquiries: public insert (anon), admin read/update
- Notes: public notes readable by all; private notes by access level
- Gallery, Faculty, Site Settings: public read, admin write
*/

-- attendance: admin full; teacher of student can read/write; student/parent read own
DROP POLICY IF EXISTS "attendance_read" ON public.attendance;
CREATE POLICY "attendance_read" ON public.attendance FOR SELECT
  TO authenticated USING (
    public.user_role() = 'ADMIN'
    OR auth.uid() = (SELECT profile_id FROM public.students WHERE id = attendance.student_id)
    OR public.is_parent_of(attendance.student_id)
    OR public.is_teacher_of_student(attendance.student_id)
  );
DROP POLICY IF EXISTS "attendance_admin_teacher_insert" ON public.attendance;
CREATE POLICY "attendance_admin_teacher_insert" ON public.attendance FOR INSERT
  TO authenticated WITH CHECK (
    public.user_role() = 'ADMIN'
    OR public.is_teacher_of_student(attendance.student_id)
  );
DROP POLICY IF EXISTS "attendance_admin_teacher_update" ON public.attendance;
CREATE POLICY "attendance_admin_teacher_update" ON public.attendance FOR UPDATE
  TO authenticated USING (
    public.user_role() = 'ADMIN'
    OR public.is_teacher_of_student(attendance.student_id)
  ) WITH CHECK (
    public.user_role() = 'ADMIN'
    OR public.is_teacher_of_student(attendance.student_id)
  );
DROP POLICY IF EXISTS "attendance_admin_delete" ON public.attendance;
CREATE POLICY "attendance_admin_delete" ON public.attendance FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

-- fees: admin full; student/parent read own
DROP POLICY IF EXISTS "fees_read" ON public.fees;
CREATE POLICY "fees_read" ON public.fees FOR SELECT
  TO authenticated USING (
    public.user_role() = 'ADMIN'
    OR auth.uid() = (SELECT profile_id FROM public.students WHERE id = fees.student_id)
    OR public.is_parent_of(fees.student_id)
  );
DROP POLICY IF EXISTS "fees_admin_insert" ON public.fees;
CREATE POLICY "fees_admin_insert" ON public.fees FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "fees_admin_update" ON public.fees;
CREATE POLICY "fees_admin_update" ON public.fees FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN') WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "fees_admin_delete" ON public.fees;
CREATE POLICY "fees_admin_delete" ON public.fees FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

-- fee_payments: admin full; student/parent read own (through fee)
DROP POLICY IF EXISTS "fee_payments_read" ON public.fee_payments;
CREATE POLICY "fee_payments_read" ON public.fee_payments FOR SELECT
  TO authenticated USING (
    public.user_role() = 'ADMIN'
    OR EXISTS (
      SELECT 1 FROM public.fees f
      JOIN public.students s ON s.id = f.student_id
      WHERE f.id = fee_payments.fee_id
      AND (auth.uid() = s.profile_id OR public.is_parent_of(s.id))
    )
  );
DROP POLICY IF EXISTS "fee_payments_admin_insert" ON public.fee_payments;
CREATE POLICY "fee_payments_admin_insert" ON public.fee_payments FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "fee_payments_admin_delete" ON public.fee_payments;
CREATE POLICY "fee_payments_admin_delete" ON public.fee_payments FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

-- notes: public notes readable by all; private notes by access level
DROP POLICY IF EXISTS "notes_read" ON public.notes;
CREATE POLICY "notes_read" ON public.notes FOR SELECT
  TO anon, authenticated USING (
    access_level = 'PUBLIC'
    OR (public.user_role() = 'ADMIN')
    OR (public.user_role() = 'TEACHER' AND (
      access_level IN ('CLASS','BATCH','SELECTED')
      AND (notes.class_id IS NULL OR notes.class_id IN (
        SELECT s.class_id FROM public.students s
        JOIN public.batches b ON b.id = s.batch_id
        JOIN public.teachers t ON t.id = b.teacher_id
        WHERE t.profile_id = auth.uid()
      ))
    ))
    OR (public.user_role() = 'STUDENT' AND (
      access_level = 'CLASS' AND notes.class_id = (SELECT class_id FROM public.students WHERE profile_id = auth.uid())
      OR access_level = 'BATCH' AND notes.batch_id = (SELECT batch_id FROM public.students WHERE profile_id = auth.uid())
      OR access_level = 'PUBLIC'
    ))
    OR (public.user_role() = 'PARENT' AND (
      access_level = 'CLASS' AND notes.class_id IN (
        SELECT s.class_id FROM public.parent_student_links psl
        JOIN public.students s ON s.id = psl.student_id
        JOIN public.parents p ON p.id = psl.parent_id
        WHERE p.profile_id = auth.uid()
      )
      OR access_level = 'PUBLIC'
    ))
  );
DROP POLICY IF EXISTS "notes_admin_teacher_insert" ON public.notes;
CREATE POLICY "notes_admin_teacher_insert" ON public.notes FOR INSERT
  TO authenticated WITH CHECK (public.user_role() IN ('ADMIN','TEACHER'));
DROP POLICY IF EXISTS "notes_admin_teacher_update" ON public.notes;
CREATE POLICY "notes_admin_teacher_update" ON public.notes FOR UPDATE
  TO authenticated USING (public.user_role() IN ('ADMIN','TEACHER')) WITH CHECK (public.user_role() IN ('ADMIN','TEACHER'));
DROP POLICY IF EXISTS "notes_admin_teacher_delete" ON public.notes;
CREATE POLICY "notes_admin_teacher_delete" ON public.notes FOR DELETE
  TO authenticated USING (public.user_role() IN ('ADMIN','TEACHER'));

-- tests: admin/teacher can manage; student/parent read own
DROP POLICY IF EXISTS "tests_read" ON public.tests;
CREATE POLICY "tests_read" ON public.tests FOR SELECT
  TO authenticated USING (
    public.user_role() = 'ADMIN'
    OR (public.user_role() = 'TEACHER' AND tests.batch_id IN (
      SELECT b.id FROM public.batches b JOIN public.teachers t ON t.id = b.teacher_id WHERE t.profile_id = auth.uid()
    ))
    OR (public.user_role() = 'STUDENT' AND tests.batch_id = (SELECT batch_id FROM public.students WHERE profile_id = auth.uid()))
    OR (public.user_role() = 'PARENT' AND tests.batch_id IN (
      SELECT s.batch_id FROM public.parent_student_links psl
      JOIN public.students s ON s.id = psl.student_id
      JOIN public.parents p ON p.id = psl.parent_id
      WHERE p.profile_id = auth.uid()
    ))
  );
DROP POLICY IF EXISTS "tests_admin_teacher_insert" ON public.tests;
CREATE POLICY "tests_admin_teacher_insert" ON public.tests FOR INSERT
  TO authenticated WITH CHECK (public.user_role() IN ('ADMIN','TEACHER'));
DROP POLICY IF EXISTS "tests_admin_teacher_update" ON public.tests;
CREATE POLICY "tests_admin_teacher_update" ON public.tests FOR UPDATE
  TO authenticated USING (public.user_role() IN ('ADMIN','TEACHER')) WITH CHECK (public.user_role() IN ('ADMIN','TEACHER'));
DROP POLICY IF EXISTS "tests_admin_teacher_delete" ON public.tests;
CREATE POLICY "tests_admin_teacher_delete" ON public.tests FOR DELETE
  TO authenticated USING (public.user_role() IN ('ADMIN','TEACHER'));

-- test_results: admin/teacher manage; student/parent read own
DROP POLICY IF EXISTS "test_results_read" ON public.test_results;
CREATE POLICY "test_results_read" ON public.test_results FOR SELECT
  TO authenticated USING (
    public.user_role() = 'ADMIN'
    OR (public.user_role() = 'TEACHER' AND public.is_teacher_of_student(test_results.student_id))
    OR (public.user_role() = 'STUDENT' AND auth.uid() = (SELECT profile_id FROM public.students WHERE id = test_results.student_id))
    OR (public.user_role() = 'PARENT' AND public.is_parent_of(test_results.student_id))
  );
DROP POLICY IF EXISTS "test_results_admin_teacher_insert" ON public.test_results;
CREATE POLICY "test_results_admin_teacher_insert" ON public.test_results FOR INSERT
  TO authenticated WITH CHECK (public.user_role() IN ('ADMIN','TEACHER'));
DROP POLICY IF EXISTS "test_results_admin_teacher_update" ON public.test_results;
CREATE POLICY "test_results_admin_teacher_update" ON public.test_results FOR UPDATE
  TO authenticated USING (public.user_role() IN ('ADMIN','TEACHER')) WITH CHECK (public.user_role() IN ('ADMIN','TEACHER'));
DROP POLICY IF EXISTS "test_results_admin_teacher_delete" ON public.test_results;
CREATE POLICY "test_results_admin_teacher_delete" ON public.test_results FOR DELETE
  TO authenticated USING (public.user_role() IN ('ADMIN','TEACHER'));

-- homework: admin/teacher manage; student/parent read own
DROP POLICY IF EXISTS "homework_read" ON public.homework;
CREATE POLICY "homework_read" ON public.homework FOR SELECT
  TO authenticated USING (
    public.user_role() = 'ADMIN'
    OR (public.user_role() = 'TEACHER')
    OR (public.user_role() = 'STUDENT' AND (
      homework.batch_id = (SELECT batch_id FROM public.students WHERE profile_id = auth.uid())
      OR homework.class_id = (SELECT class_id FROM public.students WHERE profile_id = auth.uid())
    ))
    OR (public.user_role() = 'PARENT' AND (
      homework.batch_id IN (SELECT s.batch_id FROM public.parent_student_links psl JOIN public.students s ON s.id = psl.student_id JOIN public.parents p ON p.id = psl.parent_id WHERE p.profile_id = auth.uid())
    ))
  );
DROP POLICY IF EXISTS "homework_admin_teacher_insert" ON public.homework;
CREATE POLICY "homework_admin_teacher_insert" ON public.homework FOR INSERT
  TO authenticated WITH CHECK (public.user_role() IN ('ADMIN','TEACHER'));
DROP POLICY IF EXISTS "homework_admin_teacher_update" ON public.homework;
CREATE POLICY "homework_admin_teacher_update" ON public.homework FOR UPDATE
  TO authenticated USING (public.user_role() IN ('ADMIN','TEACHER')) WITH CHECK (public.user_role() IN ('ADMIN','TEACHER'));
DROP POLICY IF EXISTS "homework_admin_teacher_delete" ON public.homework;
CREATE POLICY "homework_admin_teacher_delete" ON public.homework FOR DELETE
  TO authenticated USING (public.user_role() IN ('ADMIN','TEACHER'));

-- timetable: admin/teacher manage; all authenticated read
DROP POLICY IF EXISTS "timetable_read" ON public.timetable;
CREATE POLICY "timetable_read" ON public.timetable FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "timetable_admin_insert" ON public.timetable;
CREATE POLICY "timetable_admin_insert" ON public.timetable FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "timetable_admin_update" ON public.timetable;
CREATE POLICY "timetable_admin_update" ON public.timetable FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN') WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "timetable_admin_delete" ON public.timetable;
CREATE POLICY "timetable_admin_delete" ON public.timetable FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

-- notices: admin/teacher manage; all authenticated read
DROP POLICY IF EXISTS "notices_read" ON public.notices;
CREATE POLICY "notices_read" ON public.notices FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "notices_admin_teacher_insert" ON public.notices;
CREATE POLICY "notices_admin_teacher_insert" ON public.notices FOR INSERT
  TO authenticated WITH CHECK (public.user_role() IN ('ADMIN','TEACHER'));
DROP POLICY IF EXISTS "notices_admin_teacher_update" ON public.notices;
CREATE POLICY "notices_admin_teacher_update" ON public.notices FOR UPDATE
  TO authenticated USING (public.user_role() IN ('ADMIN','TEACHER')) WITH CHECK (public.user_role() IN ('ADMIN','TEACHER'));
DROP POLICY IF EXISTS "notices_admin_teacher_delete" ON public.notices;
CREATE POLICY "notices_admin_teacher_delete" ON public.notices FOR DELETE
  TO authenticated USING (public.user_role() IN ('ADMIN','TEACHER'));

-- notifications: user reads/updates own
DROP POLICY IF EXISTS "notifications_read_own" ON public.notifications;
CREATE POLICY "notifications_read_own" ON public.notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notifications_insert_own" ON public.notifications;
CREATE POLICY "notifications_insert_own" ON public.notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- enquiries: public insert, admin read/update/delete
DROP POLICY IF EXISTS "enquiries_public_insert" ON public.enquiries;
CREATE POLICY "enquiries_public_insert" ON public.enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "enquiries_admin_read" ON public.enquiries;
CREATE POLICY "enquiries_admin_read" ON public.enquiries FOR SELECT
  TO authenticated USING (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "enquiries_admin_update" ON public.enquiries;
CREATE POLICY "enquiries_admin_update" ON public.enquiries FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN') WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "enquiries_admin_delete" ON public.enquiries;
CREATE POLICY "enquiries_admin_delete" ON public.enquiries FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

-- gallery: public read, admin write
DROP POLICY IF EXISTS "gallery_public_read" ON public.gallery;
CREATE POLICY "gallery_public_read" ON public.gallery FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "gallery_admin_insert" ON public.gallery;
CREATE POLICY "gallery_admin_insert" ON public.gallery FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "gallery_admin_update" ON public.gallery;
CREATE POLICY "gallery_admin_update" ON public.gallery FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN') WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "gallery_admin_delete" ON public.gallery;
CREATE POLICY "gallery_admin_delete" ON public.gallery FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

-- faculty: public read, admin write
DROP POLICY IF EXISTS "faculty_public_read" ON public.faculty;
CREATE POLICY "faculty_public_read" ON public.faculty FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "faculty_admin_insert" ON public.faculty;
CREATE POLICY "faculty_admin_insert" ON public.faculty FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "faculty_admin_update" ON public.faculty;
CREATE POLICY "faculty_admin_update" ON public.faculty FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN') WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "faculty_admin_delete" ON public.faculty;
CREATE POLICY "faculty_admin_delete" ON public.faculty FOR DELETE
  TO authenticated USING (public.user_role() = 'ADMIN');

-- site_settings: public read, admin write
DROP POLICY IF EXISTS "settings_public_read" ON public.site_settings;
CREATE POLICY "settings_public_read" ON public.site_settings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "settings_admin_update" ON public.site_settings;
CREATE POLICY "settings_admin_update" ON public.site_settings FOR UPDATE
  TO authenticated USING (public.user_role() = 'ADMIN') WITH CHECK (public.user_role() = 'ADMIN');
DROP POLICY IF EXISTS "settings_admin_insert" ON public.site_settings;
CREATE POLICY "settings_admin_insert" ON public.site_settings FOR INSERT
  TO authenticated WITH CHECK (public.user_role() = 'ADMIN');
