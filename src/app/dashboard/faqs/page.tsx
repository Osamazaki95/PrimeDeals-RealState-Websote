'use client';

import { ResourceManager, type Field } from '@/components/dashboard/ResourceManager';

const fields: Field[] = [
  { name: 'question_en', label: 'QUESTION (EN)', type: 'text', required: true },
  { name: 'question_ar', label: 'السؤال (AR)', type: 'text', required: true },
  { name: 'answer_en', label: 'ANSWER (EN)', type: 'textarea', required: true },
  { name: 'answer_ar', label: 'الإجابة (AR)', type: 'textarea', required: true },
  { name: 'sort_order', label: 'ORDER', type: 'number', half: true },
];

export default function DashboardFaqs() {
  return (
    <ResourceManager
      resource="faqs"
      title="FAQs"
      description="Accordion shown at the bottom of /about."
      fields={fields}
      columns={[{ name: 'question_en', label: 'Question' }, { name: 'sort_order', label: 'Order' }]}
    />
  );
}
