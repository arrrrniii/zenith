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
const formatToLocalYYYYMMDD = (dateObj) => dateObj.toLocaleDateString('en-CA');

const transformTourData = (tour, selectedDate, quantity) => {
  if (!tour) return null;

  const parsedQuantity = parseInt(quantity) || 1;

  // Debug logs
  console.log("Selected date param =>", selectedDate);
  console.log("All DB dates =>", tour?.tour_dates?.map(d => d.date));

  // Attempt to find a matching date
  const selectedDateInfo = tour?.tour_dates?.find((tourDate) => {
    const dbDate = new Date(tourDate.date);
    const localFormatted = formatToLocalYYYYMMDD(dbDate);

    console.log("[DEBUG] Comparing:", {
      rawDBDate: tourDate.date,
      localFormatted,
      selectedDate,
    });

    return localFormatted === selectedDate;
  });

  console.log("selectedDateInfo =>", selectedDateInfo);

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
    status: tour.status || 'published'
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

  // NOTE: If removing `where: { date: { _gte: "now()" } }` helps,
  // that means your date is not recognized as future by Hasura. 
  // Use the version below to see ALL tour_dates for debugging:
  const { data, loading: isLoading, error: tourError } = useQuery(GET_TOUR_BY_ID, {
    variables: { id },
    skip: !id,
    // fetchPolicy: 'no-cache' // (optional) to ensure fresh data
  });

  // Initialize booking hook
  const {
    handleBooking,
    calculateTotal,
    error: bookingError,
    isProcessing
  } = useBookTour(data?.tours_by_pk, date);

  const processBooking = async (formData) => {
    try {
      setIsRedirecting(true);
      await handleBooking({
        ...formData,
        participants: parseInt(quantity)
      });
    } catch (error) {
      console.error('Checkout error:', error);
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

  if (isLoading || isRedirecting) {
    return <LoadingSpinner />;
  }

  if (!id || !date || !quantity) {
    return (
      <ErrorState 
        message="Missing required booking information. Please try again." 
        onBack={handleBack}
      />
    );
  }

  if (tourError || bookingError) {
    console.error('Error:', tourError || bookingError);
    return (
      <ErrorState 
        message={(tourError || bookingError)?.message} 
        onBack={handleBack}
      />
    );
  }

  if (!data?.tours_by_pk) {
    return (
      <ErrorState 
        message="Tour not found. Please try again." 
        onBack={handleBack}
      />
    );
  }

  const tour = data.tours_by_pk;

  if (tour.status !== 'published') {
    return (
      <ErrorState 
        message="This tour is currently not available for booking." 
        onBack={handleBack}
      />
    );
  }

  const transformedData = transformTourData(tour, date, quantity);

  // If the date was found but availableSpots is < needed participants
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
