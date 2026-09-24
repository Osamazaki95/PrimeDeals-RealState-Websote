'use client';

import { ResourceManager, type Field } from '@/components/dashboard/ResourceManager';

const fields: Field[] = [
  { name: 'slug', label: 'SLUG (URL)', type: 'text', required: true, half: true },
  { name: 'published', label: 'PUBLISHED', type: 'boolean', half: true },
  { name: 'title_en', label: 'TITLE (EN)', type: 'text', required: true, half: true },
  { name: 'title_ar', label: 'العنوان (AR)', type: 'text', required: true, half: true },
  { name: 'excerpt_en', label: 'EXCERPT (EN)', type: 'textarea' },
  { name: 'excerpt_ar', label: 'المقدمة (AR)', type: 'textarea' },
  { name: 'body_en', label: 'BODY (EN)', type: 'textarea', help: 'One paragraph per line.' },
  { name: 'body_ar', label: 'النص (AR)', type: 'textarea', help: 'فقرة في كل سطر' },
  { name: 'cover', label: 'COVER IMAGE URL', type: 'text' },
];

export default function DashboardPosts() {
  return (
    <ResourceManager
      resource="posts"
      idKey="slug"
      title="Blog posts"
      description="Articles shown on /blog."
      fields={fields}
      columns={[
        { name: 'title_en', label: 'Title' },
        { name: 'published_at', label: 'Date' },
        { name: 'published', label: 'Live' },
      ]}
      newRow={{ published: true }}
    />
  );
}
