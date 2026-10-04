export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string | null;
}

export interface Class {
  id: string;
  name: string;
  level: number;
}

export interface Course {
  id: string;
  name: string;
  description: string | null;
  class_range: string | null;
  stream: string | null;
  features: string[];
  display_order: number;
  is_active: boolean;
}

export interface Batch {
  id: string;
  name: string;
  class_id: string | null;
  course_id: string | null;
  teacher_id: string | null;
  academic_year: string | null;
  schedule: string | null;
  is_active: boolean;
  class?: Class;
  course?: Course;
  teacher?: Teacher;
}

export interface Teacher {
  id: string;
  profile_id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  bio: string | null;
  photo_url: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Student {
  id: string;
  profile_id: string | null;
  student_id: string | null;
  full_name: string;
  date_of_birth: string | null;
  gender: 'Male' | 'Female' | 'Other' | null;
  photo_url: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  alternate_phone: string | null;
  email: string | null;
  address: string | null;
  school_name: string | null;
  class_id: string | null;
  course_id: string | null;
  batch_id: string | null;
  admission_date: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'LEFT';
  class?: Class;
  course?: Course;
  batch?: Batch;
}

export interface Parent {
  id: string;
  profile_id: string | null;
  full_name: string;
  phone: string | null;
  email: string | null;
}

export interface ParentStudentLink {
  id: string;
  parent_id: string;
  student_id: string;
  relation: string | null;
  student?: Student;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string | null;
  batch_id: string | null;
  enrollment_date: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
}

export interface Attendance {
  id: string;
  student_id: string;
  batch_id: string | null;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  marked_by: string | null;
  student?: Student;
}

export interface Fee {
  id: string;
  student_id: string;
  total_amount: number;
  paid_amount: number;
  discount: number;
  due_date: string | null;
  fee_type: string;
  description: string | null;
  created_at: string;
}

export interface FeePayment {
  id: string;
  fee_id: string;
  receipt_number: string;
  amount: number;
  payment_date: string;
  payment_method: 'Cash' | 'UPI' | 'Bank Transfer' | 'Other';
  month: string | null;
  notes: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  class_id: string | null;
  batch_id: string | null;
  access_level: 'PUBLIC' | 'CLASS' | 'BATCH' | 'SELECTED';
  file_path: string;
  file_name: string;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
  class?: Class;
  batch?: Batch;
}

export interface Test {
  id: string;
  name: string;
  subject: string;
  class_id: string | null;
  batch_id: string | null;
  test_date: string;
  total_marks: number;
  description: string | null;
  syllabus: string | null;
  created_by: string | null;
  class?: Class;
  batch?: Batch;
}

export interface TestResult {
  id: string;
  test_id: string;
  student_id: string;
  marks_obtained: number;
  student?: Student;
  test?: Test;
}

export interface Homework {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  class_id: string | null;
  batch_id: string | null;
  due_date: string;
  file_path: string | null;
  file_name: string | null;
  created_by: string | null;
  created_at: string;
  class?: Class;
  batch?: Batch;
}

export interface Timetable {
  id: string;
  day: string;
  date: string | null;
  start_time: string;
  end_time: string;
  subject: string;
  teacher_id: string | null;
  class_id: string | null;
  batch_id: string | null;
  room: string | null;
  class?: Class;
  batch?: Batch;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  target: 'ALL' | 'CLASS' | 'BATCH' | 'SELECTED';
  class_id: string | null;
  batch_id: string | null;
  created_by: string | null;
  created_at: string;
  class?: Class;
  batch?: Batch;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface Enquiry {
  id: string;
  student_name: string;
  parent_name: string;
  mobile: string;
  email: string | null;
  class_name: string | null;
  course_stream: string | null;
  preferred_batch: string | null;
  message: string | null;
  status: 'New' | 'Contacted' | 'Interested' | 'Admitted' | 'Not Interested';
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string | null;
  created_at: string;
}

export interface Faculty {
  id: string;
  name: string;
  subject: string;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
}

export interface SiteSettings {
  id: string;
  coaching_name: string;
  tagline: string;
  about_content: string;
  phone: string;
  address: string;
  instagram: string;
  google_maps: string;
  footer_text: string;
}
