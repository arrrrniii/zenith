// components/dashboard/tour/TourForm.jsx
import React, { useState, useEffect } from 'react';
import BasicInformation from './create/BasicInformation';
import PricingDetails from './create/PricingDetails';
import MediaSection from './create/MediaSection';
import Activities from './create/Activities';
import Schedule from './create/Schedule';
import InclusionsExclusions from './create/InclusionsExclusions';
import Accessibility from './create/Accessibility';
import PropTypes from 'prop-types';
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { defaultFormData, testTourData } from '@/constants/tourData';

const TourForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  errors = {},
  clearError = () => {},
}) => {
  const [formData, setFormData] = useState(transformInitialData());
  const [originalGallery, setOriginalGallery] = useState(initialData.gallery || []);
  const [submitError, setSubmitError] = useState(null);

  function transformInitialData() {
    try {
      const defaultData = defaultFormData || {
        pricing: {},
        accessibility: {},
        gallery: [],
        tourDates: [],
        activities: [],
        included: [],
        notIncluded: [],
        providedEquipment: [],
        requiredEquipment: []
      };

      return {
        ...JSON.parse(JSON.stringify(defaultData)),
        ...initialData,
        pricing: {
          ...defaultData.pricing,
          ...initialData.pricing
        },
        accessibility: {
          ...defaultData.accessibility,
          ...initialData.accessibility
        },
        gallery: initialData.gallery || [],
        tourDates: initialData.tourDates || [],
        activities: initialData.activities || [],
        included: initialData.included || [],
        notIncluded: initialData.notIncluded || [],
        providedEquipment: initialData.providedEquipment || [],
        requiredEquipment: initialData.requiredEquipment || []
      };
    } catch (error) {
      console.error('Error transforming initial data:', error);
      return {
        pricing: {},
        accessibility: {},
        gallery: [],
        tourDates: [],
        activities: [],
        included: [],
        notIncluded: [],
        providedEquipment: [],
        requiredEquipment: []
      };
    }
  }

  useEffect(() => {
    const newData = transformInitialData();
    setFormData(newData);
    setOriginalGallery(initialData.gallery || []);
  }, [initialData.id]);

  const updateFormData = (field, value) => {
    clearError(field);
    console.log(`Updating field: ${field} with value:`, value);

    setFormData(prev => {
      if (field.includes('.')) {
        const pathSegments = field.split('.');
        const last = pathSegments.pop();
        let current = { ...prev };
        let cursor = current;
        for (const segment of pathSegments) {
          cursor[segment] = { ...cursor[segment] };
          cursor = cursor[segment];
        }
        cursor[last] = value;
        return current;
      }
      return { ...prev, [field]: value };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      // Process gallery changes for tracking removals
      const originalIds = originalGallery
        .filter(img => img && img.id)
        .map(img => img.id);
      
      const currentIds = (formData.gallery || [])
        .filter(img => img && typeof img === 'object' && img.id)
        .map(img => img.id);
      
      const removedIds = originalIds.filter(id => !currentIds.includes(id));

      // Pass both form data and removed gallery IDs to parent
      await onSubmit(formData, removedIds);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="mb-4 flex gap-4">
        <button
          type="button"
          onClick={() => setFormData(testTourData)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Load Test Data
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      {(submitError || errors.submit) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{submitError || errors.submit}</p>
        </Alert>
      )}

      <BasicInformation
        formData={formData}
        updateFormData={updateFormData}
        errors={errors}
      />

      <PricingDetails
        formData={formData.pricing}
        updateFormData={(field, value) => updateFormData(`pricing.${field}`, value)}
        errors={Object.fromEntries(
          Object.entries(errors)
            .filter(([k]) => k.startsWith('pricing'))
            .map(([k,v]) => [k.replace('pricing.', ''), v])
        )}
      />

      <MediaSection
        formData={formData}
        updateFormData={updateFormData}
        errors={errors}
      />

      <Schedule
        formData={formData}
        updateFormData={updateFormData}
        errors={errors}
      />

      <Activities
        formData={formData}
        updateFormData={updateFormData}
        errors={errors}
      />

      <InclusionsExclusions
        formData={formData}
        updateFormData={updateFormData}
        errors={errors}
      />

      <Accessibility
        formData={formData.accessibility}
        updateFormData={(field, value) => updateFormData(`accessibility.${field}`, value)}
        errors={Object.fromEntries(
          Object.entries(errors)
            .filter(([k]) => k.startsWith('accessibility'))
            .map(([k,v]) => [k.replace('accessibility.', ''), v])
        )}
      />

      <div className="flex justify-end space-x-4">
        <button 
          type="submit"
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Tour'}
        </button>
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && Object.keys(errors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 rounded-md">
          <h3 className="text-red-800 font-semibold">Validation Errors:</h3>
          <pre className="mt-2 text-sm text-red-700">
            {JSON.stringify(errors, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
};

TourForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  errors: PropTypes.object,
  clearError: PropTypes.func
};

export default TourForm;