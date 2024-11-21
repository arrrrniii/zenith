import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useForm = ({ 
  formType = 'contact',
  serviceId = null,
  onSuccess,
  onError,
  resetOnSuccess = true 
}) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { toast } = useToast();

  const resetForm = useCallback(() => {
    setFormData({});
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  const validateForm = useCallback((fields, formType) => {
    if (!formType) {
      throw new Error('Form type is required');
    }

    const errors = [];

    fields.forEach(field => {
      const value = formData[field.id];

      // Required field validation
      if (field.required && !value) {
        errors.push(`${field.label} is required`);
      }

      if (value) {
        // Email validation
        if (field.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push('Please enter a valid email address');
          }
        }

        // Phone validation
        if (field.type === 'tel') {
          const phoneRegex = /^\+?[\d\s-]{8,}$/;
          if (!phoneRegex.test(value)) {
            errors.push('Please enter a valid phone number');
          }
        }

        // Select validation
        if (field.type === 'select' && field.options?.length > 0) {
          if (!field.options.includes(value)) {
            errors.push(`Please select a valid ${field.label.toLowerCase()}`);
          }
        }

        // Form-specific validations
        switch (formType) {
          case 'contact':
            if (field.type === 'textarea' && field.id === 'message') {
              if (value.length < 10) {
                errors.push('Message must be at least 10 characters long');
              }
            }
            break;

          case 'appointment':
            if (field.id === 'date') {
              const selectedDate = new Date(value);
              if (selectedDate < new Date()) {
                errors.push('Please select a future date');
              }
            }
            break;

          case 'callback':
            if (field.type === 'tel' && !value) {
              errors.push('Phone number is required for callback requests');
            }
            break;

          default:
            break;
        }
      }
    });

    return errors;
  }, [formData]);

  const handleFieldChange = useCallback((fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  const submitForm = useCallback(async ({
    fields = [],
    content = {},
    recaptchaToken = null,
    extraData = {}
  }) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate reCAPTCHA
      if (!recaptchaToken) {
        throw new Error('Please complete the reCAPTCHA verification.');
      }

      // Form type validation
      if (!formType) {
        throw new Error('Form type is required');
      }

      // Field validation
      const validationErrors = validateForm(fields, formType);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Prepare submission data
      const submissionData = {
        formType,
        serviceId,
        formData: {
          ...formData,
          source: typeof window !== 'undefined' ? window.location.pathname : 'Unknown Source',
          submittedAt: new Date().toISOString()
        },
        content: {
          // Spread existing content
          ...content,
          // Form Fields
          fields: fields.map(field => ({
            id: field.id,
            label: field.label,
            type: field.type,
            required: field.required,
            helpText: field.helpText,
            enabled: field.enabled !== false,
            width: field.width || 'full',
            placeholder: field.placeholder || '',
            options: field.options || []
          })),
          // Success Configuration
          successTitle: content.successTitle || 'Thank you for your message!',
          successMessage: content.successMessage || "We'll get back to you as soon as possible.",
          showResetButton: content.showResetButton !== false,
          // Form Configuration
          enableRecaptcha: true,
          formId: content.formId || `form-${Date.now()}`,
          title: content.title || 'Form Submission',
          description: content.description || '',
          submitButtonText: content.submitButtonText || 'Send Message',
          // Additional settings
          recipientEmail: content.recipientEmail || 'creativesphere1@gmail.com',
          styles: content.styles || {
            backgroundColor: 'transparent',
            borderRadius: '0.5rem',
            padding: '2rem',
            maxWidth: '2xl'
          }
        },
        // Security & Validation
        recaptchaToken,
        // Extra Data
        extraData: {
          ...extraData,
          submittedAt: new Date().toISOString(),
          formId: content.formId || `form-${Date.now()}`,
          source: typeof window !== 'undefined' ? window.location.pathname : 'Unknown Source',
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
        }
      };

      // Submit form
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }

      // Handle success
      setSubmitSuccess(true);

      // Show success toast notification
      toast({
        title: content.successTitle || "Success!",
        description: content.successMessage || "Your submission has been received.",
        duration: 5000,
      });

      if (resetOnSuccess) {
        resetForm();
      }

      if (onSuccess) {
        onSuccess({
          ...data,
          successTitle: content.successTitle,
          successMessage: content.successMessage,
          showResetButton: content.showResetButton
        });
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message);
      
      // Show error toast notification
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message.includes('reCAPTCHA') 
          ? 'Please complete the verification and try again.'
          : error.message || "Failed to submit form. Please try again.",
        duration: 5000,
      });

      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formType, serviceId, formData, validateForm, resetForm, toast, onSuccess, onError, resetOnSuccess]);

  return {
    formData,
    isSubmitting,
    submitError,
    submitSuccess,
    submitForm,
    handleFieldChange,
    resetForm,
    setSubmitSuccess,
  };
};