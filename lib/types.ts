export type UserRole = "student" | "tutor" | "admin";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_approved: boolean;
  is_profile_complete: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse extends AuthTokens {
  role: UserRole;
  is_approved: boolean;
  is_profile_complete: boolean;
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
