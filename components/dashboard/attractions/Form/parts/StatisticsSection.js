

// components/dashboard/attractions/Form/parts/StatisticsSection.js
import React from 'react';
import { FormSection, FormField } from '../FormComponents';

const StatisticsSection = ({ formData, updateFormData, errors, loading }) => (
  <FormSection title="Statistics">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField label="Rating (0-5)" error={errors.rating}>
        <input
          type="number"
          value={formData.rating || ''}
          onChange={(e) => updateFormData('rating', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="0"
          max="5"
          step="0.1"
          disabled={loading}
        />
      </FormField>

      <FormField label="Review Count" error={errors.review_count}>
        <input
          type="number"
          value={formData.review_count || ''}
          onChange={(e) => updateFormData('review_count', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="0"
          disabled={loading}
        />
      </FormField>

      <FormField label="Monthly Visitors" error={errors.monthly_visitors}>
        <input
          type="number"
          value={formData.monthly_visitors || ''}
          onChange={(e) => updateFormData('monthly_visitors', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="0"
          disabled={loading}
        />
      </FormField>
    </div>
  </FormSection>
);
