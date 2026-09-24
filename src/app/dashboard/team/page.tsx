'use client';

import { ResourceManager, type Field } from '@/components/dashboard/ResourceManager';

const fields: Field[] = [
  { name: 'name_en', label: 'NAME (EN)', type: 'text', required: true, half: true },
  { name: 'name_ar', label: 'الاسم (AR)', type: 'text', required: true, half: true },
  { name: 'role_en', label: 'ROLE (EN)', type: 'text', required: true, half: true },
  { name: 'role_ar', label: 'المسمى (AR)', type: 'text', required: true, half: true },
  { name: 'phone', label: 'PHONE', type: 'text', half: true },
  { name: 'email', label: 'EMAIL', type: 'text', half: true },
  { name: 'sort_order', label: 'ORDER', type: 'number', half: true },
  { name: 'photo', label: 'PHOTO URL', type: 'text', half: true },
];

export default function DashboardTeam() {
  return (
    <ResourceManager
      resource="team"
      title="Team"
      description="Advisors shown on /about and in property sidebars."
      fields={fields}
      columns={[{ name: 'name_en', label: 'Name' }, { name: 'role_en', label: 'Role' }, { name: 'sort_order', label: 'Order' }]}
    />
  );
}
