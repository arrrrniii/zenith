//components/dashboard/tour/hooks/useFormValidation.js
import { useState, useCallback } from 'react';

const useFormValidation = (initialData) => {
  const [errors, setErrors] = useState({});

  const validateForm = useCallback((data) => {
    const newErrors = {};

    // Basic Information Validation
    if (!data.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!data.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!data.duration || data.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    if (!data.basePrice || data.basePrice <= 0) {
      newErrors.basePrice = 'Base price must be greater than 0';
    }
    if (!data.maxCapacity || data.maxCapacity <= 0) {
      newErrors.maxCapacity = 'Maximum capacity must be greater than 0';
    }

    // Price Details Validation
    if (!data.pricePerPerson || data.pricePerPerson <= 0) {
      newErrors.pricePerPerson = 'Price per person must be greater than 0';
    }
    if (!data.paymentDetails?.trim()) {
      newErrors.paymentDetails = 'Payment details are required';
    }
    if (!data.refundPolicy?.trim()) {
      newErrors.refundPolicy = 'Refund policy is required';
    }

    // Media Validation
    if (!data.mainImage) {
      newErrors.mainImage = 'Main image is required';
    }

    // Schedule Validation
    if (!data.tourDates?.length) {
      newErrors.tourDates = 'At least one tour date is required';
    }
    if (!data.meetingPoint?.trim()) {
      newErrors.meetingPoint = 'Meeting point is required';
    }

    // Activities Validation
    if (!data.activities?.length) {
      newErrors.activities = 'At least one activity is required';
    } else {
      const activityErrors = [];
      let hasErrors = false;

      data.activities.forEach((activity, index) => {
        const activityError = {};

        if (!activity.name?.trim()) {
          activityError.name = 'Activity name is required';
          hasErrors = true;
        }
        if (!activity.startTime?.trim()) {
          activityError.startTime = 'Start time is required';
          hasErrors = true;
        }
        if (!activity.duration?.trim()) {
          activityError.duration = 'Duration is required';
          hasErrors = true;
        }

        activityErrors[index] = Object.keys(activityError).length > 0 ? activityError : undefined;
      });

      if (hasErrors) {
        newErrors.activities = activityErrors;
      }
    }

    // Inclusions and Exclusions Validation
    if (!data.included?.length || !data.included.some(item => item.trim())) {
      newErrors.included = 'At least one inclusion is required';
    }
    if (!data.notIncluded?.length || !data.notIncluded.some(item => item.trim())) {
      newErrors.notIncluded = 'At least one exclusion is required';
    }
    if (data.providedEquipment?.length && !data.providedEquipment.every(item => item.trim())) {
      newErrors.providedEquipment = 'Equipment items cannot be empty';
    }
    if (data.requiredEquipment?.length && !data.requiredEquipment.every(item => item.trim())) {
      newErrors.requiredEquipment = 'Required equipment items cannot be empty';
    }

    // Accessibility Validation
    if (!data.difficultyLevel) {
      newErrors.difficultyLevel = 'Difficulty level is required';
    }
    if (data.minimumAge && (isNaN(data.minimumAge) || data.minimumAge < 0)) {
      newErrors.minimumAge = 'Minimum age must be a positive number';
    }
    if (data.fitnessLevel === undefined) {
      newErrors.fitnessLevel = 'Fitness level is required';
    }
    if (data.restrictions?.length && !data.restrictions.every(item => item.trim())) {
      newErrors.restrictions = 'Restrictions cannot be empty';
    }

    // Validate nested activity fields
    const validateNestedFields = (fieldPath, value, rules) => {
      const [parent, child] = fieldPath.split('.');
      if (!newErrors[parent]) {
        if (rules(value)) {
          newErrors[parent] = { [child]: rules(value) };
        }
      }
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      if (field.includes('.')) {
        // Handle nested errors (e.g., 'activities.0.name')
        const [parent, index, child] = field.split('.');
        if (newErrors[parent]?.[index]) {
          delete newErrors[parent][index][child];
          if (Object.keys(newErrors[parent][index]).length === 0) {
            delete newErrors[parent][index];
          }
          if (Object.keys(newErrors[parent]).length === 0) {
            delete newErrors[parent];
          }
        }
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  }, []);

  const setError = useCallback((field, message) => {
    setErrors(prev => {
      if (field.includes('.')) {
        // Handle nested errors
        const [parent, index, child] = field.split('.');
        const newErrors = { ...prev };
        if (!newErrors[parent]) {
          newErrors[parent] = [];
        }
        if (!newErrors[parent][index]) {
          newErrors[parent][index] = {};
        }
        newErrors[parent][index][child] = message;
        return newErrors;
      }
      return {
        ...prev,
        [field]: message
      };
    });
  }, []);

  return { errors, validateForm, clearError, setError };
};

export default useFormValidation;