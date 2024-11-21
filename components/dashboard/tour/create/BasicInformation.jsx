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
  return (
    <FormSection 
      title="Basic Information"
      description="Enter the fundamental details about your tour."
    >
      <div className="grid gap-6">
        <FormInput
          label="Tour Title"
          type="text"
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          error={errors?.title}
          placeholder="Enter the tour title"
          required
        />
        
        <FormTextarea
          label="Description"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          error={errors?.description}
          placeholder="Provide a detailed description of the tour"
          rows={4}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Tour Type"
            value={formData.tourType}
            onChange={(value) => updateFormData('tourType', value)}
            error={errors?.tourType}
            options={tourTypes}
            placeholder="Select tour type"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Duration"
              type="number"
              min={1}
              value={formData.duration}
              onChange={(e) => updateFormData('duration', e.target.value)}
              error={errors?.duration}
              required
              placeholder="Duration"
            />
            
            <FormSelect
              label="Unit"
              value={formData.durationType}
              onChange={(value) => updateFormData('durationType', value)}
              error={errors?.durationType}
              options={durationTypes}
              placeholder="Select unit"
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default BasicInformation;