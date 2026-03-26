export type UserRole = "student" | "tutor" | "admin";

export interface User {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  is_approved: boolean;
  is_email_verified: boolean;
  is_profile_complete: boolean;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  is_approved: boolean;
  is_profile_complete: boolean;
}

export interface LoginResponse extends AuthTokens {
  user: LoginUser;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  role: "student" | "tutor";
  subject_area?: string;
  qualifications?: string;
  statement?: string;
}

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  bio: string;
  phone: string;
  avatar_url: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileSetupPayload {
  first_name: string;
  last_name: string;
  bio?: string;
  phone?: string;
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: Category;
  tutor: TutorSummary;
  cover_image: string | null;
  price: string;
  is_free: boolean;
  status: string;
  average_rating: number;
  review_count: number;
  enrollment_count: number;
  module_count: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface TutorSummary {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Enrollment {
  id: number;
  course: Course;
  progress_percentage: number;
  last_accessed_module: number | null;
  enrolled_at: string;
  completed_at: string | null;
}

export interface Notification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Admin Types ──

export interface AdminDashboard {
  gmv_monthly: string;
  active_students: number;
  active_tutors: number;
  published_courses: number;
  pending_tutor_applications: number;
  pending_courses: number;
  pending_study_guides: number;
  total_users: number;
  total_transactions: number;
}

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_approved: boolean;
  is_email_verified: boolean;
  is_profile_complete: boolean;
  date_joined: string;
}

export interface TutorApplication {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  subject_area: string;
  qualifications: string;
  statement: string;
  cv_url: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string;
  reviewed_at: string | null;
  date_joined: string;
  created_at: string;
}

// ── Content Review Types ──

export interface PendingCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  tutor_email: string;
  tutor_name: string;
  category_name: string;
  is_free: boolean;
  price: string;
  module_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PendingStudyGuide {
  id: number;
  title: string;
  slug: string;
  description: string;
  tutor_email: string;
  tutor_name: string;
  category_name: string;
  is_free: boolean;
  price: string;
  page_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TutorCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: number;
  category_name: string;
  tutor: number;
  tutor_name: string;
  cover_image: string | null;
  is_free: boolean;
  price: string;
  status: string;
  module_count: number;
  average_rating: number | null;
  review_count: number;
  created_at: string;
  rejection_reason?: string;
}
