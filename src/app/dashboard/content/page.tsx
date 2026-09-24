'use client';

import { PageContentEditor } from '@/components/dashboard/PageContentEditor';

const PAGES = [
  { slug: 'home', label: 'Home' },
  { slug: 'about', label: 'About' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'properties', label: 'Properties' },
  { slug: 'projects', label: 'Projects' },
  { slug: 'blog', label: 'Blog' },
  { slug: 'careers', label: 'Careers' },
  { slug: 'privacy', label: 'Privacy' },
  { slug: 'terms', label: 'Terms' },
];

export default function DashboardContent() {
  return <PageContentEditor pages={PAGES} />;
}
