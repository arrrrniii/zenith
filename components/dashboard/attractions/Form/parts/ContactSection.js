

// components/dashboard/attractions/Form/parts/ContactSection.js
import React from 'react';
import { Phone, Globe } from 'lucide-react';
import { FormSection, FormField } from '../FormComponents';

const ContactSection = ({ formData, updateFormData, errors, loading }) => (
  <FormSection title="Contact Details">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Phone Number" error={errors.phone}>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData('phone', e.target.value)}
            className={`block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : ''
            }`}
            placeholder="+1 (555) 000-0000"
            disabled={loading}
          />
        </div>
      </FormField>

      <FormField label="Website" error={errors.website}>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => updateFormData('website', e.target.value)}
            className={`block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
              errors.website ? 'border-red-500' : ''
            }`}
            placeholder="https://example.com"
            disabled={loading}
          />
        </div>
      </FormField>
    </div>
  </FormSection>
);