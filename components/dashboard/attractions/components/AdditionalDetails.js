// components/dashboard/attractions/components/AdditionalDetails.js
import React from 'react';
import { Star, Users } from 'lucide-react';
import {
  FormSection,
  FormField,
  AddressInput,
  WebsiteInput,
  PhoneInput,
  HoursInput,
  PriceInput,
  NumericInput
} from '../FormComponents';

const ATTRACTION_STATUS = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'seasonal', label: 'Seasonal' }
];

const AdditionalDetails = ({ 
  formData, 
  updateFormData, 
  categories = [], 
  errors, 
  loading 
}) => {
  return (
    <>
      {/* Location Section */}
      <FormSection title="Location">
        <div className="space-y-4">
          <FormField 
            label="Address" 
            error={errors.address} 
            required
            description="Enter the full physical address"
          >
            <AddressInput
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              error={errors.address}
              disabled={loading}
              required
            />
          </FormField>

          <FormField 
            label="Getting There" 
            error={errors.directions}
            description="Provide directions or transportation instructions"
          >
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

      {/* Contact Details */}
      <FormSection title="Contact Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Phone Number" error={errors.phone}>
            <PhoneInput
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              error={errors.phone}
              disabled={loading}
            />
          </FormField>

          <FormField label="Website" error={errors.website}>
            <WebsiteInput
              value={formData.website}
              onChange={(e) => updateFormData('website', e.target.value)}
              error={errors.website}
              disabled={loading}
            />
          </FormField>
        </div>
      </FormSection>

      {/* Operating Details */}
      <FormSection title="Operating Details">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Operating Hours" error={errors.hours}>
              <HoursInput
                value={formData.hours}
                onChange={(e) => updateFormData('hours', e.target.value)}
                disabled={loading}
              />
            </FormField>

            <FormField label="Price Range" error={errors.price_range}>
              <PriceInput
                value={formData.price_range}
                onChange={(e) => updateFormData('price_range', e.target.value)}
                disabled={loading}
              />
            </FormField>
          </div>

          <FormField label="Status" error={errors.status}>
            <div className="mt-2 flex flex-wrap gap-4">
              {ATTRACTION_STATUS.map((status) => (
                <label key={status.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={formData.status === status.value}
                    onChange={(e) => updateFormData('status', e.target.value)}
                    disabled={loading}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm ${
                    formData.status === status.value ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}>
                    {status.label}
                  </span>
                </label>
              ))}
            </div>
          </FormField>
        </div>
      </FormSection>

      {/* Categories */}
      <FormSection title="Categories">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm
                  ${formData.categories.includes(category.id)
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent'
                  } cursor-pointer hover:bg-opacity-80 transition-colors`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.categories.includes(category.id)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...formData.categories, category.id]
                      : formData.categories.filter(id => id !== category.id);
                    updateFormData('categories', newCategories);
                  }}
                  disabled={loading}
                />
                {category.name}
              </label>
            ))}
          </div>
          {errors.categories && (
            <p className="text-sm text-red-500">{errors.categories}</p>
          )}
        </div>
      </FormSection>

      {/* Statistics */}
      <FormSection title="Statistics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField 
            label="Rating" 
            error={errors.rating}
            description="Average rating (0-5)"
          >
            <NumericInput
              icon={Star}
              value={formData.rating || ''}
              onChange={(e) => updateFormData('rating', e.target.value)}
              min={0}
              max={5}
              step={0.1}
              allowDecimals={true}
              disabled={loading}
            />
          </FormField>

          <FormField 
            label="Review Count" 
            error={errors.review_count}
            description="Total number of reviews"
          >
            <NumericInput
              value={formData.review_count || ''}
              onChange={(e) => updateFormData('review_count', e.target.value)}
              min={0}
              disabled={loading}
            />
          </FormField>

          <FormField 
            label="Monthly Visitors" 
            error={errors.monthly_visitors}
            description="Average monthly visitors"
          >
            <NumericInput
              icon={Users}
              value={formData.monthly_visitors || ''}
              onChange={(e) => updateFormData('monthly_visitors', e.target.value)}
              min={0}
              disabled={loading}
            />
          </FormField>
        </div>
      </FormSection>
    </>
  );
};

export default AdditionalDetails;