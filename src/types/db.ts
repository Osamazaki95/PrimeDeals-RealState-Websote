export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'chalet' | 'office';
export type Listing = 'sale' | 'rent' | 'resale' | 'primary';

export interface Property {
  id: string;
  slug: string;
  title_en: string; title_ar: string;
  description_en: string | null; description_ar: string | null;
  location_en: string; location_ar: string;
  type: PropertyType;
  listing: Listing;
  price: number;
  per_month: boolean;
  bedrooms: number; bathrooms: number; area_sqft: number;
  lat: number | null; lng: number | null;
  amenities_en: string[]; amenities_ar: string[];
  images: string[];
  project_id: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  tour_360_url: string | null;
  reference_code: string | null;
  finishing_en: string | null; finishing_ar: string | null;
  delivery_en: string | null; delivery_ar: string | null;
  rooms: { name_en: string; name_ar: string; size: string; note_en: string; note_ar: string }[];
  nearby: { name_en: string; name_ar: string; time_en: string; time_ar: string }[];
  down_payment_pct: number;
  instalment_years: number;
}

export interface Project {
  id: string;
  slug: string;
  name_en: string; name_ar: string;
  location_en: string; location_ar: string;
  body_en: string | null; body_ar: string | null;
  unit_types_en: string | null; unit_types_ar: string | null;
  delivery_year: number | null;
  price_from: number | null;
  images: string[];
  published: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  slug: string;
  title_en: string; title_ar: string;
  excerpt_en: string | null; excerpt_ar: string | null;
  body_en: string | null; body_ar: string | null;
  cover: string | null;
  author_id: string | null;
  published_at: string | null;
  published: boolean;
}

export interface TeamMember {
  id: string;
  name_en: string; name_ar: string;
  role_en: string; role_ar: string;
  phone: string | null; email: string | null; photo: string | null;
  sort_order: number;
}

export interface Faq { id: string; question_en: string; question_ar: string; answer_en: string; answer_ar: string; sort_order: number; }
export interface Review {
  id: string;
  name_en: string; name_ar: string;
  role_en: string; role_ar: string;
  quote_en: string; quote_ar: string;
  rating: number;
  photo: string | null;
  featured: boolean;
  sort_order: number;
}

export interface Job {
  id: string;
  slug: string;
  title_en: string; title_ar: string;
  meta_en: string; meta_ar: string;
  body_en: string; body_ar: string;
  department_en: string | null; department_ar: string | null;
  location_en: string | null; location_ar: string | null;
  employment_type: string | null;
  experience_en: string | null; experience_ar: string | null;
  salary_en: string | null; salary_ar: string | null;
  responsibilities_en: string[]; responsibilities_ar: string[];
  requirements_en: string[]; requirements_ar: string[];
  benefits_en: string[]; benefits_ar: string[];
  posted_at: string | null;
  published: boolean;
}

export interface Application {
  id: string;
  job_id: string | null;
  job_slug: string | null;
  full_name: string; email: string; phone: string;
  location: string | null; linkedin: string | null;
  years_experience: number | null;
  current_position: string | null; notice_period: string | null; expected_salary: string | null;
  cv_url: string | null; cv_name: string | null;
  notes: string | null;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'rejected';
  created_at: string;
}
export interface Lead { id: string; name: string; email: string; phone: string | null; message: string | null; property_id: string | null; source: string; status: 'new' | 'contacted' | 'won' | 'lost'; created_at: string; }

/** Every editable block of every page lives here — this is what the dashboard writes. */
export interface PageSection {
  id: string;
  page: string;      // 'home' | 'about' | 'contact' | ...
  key: string;       // 'hero' | 'stats' | 'values' | ...
  content_en: Record<string, unknown>;
  content_ar: Record<string, unknown>;
  sort_order: number;
  updated_at: string;
}

export interface SeoMeta { id: string; page: string; title_en: string; title_ar: string; description_en: string; description_ar: string; og_image: string | null; }
export interface Profile { id: string; full_name: string | null; avatar_url: string | null; role: 'admin' | 'editor' | 'agent' | 'user'; }
