// components/dashboard/attractions/Form/parts/BasicInformation.js
import React from 'react';
import { FormSection, FormField } from '../FormComponents';

const BasicInformation = ({ formData, updateFormData, errors, loading }) => (
  <FormSection title="Basic Information">
    <div className="space-y-4">
      <FormField label="Name" error={errors.name} required>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : ''
          }`}
          disabled={loading}
          required
        />
      </FormField>

      <FormField label="Description" error={errors.description} required>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          rows={4}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : ''
          }`}
          disabled={loading}
          required
        />
      </FormField>
    </div>
  </FormSection>
);
