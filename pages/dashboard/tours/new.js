// pages/dashboard/tours/new.js
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TourForm from '@/components/dashboard/tour/TourForm';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { useToast } from "@/components/ui/use-toast";
import { useTourMutations } from '@/components/dashboard/tour/hooks/useTourMutations';
import { useFormValidation } from '@/components/dashboard/tour/hooks/useFormValidation';

const NewTourPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { handleSubmit, loading } = useTourMutations();
  const { errors, validateForm, clearError, scrollToFirstError } = useFormValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultTourData = {
    title: '',
    description: '',
    tour_type: '',
    duration: 1,
    duration_type: '',
    meetingPoint: '',
    status: '',
    mainImage: '',
    videoUrl: '',
    defaultStartTime: '',
    pricing: {
      pricePerPerson: '',
      maxCapacity: '',
      earlyBirdDiscount: 0,
      groupDiscount: 0,
      paymentDetails: '',
      refundPolicy: '',
      depositRequirements: ''
    },
    accessibility: {
      wheelchairAccessible: false,
      mobilityAid: false,
      visualAid: false,
      hearingAid: false,
      serviceAnimals: false,
      minimumAge: null,
      fitnessLevel: 'moderate',
      notes: ''
    },
    gallery: [],
    tourDates: [],
    activities: [],
    included: [],
    notIncluded: [],
    providedEquipment: [],
    requiredEquipment: []
  };

  const handleFormSubmit = async (formData, removedGalleryIds) => {
    setIsSubmitting(true);
    
    try {
      // Validate form data
      const isValid = validateForm(formData);
      if (!isValid) {
        scrollToFirstError();
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting tour data:', formData);
      const result = await handleSubmit(formData, removedGalleryIds);

      if (result.success) {
        toast({
          title: "Success",
          description: "Tour created successfully",
        });
        router.push('/dashboard/tours');
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create tour",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Tour creation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create tour",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Show confirmation if form has been modified
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.back();
    }
  };

  return (
    <DashboardLayout activeSection="tours">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tours
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Create New Tour</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the information below to create a new tour package.
          </p>
        </div>

        <TourForm
          initialData={defaultTourData}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting || loading}
          errors={errors}
          clearError={clearError}
        />
      </div>
    </DashboardLayout>
  );
};

export default NewTourPage;