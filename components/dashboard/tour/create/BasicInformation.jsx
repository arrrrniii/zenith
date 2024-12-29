//components/dashboard/tour/create/BasicInformation.jsx
import React from 'react';
import FormSection from './FormSection';
import { FormInput, FormTextarea, FormSelect } from './FormFields';

const tourTypes = [
  { value: 'single_day', label: 'Single Day' },
  { value: 'multi_day', label: 'Multi Day' },
  { value: 'guided', label: 'Guided Tour' },
  { value: 'self_guided', label: 'Self-Guided Tour' },
  { value: 'private', label: 'Private Tour' },
  { value: 'group', label: 'Group Tour' }
];

const durationTypes = [
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' }
];

const BasicInformation = ({ formData, updateFormData, errors }) => {
  // Only show error message if field is touched and empty
  const shouldShowError = (fieldName) => {
    const value = formData[fieldName];
    return errors?.[fieldName] && (!value || value === '');
  };

  // Handle duration input changes
  const handleDurationChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      updateFormData('duration', '');
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue >= 0) {
        updateFormData('duration', numValue);
      }
    }
  };

  return (
    <FormSection
      title="Basic Information"
      description="Enter the fundamental details about your tour."
    >
      <div className="grid gap-6">
        <FormInput
          label="Tour Title"
          type="text"
          value={formData.title || ''}
          onChange={(e) => updateFormData('title', e.target.value)}
          error={shouldShowError('title') ? errors.title : null}
          placeholder="Enter the tour title"
          required
        />

        <FormTextarea
          label="Description"
          value={formData.description || ''}
          onChange={(e) => updateFormData('description', e.target.value)}
          error={shouldShowError('description') ? errors.description : null}
          placeholder="Provide a detailed description of the tour"
          rows={4}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Tour Type"
            value={formData.tour_type || ''}
            onChange={(value) => updateFormData('tour_type', value)}
            error={shouldShowError('tour_type') ? errors.tour_type : null}
            options={tourTypes}
            placeholder="Select tour type"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Duration"
              type="number"
              min={1}
              value={formData.duration || ''}
              onChange={handleDurationChange}
              error={shouldShowError('duration') ? errors.duration : null}
              required
              placeholder="Duration"
            />

            <FormSelect
              label="Unit"
              value={formData.duration_type || 'hours'}
              onChange={(value) => updateFormData('duration_type', value)}
              error={shouldShowError('duration_type') ? errors.duration_type : null}
              options={durationTypes}
              placeholder="Select unit"
              required
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default BasicInformation;