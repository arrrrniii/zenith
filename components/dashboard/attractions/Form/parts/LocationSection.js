
// components/dashboard/attractions/Form/parts/LocationSection.js
import React from 'react';
import { MapPin } from 'lucide-react';
import { FormSection, FormField } from '../FormComponents';

const LocationSection = ({ formData, updateFormData, errors, loading }) => (
  <FormSection title="Location">
    <div className="space-y-4">
      <FormField label="Address" error={errors.address} required>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            className={`block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
              errors.address ? 'border-red-500' : ''
            }`}
            disabled={loading}
            required
          />
        </div>
      </FormField>

      <FormField label="Getting There" error={errors.directions}>
        <textarea
          value={formData.directions}
          onChange={(e) => updateFormData('directions', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={2}
          disabled={loading}
        />
      </FormField>
    </div>
  </FormSection>
);