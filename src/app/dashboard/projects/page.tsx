'use client';

import { ResourceManager, type Field } from '@/components/dashboard/ResourceManager';

const fields: Field[] = [
  { name: 'slug', label: 'SLUG (URL)', type: 'text', required: true, half: true },
  { name: 'delivery_year', label: 'DELIVERY YEAR', type: 'number', half: true },
  { name: 'name_en', label: 'NAME (EN)', type: 'text', required: true, half: true },
  { name: 'name_ar', label: 'الاسم (AR)', type: 'text', required: true, half: true },
  { name: 'location_en', label: 'LOCATION (EN)', type: 'text', required: true, half: true },
  { name: 'location_ar', label: 'الموقع (AR)', type: 'text', required: true, half: true },
  { name: 'unit_types_en', label: 'UNIT TYPES (EN)', type: 'text', half: true },
  { name: 'unit_types_ar', label: 'أنواع الوحدات (AR)', type: 'text', half: true },
  { name: 'price_from', label: 'PRICE FROM (EGP)', type: 'number', half: true },
  { name: 'published', label: 'PUBLISHED', type: 'boolean', half: true },
  { name: 'body_en', label: 'BODY (EN)', type: 'textarea' },
  { name: 'body_ar', label: 'الوصف (AR)', type: 'textarea' },
  { name: 'images', label: 'RENDERS', type: 'images' },
];

export default function DashboardProjects() {
  return (
    <ResourceManager
      resource="projects"
      idKey="slug"
      title="Projects"
      description="Compounds and developments shown on /projects."
      fields={fields}
      columns={[
        { name: 'name_en', label: 'Name' },
        { name: 'location_en', label: 'Location' },
        { name: 'delivery_year', label: 'Delivery' },
        { name: 'published', label: 'Live' },
      ]}
      newRow={{ published: true }}
    />
  );
}
