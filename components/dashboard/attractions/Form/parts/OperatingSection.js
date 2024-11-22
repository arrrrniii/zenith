

// components/dashboard/attractions/Form/parts/OperatingSection.js
import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { FormSection, FormField } from '../FormComponents';

const OperatingSection = ({ formData, updateFormData, errors, loading }) => (
  <FormSection title="Operating Details">
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Operating Hours" error={errors.hours}>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) => updateFormData('hours', e.target.value)}
              className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 9:00 AM - 5:00 PM"
              disabled={loading}
            />
          </div>
        </FormField>

        <FormField label="Price Range" error={errors.price_range}>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.price_range}
              onChange={(e) => updateFormData('price_range', e.target.value)}
              className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., $10 - $50"
              disabled={loading}
            />
          </div>
        </FormField>
      </div>

      <FormField label="Status" error={errors.status}>
        <div className="mt-2 flex space-x-4">
          {['open', 'closed', 'seasonal'].map((status) => (
            <label key={status} className="flex items-center space-x-2">
              <input
                type="radio"
                name="status"
                value={status}
                checked={formData.status === status}
                onChange={(e) => updateFormData('status', e.target.value)}
                disabled={loading}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </FormField>
    </div>
  </FormSection>
);