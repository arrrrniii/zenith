// pages/checkout/[id].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TOUR_BY_ID } from '@/graphql/queries';
import CheckoutPage from '@/components/client/checkout/CheckoutPage';
import { Loader2 } from "lucide-react";
import Head from 'next/head';
import { useBookTour } from '@/hooks/useBookTour';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
  </div>
);

const ErrorState = ({ message, onBack }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="max-w-md mx-auto text-center px-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600">
        {message || "We couldn't load the tour information. Please try again later."}
      </p>
      <button
        onClick={onBack}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Helper to format DB date to "YYYY-MM-DD" in local time
const formatToLocalYYYYMMDD = (dateObj) => {
  if (!dateObj) return null;
  return new Date(dateObj).toLocaleDateString('en-CA'); // Uses YYYY-MM-DD format
};

const transformTourData = (tour, selectedDate, quantity) => {
  if (!tour) return null;

  const parsedQuantity = parseInt(quantity) || 1;

  // Find matching date info
  const selectedDateInfo = tour?.tour_dates?.find((tourDate) => {
    const dbDate = new Date(tourDate.date);
    const localFormatted = formatToLocalYYYYMMDD(dbDate);
    return localFormatted === selectedDate;
  });

  // Process inclusions
  const includedItems = tour.tour_inclusions
    ?.filter(item => item.type === 'included')
    .map(item => item.description) || [];

  const notIncludedItems = tour.tour_inclusions
    ?.filter(item => item.type === 'not_included')
    .map(item => item.description) || [];

  return {
    id: tour.id,
    title: tour.title,
    description: tour.description,
    image: tour.main_image_url,
    duration: `${tour.duration} ${tour.duration_type}`,
    meetingPoint: tour.meeting_point,
    startTime: selectedDateInfo?.start_time || tour.default_start_time,
    availableSpots: selectedDateInfo?.available_spots || 0,
    selectedDate,
    quantity: parsedQuantity,
    basePrice: tour.tour_pricing?.price_per_person || 0,
    pricing: {
      ...tour.tour_pricing,
      subtotal: parsedQuantity * (tour.tour_pricing?.price_per_person || 0),
      earlyBirdDiscount: tour.tour_pricing?.early_bird_discount_percentage || 0,
      depositRequired: tour.tour_pricing?.deposit_requirements || 0
    },
    activities: tour.tour_activities?.map(activity => ({
      ...activity,
      duration: `${activity.duration} ${activity.duration_type || 'minutes'}`
    })) || [],
    inclusions: {
      included: includedItems,
      notIncluded: notIncludedItems
    },
    accessibility: tour.tour_accessibility_feature || {},
    difficultyLevel: tour.difficulty_level,
    additionalInfo: tour.additional_info || '',
    cancellationPolicy: tour.tour_pricing?.refund_policy || '',
    maxCapacity: tour.tour_pricing?.max_capacity || 10,
    tourType: tour.tour_type || 'Standard Tour',
    status: tour.status || 'published',
    dateInfo: selectedDateInfo // Pass the full date info
  };
};

const validateCheckoutParams = (date, quantity, maxCapacity = 10) => {
  const errors = [];
  if (!date) {
    errors.push('Date is required');
  } else {
    const isValidDate = !isNaN(Date.parse(date));
    const selectedDateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!isValidDate) {
      errors.push('Invalid date format');
    } else if (selectedDateObj < today) {
      errors.push('Selected date cannot be in the past');
    }
  }

  if (!quantity) {
    errors.push('Quantity is required');
  } else {
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      errors.push('Quantity must be at least 1');
    } else if (parsedQuantity > maxCapacity) {
      errors.push(`Maximum ${maxCapacity} guests allowed`);
    }
  }

  return errors;
};

export default function CheckoutPageWrapper() {
  const router = useRouter();
  const { id, date, quantity } = router.query;
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const { data, loading: isLoading, error: tourError } = useQuery(GET_TOUR_BY_ID, {
    variables: { id },
    skip: !id,
  });

  // Initialize booking hook
  const {
    handleBooking,
    calculateTotal,
    error: bookingHookError,
    isProcessing
  } = useBookTour(data?.tours_by_pk);

  const processBooking = async (formData) => {
    try {
      setIsRedirecting(true);
      setBookingError(null);

      const totalAmount = calculateTotal({
        ...formData,
        participants: parseInt(quantity)
      });

      const bookingResult = await handleBooking({
        ...formData,
        tourId: id,
        participants: parseInt(quantity),
        selectedDate: date,
        totalAmount
      });

      if (bookingResult?.bookingReference) {
        // Successful booking - redirect to payment
        router.push(`/payment/${bookingResult.bookingReference}`);
      } else {
        throw new Error('Failed to create booking - no reference returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setBookingError(error.message || 'Failed to process booking');
      setIsRedirecting(false);
    }
  };

  useEffect(() => {
    if (id && date && quantity && data?.tours_by_pk) {
      const maxCapacity = data.tours_by_pk.tour_pricing?.max_capacity || 10;
      const validationErrors = validateCheckoutParams(date, quantity, maxCapacity);
      if (validationErrors.length > 0) {
        router.replace({
          pathname: '/404',
          query: { error: validationErrors.join(', ') }
        });
      }
    }
  }, [id, date, quantity, data, router]);

  const handleBack = () => {
    if (id) {
      router.push(`/trip/${id}`);
    } else {
      router.push('/');
    }
  };

  // Handle loading state
  if (isLoading || isRedirecting) {
    return <LoadingSpinner />;
  }

  // Handle missing required parameters
  if (!id || !date || !quantity) {
    return (
      <ErrorState 
        message="Missing required booking information. Please try again." 
        onBack={handleBack}
      />
    );
  }

  // Handle errors from tour query or booking process
  const error = tourError || bookingError || bookingHookError;
  if (error) {
    console.error('Error:', error);
    return (
      <ErrorState 
        message={error.message} 
        onBack={handleBack}
      />
    );
  }

  // Handle missing tour data
  if (!data?.tours_by_pk) {
    return (
      <ErrorState 
        message="Tour not found. Please try again." 
        onBack={handleBack}
      />
    );
  }

  const tour = data.tours_by_pk;

  // Handle unpublished tours
  if (tour.status !== 'published') {
    return (
      <ErrorState 
        message="This tour is currently not available for booking." 
        onBack={handleBack}
      />
    );
  }

  const transformedData = transformTourData(tour, date, quantity);

  // Handle insufficient availability
  if (transformedData.availableSpots < parseInt(quantity)) {
    return (
      <ErrorState 
        message={`Sorry, this tour only has ${transformedData.availableSpots} spots available for the selected date.`}
        onBack={handleBack}
      />
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - {transformedData.title}</title>
        <meta name="robots" content="noindex" />
      </Head>
      
      <CheckoutPage 
        tour={transformedData}
        tourData={tour}
        onSubmit={processBooking}
        isProcessing={isProcessing}
        error={bookingError}
        calculateTotal={calculateTotal}
      />
    </>
  );
}