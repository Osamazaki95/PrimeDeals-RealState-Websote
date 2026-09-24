'use client';

import { ResourceManager, type Field } from '@/components/dashboard/ResourceManager';

const fields: Field[] = [
  { name: 'name_en', label: 'NAME (EN)', type: 'text', required: true, half: true },
  { name: 'name_ar', label: 'الاسم (AR)', type: 'text', required: true, half: true },
  { name: 'role_en', label: 'ROLE (EN)', type: 'text', required: true, half: true, help: 'e.g. Buyer — New Cairo' },
  { name: 'role_ar', label: 'الصفة (AR)', type: 'text', required: true, half: true },
  { name: 'quote_en', label: 'QUOTE (EN)', type: 'textarea', required: true },
  { name: 'quote_ar', label: 'الرأي (AR)', type: 'textarea', required: true },
  { name: 'rating', label: 'RATING (1–5)', type: 'number', half: true },
  { name: 'sort_order', label: 'ORDER', type: 'number', half: true },
  { name: 'photo', label: 'PHOTO URL', type: 'text' },
];

export default function DashboardReviews() {
  return (
    <ResourceManager
      resource="reviews"
      title="Client reviews"
      description="Testimonials in the home page carousel."
      fields={fields}
      columns={[
        { name: 'name_en', label: 'Client' },
        { name: 'role_en', label: 'Role' },
        { name: 'rating', label: '★' },
        { name: 'sort_order', label: 'Order' },
      ]}
      newRow={{ rating: 5, featured: true }}
    />
  );
}
