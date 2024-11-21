import React, { useState } from 'react';
import { useTourMutations } from './hooks/useTourMutations';
import BasicInformation from './BasicInformation';
import PricingDetails from './PricingDetails';
import MediaSection from './MediaSection';
import Activities from './Activities';
import Schedule from './Schedule';
import InclusionsExclusions from './InclusionsExclusions';
import Accessibility from './Accessibility';
import PropTypes from 'prop-types';
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

const testTourData = {
  title: "City Walking Tour",
  description: "Explore the historic downtown area with our expert guides. Perfect for history buffs and casual tourists alike.",
  tourType: "single_day",
  duration: "4",
  durationType: "hours",
  status: "draft",
  difficultyLevel: "easy",
  pricing: {
    pricePerPerson: "50",
    maxCapacity: "15",
    earlyBirdDiscount: "10",
    groupDiscount: "15",
    paymentDetails: "Payment required 48 hours before tour",
    refundPolicy: "Full refund if cancelled 24 hours before",
    depositRequirements: "20% deposit required"
  },
  mainImage: "https://example.com/tour-image.jpg",
  gallery: ["https://example.com/gallery1.jpg", "https://example.com/gallery2.jpg"],
  videoUrl: "https://youtube.com/watch?v=abc123",
  meetingPoint: "Central Station Main Entrance",
  defaultStartTime: "09:00",
  tourDates: [
    {
      startDate: "2024-12-01",
      endDate: "2024-12-01",
      startTime: "09:00",
      status: "active"
    }
  ],
  activities: [
    {
      title: "Historical Walking Tour",
      duration: 120,
      description: "Walk through historic district with expert commentary",
      location: "Downtown",
      sequence_order: 1
    },
    {
      title: "Local Market Visit",
      duration: 60,
      description: "Experience local culture and foods",
      location: "City Market",
      sequence_order: 2
    }
  ],
  included: ["Professional guide", "Water bottle", "Snacks"],
  notIncluded: ["Lunch", "Transportation", "Personal expenses"],
  providedEquipment: ["Umbrella", "Audio guide", "Map"],
  requiredEquipment: ["Comfortable shoes", "Camera", "Light jacket"],
  accessibility: {
    wheelchairAccessible: true,
    mobilityAid: true,
    visualAid: false,
    hearingAid: true,
    serviceAnimals: true,
    minimumAge: "12",
    fitnessLevel: "low",
    notes: "Please inform us of any specific requirements in advance"
  }
};

const defaultFormData = {
  title: '',
  description: '',
  tourType: 'single_day',
  duration: '',
  durationType: 'hours',
  status: 'draft',
  difficultyLevel: 'easy',
  pricing: {
    pricePerPerson: '',
    maxCapacity: '',
    earlyBirdDiscount: '',
    groupDiscount: '',
    paymentDetails: '',
    refundPolicy: '',
    depositRequirements: ''
  },
  mainImage: null,
  gallery: [],
  videoUrl: '',
  meetingPoint: '',
  defaultStartTime: '09:00',
  tourDates: [],
  activities: [],
  included: [],
  notIncluded: [],
  providedEquipment: [],
  requiredEquipment: [],
  accessibility: {
    wheelchairAccessible: false,
    mobilityAid: false,
    visualAid: false,
    hearingAid: false,
    serviceAnimals: false,
    minimumAge: '',
    fitnessLevel: 'low',
    restrictions: [],
    notes: ''
  }
};

const validateForm = (formData) => {
  const errors = {};

  if (!formData.title?.trim()) errors.title = 'Title is required';
  if (!formData.description?.trim()) errors.description = 'Description is required';
  if (!formData.duration) errors.duration = 'Duration is required';
  if (!formData.pricing?.pricePerPerson) {
    errors.pricing = errors.pricing || {};
    errors.pricing.pricePerPerson = 'Price per person is required';
  }
  if (!formData.pricing?.maxCapacity) {
    errors.pricing = errors.pricing || {};
    errors.pricing.maxCapacity = 'Maximum capacity is required';
  }
  if (!formData.meetingPoint?.trim()) errors.meetingPoint = 'Meeting point is required';
  if (!formData.tourDates?.length) errors.tourDates = 'At least one tour date is required';
  if (!formData.activities?.length) errors.activities = 'At least one activity is required';
  if (!formData.included?.length) errors.included = 'At least one inclusion is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const TourForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(() => ({
    ...JSON.parse(JSON.stringify(defaultFormData)),
    ...initialData,
    pricing: { ...defaultFormData.pricing, ...(initialData.pricing || {}) },
    accessibility: { ...defaultFormData.accessibility, ...(initialData.accessibility || {}) }
  }));

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleCreateTour, handleUpdateTour, loading } = useTourMutations();

  const clearError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const updateFormData = (field, value) => {
    clearError(field);
    setFormData(prev => {
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        return {
          ...prev,
          [parentField]: {
            ...prev[parentField],
            [childField]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = validateForm(formData);
      setErrors(validation.errors);

      if (!validation.isValid) {
        console.log('Form validation errors:', validation.errors);
        return;
      }

      const result = formData.id
        ? await handleUpdateTour(formData.id, formData)
        : await handleCreateTour(formData);

      if (result.success) {
        onSubmit?.(result.data);
      } else {
        setErrors({ submit: result.error?.message || 'Failed to submit form' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setFormData(testTourData)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Load Test Data
        </button>
      </div>

      <BasicInformation 
        formData={formData} 
        updateFormData={updateFormData}
        errors={errors}
      />
      
      <PricingDetails 
        formData={formData.pricing} 
        updateFormData={(field, value) => updateFormData(`pricing.${field}`, value)}
        errors={errors?.pricing || {}}
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
        errors={errors?.accessibility || {}}
      />

      {errors.submit && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{errors.submit}</p>
        </Alert>
      )}

      <div className="flex justify-end space-x-4">
        <button 
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit"
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
            ${(isSubmitting || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting || loading}
        >
          {(isSubmitting || loading) ? 'Saving...' : 'Save Tour'}
        </button>
      </div>
    </form>
  );
};

TourForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func
};

export default TourForm;