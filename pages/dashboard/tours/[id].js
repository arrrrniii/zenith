// pages/dashboard/tours/[id].js
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TourForm from '@/components/dashboard/tour/TourForm';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_TOUR } from '@/components/dashboard/tour/graphql/queries';
import { LoadingOverlay } from '@/components/dashboard/tour/LoadingOverlay';
import { useToast } from "@/components/ui/use-toast";
import { useTourMutations } from '@/components/dashboard/tour/hooks/useTourMutations';
import { useFormValidation } from '@/components/dashboard/tour/hooks/useFormValidation';

const EditTourPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  const { handleSubmit, loading: mutationLoading } = useTourMutations();
  const { errors, validateForm, clearError, scrollToFirstError } = useFormValidation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading: queryLoading, error } = useQuery(GET_TOUR, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('Fetched tour data:', data?.tours_by_pk);
    }
  });

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

      console.log('Submitting updated tour data:', formData);
      const result = await handleSubmit({
        ...formData,
        id // Ensure ID is included for update
      }, removedGalleryIds);

      if (result.success) {
        toast({
          title: "Success",
          description: "Tour updated successfully",
        });
        router.push('/dashboard/tours');
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update tour",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Tour update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update tour",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.back();
    }
  };

  const transformTourData = (tour) => {
    if (!tour) return {};

    return {
      id: tour.id,
      title: tour.title,
      description: tour.description,
      tour_type: tour.tour_type,
      duration: tour.duration,
      duration_type: tour.duration_type,
      meetingPoint: tour.meeting_point,
      status: tour.status,
      mainImage: tour.main_image_url,
      videoUrl: tour.video_url,
      defaultStartTime: tour.default_start_time,
      
      pricing: {
        pricePerPerson: tour.tour_pricing?.price_per_person,
        maxCapacity: tour.tour_pricing?.max_capacity,
        earlyBirdDiscount: tour.tour_pricing?.early_bird_discount_percentage,
        groupDiscount: tour.tour_pricing?.group_discount_percentage,
        paymentDetails: tour.tour_pricing?.payment_details,
        refundPolicy: tour.tour_pricing?.refund_policy,
        depositRequirements: tour.tour_pricing?.deposit_requirements
      },
      
      accessibility: {
        wheelchairAccessible: tour.tour_accessibility_feature?.wheelchair_accessible,
        mobilityAid: tour.tour_accessibility_feature?.mobility_aid,
        visualAid: tour.tour_accessibility_feature?.visual_aid,
        hearingAid: tour.tour_accessibility_feature?.hearing_aid,
        serviceAnimals: tour.tour_accessibility_feature?.service_animals,
        minimumAge: tour.tour_accessibility_feature?.minimum_age,
        fitnessLevel: tour.tour_accessibility_feature?.fitness_level,
        notes: tour.tour_accessibility_feature?.notes,
      },

      gallery: tour.tour_galleries?.map(img => ({
        id: img.id,
        image_url: img.image_url,
        sequence_order: img.sequence_order
      })) || [],
      
      tourDates: tour.tour_dates?.map(date => ({
        id: date.id,
        startDate: date.date,
        endDate: date.end_date,
        startTime: date.start_time,
        status: date.status,
        availableSpots: date.available_spots
      })) || [],
      
      activities: tour.tour_activities?.map(activity => ({
        id: activity.id,
        title: activity.title,
        duration: activity.duration,
        description: activity.description,
        location: activity.location,
        sequence_order: activity.sequence_order
      })) || [],
      
      included: tour.tour_inclusions
        ?.filter(inc => inc.type === 'included')
        .map(inc => inc.description) || [],
      notIncluded: tour.tour_inclusions
        ?.filter(inc => inc.type === 'not_included')
        .map(inc => inc.description) || [],
      providedEquipment: tour.tour_inclusions
        ?.filter(inc => inc.type === 'provided_equipment')
        .map(inc => inc.description) || [],
      requiredEquipment: tour.tour_inclusions
        ?.filter(inc => inc.type === 'required_equipment')
        .map(inc => inc.description) || []
    };
  };

  if (!id || queryLoading) {
    return (
      <DashboardLayout activeSection="tours">
        <LoadingOverlay message="Loading tour details..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout activeSection="tours">
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          Error loading tour: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  const tourData = transformTourData(data?.tours_by_pk);

  if (!tourData.id) {
    return (
      <DashboardLayout activeSection="tours">
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
          Tour not found
        </div>
      </DashboardLayout>
    );
  }

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
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Tour: {tourData.title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Update the tour information below.
          </p>
        </div>

        <TourForm
          initialData={tourData}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting || mutationLoading}
          errors={errors}
          clearError={clearError}
        />
      </div>
    </DashboardLayout>
  );
};

export default EditTourPage;