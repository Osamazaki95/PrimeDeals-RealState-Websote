'use client';

import { ResourceManager, type Field } from '@/components/dashboard/ResourceManager';

/* PROPERTIES — the full listing record, bilingual. */
const fields: Field[] = [
  { name: 'slug', label: 'SLUG (URL)', type: 'text', required: true, half: true, help: 'e.g. bay-view-house' },
  { name: 'listing', label: 'LISTING', type: 'select', half: true, options: [
    { value: 'sale', label: 'For sale' }, { value: 'rent', label: 'For rent' },
    { value: 'resale', label: 'Resale' }, { value: 'primary', label: 'Primary' },
  ] },
  { name: 'title_en', label: 'TITLE (EN)', type: 'text', required: true, half: true },
  { name: 'title_ar', label: 'العنوان (AR)', type: 'text', required: true, half: true },
  { name: 'location_en', label: 'LOCATION (EN)', type: 'text', required: true, half: true },
  { name: 'location_ar', label: 'الموقع (AR)', type: 'text', required: true, half: true },
  { name: 'description_en', label: 'DESCRIPTION (EN)', type: 'textarea' },
  { name: 'description_ar', label: 'الوصف (AR)', type: 'textarea' },
  { name: 'type', label: 'TYPE', type: 'select', half: true, options: [
    { value: 'apartment', label: 'Apartment' }, { value: 'villa', label: 'Villa' },
    { value: 'townhouse', label: 'Townhouse' }, { value: 'chalet', label: 'Chalet' }, { value: 'office', label: 'Office' },
  ] },
  { name: 'price', label: 'PRICE (EGP)', type: 'number', half: true },
  { name: 'per_month', label: 'PRICE IS MONTHLY', type: 'boolean', half: true },
  { name: 'featured', label: 'FEATURED ON HOME', type: 'boolean', half: true },
  { name: 'bedrooms', label: 'BEDROOMS', type: 'number', half: true },
  { name: 'bathrooms', label: 'BATHROOMS', type: 'number', half: true },
  { name: 'area_sqft', label: 'AREA (SQFT)', type: 'number', half: true },
  { name: 'published', label: 'PUBLISHED', type: 'boolean', half: true },
  { name: 'lat', label: 'LATITUDE', type: 'number', half: true },
  { name: 'lng', label: 'LONGITUDE', type: 'number', half: true },
  { name: 'amenities_en', label: 'AMENITIES (EN)', type: 'tags', half: true },
  { name: 'amenities_ar', label: 'المميزات (AR)', type: 'tags', half: true },
  { name: 'images', label: 'PHOTOS', type: 'images' },
];

export default function DashboardProperties() {
  return (
    <ResourceManager
      resource="properties"
      idKey="slug"
      title="Properties"
      description="Listings shown on /properties, the map and the home page."
      fields={fields}
      columns={[
        { name: 'title_en', label: 'Title' },
        { name: 'location_en', label: 'Location' },
        { name: 'price', label: 'Price' },
        { name: 'featured', label: 'Featured' },
        { name: 'published', label: 'Live' },
      ]}
      newRow={{ type: 'apartment', listing: 'sale', published: true }}
    />
  );
}
