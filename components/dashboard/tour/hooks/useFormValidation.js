// components/dashboard/tour/hooks/useFormValidation.js
import { useState, useCallback } from 'react';
import { z } from 'zod';

// Utility function to format duration to HH:mm
const formatDurationToTime = (duration) => {
  if (!duration) return null;
  const numericDuration = parseInt(duration);
  if (isNaN(numericDuration)) return null;
  
  const hours = Math.floor(numericDuration / 60);
  const minutes = numericDuration % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Utility function to validate and format time
const formatTimeString = (timeString) => {
  if (!timeString) return null;
  
  // If it's already in HH:mm format, return as is
  if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
    return timeString;
  }
  
  // Try to convert numeric duration to time format
  return formatDurationToTime(timeString);
};

const TourSchema = z.object({
  // Basic Information
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  tour_type: z.string().min(1, "Tour type is required"),
  duration: z.coerce.number().positive("Duration must be greater than 0"),
  duration_type: z.enum(['hours', 'days']),
  meetingPoint: z.string().min(5, "Please provide a specific meeting point"),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),

  // Media
  mainImage: z.string().min(1, "Main image is required"),
  videoUrl: z.string().url("Invalid video URL format").optional().nullable(),
  gallery: z.array(z.union([
    z.string(),
    z.object({
      id: z.string().optional(), // Make ID optional
      image_url: z.string()
    })
  ])).optional(),

  // Pricing
  pricing: z.object({
    pricePerPerson: z.coerce.number().positive("Price per person must be greater than 0"),
    maxCapacity: z.coerce.number().min(1, "Maximum capacity must be at least 1"),
    paymentDetails: z.string().min(10, "Please provide payment details"),
    refundPolicy: z.string().min(10, "Please provide refund policy"),
    earlyBirdDiscount: z.coerce.number().min(0).max(100, "Early bird discount cannot exceed 100%"),
    groupDiscount: z.coerce.number().min(0).max(100, "Group discount cannot exceed 100%"),
    depositRequirements: z.string().optional()
  }),

  // Schedule
  defaultStartTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
    .transform((val) => formatTimeString(val) || val),

  tourDates: z.array(z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    startTime: z.string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
      .transform((val) => formatTimeString(val) || val),
    status: z.enum(['active', 'cancelled', 'completed']).optional(),
    availableSpots: z.coerce.number().min(0, "Available spots must be 0 or greater").optional()
  })).min(1, "At least one tour date is required"),

  // Activities
  activities: z.array(z.object({
    title: z.string().min(3, "Activity title must be at least 3 characters"),
    duration: z.coerce.number().min(1, "Duration must be at least 1"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    location: z.string().min(3, "Location must be at least 3 characters"),
    sequenceOrder: z.number().optional()
  })).min(1, "At least one activity is required"),

  // Inclusions/Exclusions
  included: z.array(z.string().min(3, "Inclusion must be at least 3 characters"))
    .min(1, "At least one inclusion is required"),
  notIncluded: z.array(z.string().min(3, "Non-inclusion must be at least 3 characters"))
    .optional(),
  providedEquipment: z.array(z.string().min(3, "Equipment must be at least 3 characters"))
    .optional(),
  requiredEquipment: z.array(z.string().min(3, "Equipment must be at least 3 characters"))
    .optional(),

  // Accessibility
  accessibility: z.object({
    wheelchairAccessible: z.boolean().optional(),
    mobilityAid: z.boolean().optional(),
    visualAid: z.boolean().optional(),
    hearingAid: z.boolean().optional(),
    serviceAnimals: z.boolean().optional(),
    minimumAge: z.coerce.number().min(0, "Minimum age cannot be negative").nullable().optional(),
    fitnessLevel: z.enum(['low', 'moderate', 'high', 'extreme']).optional(),
    notes: z.string().optional()
  }).optional()
});

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateForm = useCallback((data) => {
    try {
      console.log("Original form data for validation:", JSON.stringify(data, null, 2));
      // Pre-process time fields
      const processedData = {
        ...data,
        defaultStartTime: formatTimeString(data.defaultStartTime) || data.defaultStartTime,
        tourDates: data.tourDates?.map(date => ({
          ...date,
          startTime: formatTimeString(date.startTime) || date.startTime
        }))
      };

      console.log("Processed data for validation:", JSON.stringify(processedData, null, 2));
      if (processedData.gallery) {
        console.log("Gallery data:", processedData.gallery);
        processedData.gallery.forEach((item, i) => {
          console.log(`Gallery[${i}] value:`, item);
        });
      }

      TourSchema.parse(processedData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = {};
        err.errors.forEach((error) => {
          const path = error.path.join('.');
          newErrors[path] = error.message;
        });
        setErrors(newErrors);
        console.error('Validation errors:', newErrors);
      }
      return false;
    }
  }, []);

  const scrollToFirstError = useCallback(() => {
    const firstErrorKey = Object.keys(errors)[0];
    if (!firstErrorKey) return;

    const errorField = firstErrorKey.split('.').pop();
    if (!errorField) return;

    const selectors = [
      `[name="${errorField}"]`,
      `#${errorField}`,
      `[data-field="${errorField}"]`,
      `[aria-label="${errorField}"]`
    ];

    let errorElement = null;
    for (const selector of selectors) {
      errorElement = document.querySelector(selector);
      if (errorElement) break;
    }

    if (errorElement) {
      setTimeout(() => {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (errorElement instanceof HTMLElement) {
          errorElement.focus();
        }
      }, 100);
    }
  }, [errors]);

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const getFieldError = useCallback((field) => {
    return errors[field];
  }, [errors]);

  const formatTime = useCallback((value) => {
    return formatTimeString(value);
  }, []);

  return {
    errors,
    validateForm,
    clearError,
    getFieldError,
    scrollToFirstError,
    formatTime
  };
};

export { formatTimeString, formatDurationToTime };
