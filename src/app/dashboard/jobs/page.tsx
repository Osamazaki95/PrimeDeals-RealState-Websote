'use client';

import { ResourceManager, type Field } from '@/components/dashboard/ResourceManager';

/* Every field here maps 1:1 to a column the job page renders. */
const fields: Field[] = [
  { name: 'slug', label: 'SLUG (URL)', type: 'text', required: true, half: true, help: 'e.g. property-advisor-new-cairo' },
  { name: 'published', label: 'PUBLISHED', type: 'boolean', half: true },
  { name: 'title_en', label: 'TITLE (EN)', type: 'text', required: true, half: true },
  { name: 'title_ar', label: 'الوظيفة (AR)', type: 'text', required: true, half: true },
  { name: 'meta_en', label: 'SHORT META (EN)', type: 'text', half: true, help: 'e.g. Full time · New Cairo' },
  { name: 'meta_ar', label: 'السطر المختصر (AR)', type: 'text', half: true },
  { name: 'department_en', label: 'DEPARTMENT (EN)', type: 'text', half: true },
  { name: 'department_ar', label: 'القسم (AR)', type: 'text', half: true },
  { name: 'location_en', label: 'LOCATION (EN)', type: 'text', half: true },
  { name: 'location_ar', label: 'المكان (AR)', type: 'text', half: true },
  { name: 'employment_type', label: 'CONTRACT', type: 'select', options: [
    { value: 'full_time', label: 'Full time' }, { value: 'part_time', label: 'Part time' },
    { value: 'contract', label: 'Contract' }, { value: 'internship', label: 'Internship' },
  ] },
  { name: 'experience_en', label: 'EXPERIENCE (EN)', type: 'text', half: true },
  { name: 'experience_ar', label: 'الخبرة (AR)', type: 'text', half: true },
  { name: 'salary_en', label: 'PACKAGE (EN)', type: 'text', half: true },
  { name: 'salary_ar', label: 'الراتب (AR)', type: 'text', half: true },
  { name: 'body_en', label: 'ABOUT THE ROLE (EN)', type: 'textarea' },
  { name: 'body_ar', label: 'عن الوظيفة (AR)', type: 'textarea' },
  { name: 'responsibilities_en', label: 'RESPONSIBILITIES (EN)', type: 'tags', help: 'Comma separated — one per bullet' },
  { name: 'responsibilities_ar', label: 'المسؤوليات (AR)', type: 'tags' },
  { name: 'requirements_en', label: 'REQUIREMENTS (EN)', type: 'tags' },
  { name: 'requirements_ar', label: 'المتطلبات (AR)', type: 'tags' },
  { name: 'benefits_en', label: 'WHAT WE OFFER (EN)', type: 'tags' },
  { name: 'benefits_ar', label: 'المزايا (AR)', type: 'tags' },
];

export default function DashboardJobs() {
  return (
    <ResourceManager
      resource="jobs"
      idKey="slug"
      title="Jobs"
      description="Open roles on /careers. Each row becomes its own page with an application form."
      fields={fields}
      columns={[
        { name: 'title_en', label: 'Role' },
        { name: 'department_en', label: 'Department' },
        { name: 'location_en', label: 'Location' },
        { name: 'published', label: 'Live' },
      ]}
      newRow={{ published: true, employment_type: 'full_time' }}
    />
  );
}
