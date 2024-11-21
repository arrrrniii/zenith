// hooks/useFormValidation.js
import { useState, useCallback } from 'react';
import { serviceSchema } from '../components/schemas/serviceValidation';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((field, value) => {
    try {
      const fieldSchema = serviceSchema.shape[field];
      fieldSchema.parse(value);
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [field]: error.errors[0].message 
      }));
      return false;
    }
  }, []);

  const validateForm = useCallback((formData) => {
    try {
      serviceSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.errors.forEach(err => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  }, []);

  return {
    errors,
    validateField,
    validateForm
  };
};