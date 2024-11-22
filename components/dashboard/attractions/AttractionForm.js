import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from './graphql/operations';
import { useCreateAttraction, useUpdateAttraction } from './hooks/useAttractions';
import { useToast } from "@/components/ui/use-toast";

import BasicDetails from './components/BasicDetails';
import GallerySection from './components/GallerySection';
import AdditionalDetails from './components/AdditionalDetails';

const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  address: '',
  directions: '',
  hours: '',
  website: '',
  phone: '',
  price_range: '',
  status: 'open',
  rating: null,
  review_count: 0,
  monthly_visitors: 0,
  categories: [],
  images: [],
  country: '',
  city: ''
};

const AttractionForm = ({ initialData = null, mode = 'create' }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);
  const categories = categoriesData?.categories || [];
  
  // Setup mutation hooks
  const { createAttraction, loading: createLoading } = useCreateAttraction();
  const { updateAttraction, loading: updateLoading } = useUpdateAttraction(initialData?.id);
  
  const loading = createLoading || updateLoading || categoriesLoading || isSubmitting;

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...INITIAL_FORM_STATE,
        ...initialData,
        categories: initialData.attraction_categories?.map(ac => ac.category_id) || [],
        images: initialData.attraction_images?.map(img => img.image_url) || ['/api/placeholder/400/300']
      });
    }
  }, [initialData]);

  // Handle form field updates
  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    setIsDirty(true);
  }, [errors]);

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = ['name', 'description', 'address', 'country', 'city'];
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Website format validation
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL starting with http:// or https://';
    }

    // Phone number format validation
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Categories validation
    if (formData.categories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }

    // Rating range validation
    if (formData.rating !== null && (formData.rating < 0 || formData.rating > 5)) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    // Image validation
    if (formData.images.length === 0 || (formData.images.length === 1 && formData.images[0] === '/api/placeholder/400/300')) {
      newErrors.images = 'Please add at least one image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please correct the errors in the form"
      });
      
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const attractionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        country: formData.country,
        city: formData.city,
        directions: formData.directions?.trim(),
        hours: formData.hours?.trim(),
        website: formData.website?.trim(),
        phone: formData.phone?.trim(),
        price_range: formData.price_range?.trim(),
        status: formData.status,
        rating: parseFloat(formData.rating) || null,
        review_count: parseInt(formData.review_count) || 0,
        monthly_visitors: parseInt(formData.monthly_visitors) || 0,
        categories: formData.categories,
        images: formData.images.filter(img => img && img !== '/api/placeholder/400/300')
      };

      if (mode === 'create') {
        await createAttraction(attractionData);
        toast({
          title: "Success",
          description: "Attraction created successfully"
        });
      } else {
        await updateAttraction(attractionData);
        toast({
          title: "Success",
          description: "Attraction updated successfully"
        });
      }

      setIsDirty(false);
      router.push('/dashboard/attractions');
    } catch (error) {
      console.error('Error saving attraction:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save attraction. Please try again."
      });
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to save attraction. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, mode, createAttraction, updateAttraction, router, toast]);

  // Handle navigation away with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Handle route change with unsaved changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.events.emit('routeChangeError');
        throw 'routeChange aborted.';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [isDirty, router]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!loading) {
          handleSubmit(e);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, handleSubmit]);

  return (
    <div className="max-w-3xl mx-auto pb-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button 
          type="button"
          onClick={() => {
            if (!isDirty || window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
              router.back();
            }
          }}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Attractions
        </button>

        <h1 className="text-2xl font-semibold text-gray-900">
          {mode === 'create' ? 'Create Attraction' : 'Edit Attraction'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <BasicDetails 
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          loading={loading}
        />

        {/* Gallery */}
        <GallerySection 
          images={formData.images}
          onImagesChange={(images) => updateFormData('images', images)}
          loading={loading}
          error={errors.images}
        />

        {/* Additional Details */}
        <AdditionalDetails 
          formData={formData}
          updateFormData={updateFormData}
          categories={categories}
          errors={errors}
          loading={loading}
        />

        {/* Form Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isDirty && (
                <span className="text-sm text-yellow-600">
                  You have unsaved changes
                </span>
              )}
              {errors.submit && (
                <span className="text-sm text-red-600">
                  {errors.submit}
                </span>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => {
                  if (!isDirty || window.confirm('Discard changes?')) {
                    router.back();
                  }
                }}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {mode === 'create' ? 'Create Attraction' : 'Update Attraction'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 bg-red-50 border-t border-red-200 p-4 transform transition-transform duration-200">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <p className="text-sm text-red-800">
              Please correct the following errors:
            </p>
            <button
              type="button"
              onClick={() => {
                const firstError = document.querySelector('.border-red-500');
                if (firstError) {
                  firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="text-sm text-red-800 underline hover:text-red-900"
            >
              View Errors
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionForm;