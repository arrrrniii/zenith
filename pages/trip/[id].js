//pages/trip/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { GET_TOUR_BY_ID, GET_SIMILAR_TOURS } from '@/graphql/queries';
import TripDetail from '@/components/client/trips/TripDetail';

const transformTourData = (tour) => {
  if (!tour) return null;

  // Process tour activities into schedule
  const schedule = tour.tour_activities?.map(activity => ({
    time: activity.duration,
    activity: activity.title,
    details: activity.description,
    location: activity.location
  })) || [];

  // Process inclusions
  const includedItems = tour.tour_inclusions
    ?.filter(item => item.type === 'included')
    .map(item => item.description) || [];

  const notIncludedItems = tour.tour_inclusions
    ?.filter(item => item.type === 'not_included')
    .map(item => item.description) || [];

  // Format tour dates
  const availableDates = tour.tour_dates
    ?.filter(date => new Date(date.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date)) || [];

  // Get unique start times
  const startTimes = [...new Set(tour.tour_dates
    ?.map(date => date.start_time)
    .filter(Boolean))] || [];

  return {
    id: tour.id,
    title: tour.title,
    description: tour.description,
    images: tour.main_image_url ? [tour.main_image_url] : [],
    rating: tour.rating || 0,
    reviews: tour.review_count || 0,
    providedBy: tour.provider_name || 'Tour Provider',
    duration: `${tour.duration || 0} ${tour.duration_type || 'hours'}`,
    price: {
      amount: tour.tour_pricing?.price_per_person || 0,
      currency: 'USD',
      unit: 'per person',
      originalPrice: tour.tour_pricing?.original_price,
      savings: tour.tour_pricing?.early_bird_discount_percentage 
        ? `Save ${tour.tour_pricing.early_bird_discount_percentage}%` 
        : null,
      deposit: tour.tour_pricing?.deposit_requirements ? {
        amount: parseFloat(tour.tour_pricing.deposit_requirements),
        refundable: true,
        deadline: '24 hours before start'
      } : null
    },
    details: {
      duration: `${tour.duration || 0} ${tour.duration_type || 'hours'}`,
      groupSize: tour.tour_pricing?.max_capacity 
        ? `Up to ${tour.tour_pricing.max_capacity} people`
        : 'Standard group size',
      ticketType: tour.ticket_type || 'Standard Admission',
      languages: {
        live: ['English'],
        audioGuide: [],
        written: []
      },
      features: tour.features || []
    },
    tourType: tour.duration_type === 'days' ? 'multi_day' : 'single_day',
    tourSchedule: {
      startDates: availableDates.map(date => date.date),
      dailySchedules: schedule
    },
    allDatesPath: `/trip/${tour.id}/dates`,
    location: tour.meeting_point || 'Meeting point will be provided',
    categoryName: tour.tour_type || 'Tour',
    tripType: tour.tour_type || 'Experience',
    badges: [
      { type: 'category', text: tour.tour_type || 'Tour' },
      ...(tour.tour_pricing?.early_bird_discount_percentage ? [
        { type: 'special', text: `${tour.tour_pricing.early_bird_discount_percentage}% Off` }
      ] : [])
    ],
    highlights: tour.tour_activities
      ?.map(activity => activity.title)
      .slice(0, 5) || [],
    included: {
      included: includedItems,
      notIncluded: notIncludedItems
    },
    whatToExpect: {
      schedule,
      groupSize: tour.tour_pricing?.max_capacity 
        ? `Up to ${tour.tour_pricing.max_capacity} people`
        : 'Standard group size'
    },
    departure: {
      duration: `${tour.duration || 0} ${tour.duration_type || 'hours'}`,
      point: tour.meeting_point || 'Meeting point will be provided',
      directions: tour.departure_instructions || '',
      startTimes
    },
    accessibility: tour.tour_accessibility_feature ? {
      wheelchairAccessible: tour.tour_accessibility_feature.wheelchair_accessible || false,
      mobilityAid: tour.tour_accessibility_feature.mobility_aid || false,
      visualAid: tour.tour_accessibility_feature.visual_aid || false,
      hearingAid: tour.tour_accessibility_feature.hearing_aid || false,
      serviceAnimals: tour.tour_accessibility_feature.service_animals || false,
      minimumAge: tour.tour_accessibility_feature.minimum_age || null,
      fitnessLevel: tour.tour_accessibility_feature.fitness_level || 'moderate',
      notes: tour.tour_accessibility_feature.notes || ''
    } : {},
    additionalInfo: tour.additional_info || '',
    cancellation: {
      policy: tour.tour_pricing?.refund_policy || 'Standard cancellation policy applies',
      refundPolicy: 'Full refund if cancelled 24 hours before start time',
      noRefundPolicy: 'No refunds for cancellations made less than 24 hours before start time'
    },
    faq: tour.faq || []
  };
};

const TripPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isSaved, setIsSaved] = useState(false);

  const { 
    data: tourData, 
    loading: tourLoading, 
    error: tourError 
  } = useQuery(GET_TOUR_BY_ID, {
    variables: { id },
    skip: !id
  });

  const { 
    data: similarToursData, 
    loading: similarToursLoading 
  } = useQuery(GET_SIMILAR_TOURS, {
    variables: { 
      tourType: tourData?.tours_by_pk?.tour_type || '',
      currentTourId: id
    },
    skip: !tourData?.tours_by_pk?.tour_type
  });

  useEffect(() => {
    if (id) {
      try {
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
        setIsSaved(savedTrips.includes(id));
      } catch (error) {
        console.error('Error loading saved trips:', error);
      }
    }
  }, [id]);

  const handleSave = () => {
    try {
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      const newSavedTrips = isSaved
        ? savedTrips.filter(tripId => tripId !== id)
        : [...savedTrips, id];
      
      localStorage.setItem('savedTrips', JSON.stringify(newSavedTrips));
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: tourData?.tours_by_pk?.title,
          text: tourData?.tours_by_pk?.description,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBook = (bookingDetails) => {
    try {
      const recentActivity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
      recentActivity.unshift({
        type: 'booking_attempt',
        tripId: id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('recentActivity', JSON.stringify(recentActivity.slice(0, 10)));
  
      // Construct query parameters
      const queryParams = new URLSearchParams();
      
      // Add date if available
      if (bookingDetails.selectedDate) {
        queryParams.append('date', bookingDetails.selectedDate);
      }
      
      // Add quantity if available
      if (bookingDetails.quantity) {
        queryParams.append('quantity', bookingDetails.quantity);
      }
  
      // Construct the URL
      const queryString = queryParams.toString();
      const url = `/checkout/${id}${queryString ? `?${queryString}` : ''}`;
  
      router.push(url);
    } catch (error) {
      console.error('Error storing recent activity:', error);
    }
  };

  if (tourLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experience details...</p>
        </div>
      </div>
    );
  }

  if (tourError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{tourError.message}</p>
          <button 
            onClick={() => router.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const transformedTour = transformTourData(tourData?.tours_by_pk);

  if (!transformedTour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Experience Not Found</h2>
          <p className="mt-2 text-gray-600">The experience you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Add similar tours to the transformed data
  transformedTour.similarTrips = similarToursData?.tours.map(similarTour => ({
    id: similarTour.id,
    title: similarTour.title,
    image: similarTour.main_image_url,
    price: similarTour.tour_pricing?.price_per_person,
    rating: similarTour.rating,
    category: similarTour.tour_type,
    bookings: similarTour.tour_dates_aggregate.aggregate.count
  })) || [];

  return (
    <>
      <Head>
        <title>{`${transformedTour.title} - Your Tours`}</title>
        <meta name="description" content={transformedTour.description} />
        <meta property="og:title" content={transformedTour.title} />
        <meta property="og:description" content={transformedTour.description} />
        <meta property="og:image" content={transformedTour.images[0]} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/trip/${id}`} />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <TripDetail
            {...transformedTour}
            onSave={handleSave}
            onShare={handleShare}
            onBook={handleBook}
            isSaved={isSaved}
            isLoadingSimilar={similarToursLoading}
            navigationLinks={[]}
            footerLinks={[]}
            logoUrl=""
            companyName="Your Tours"
          />
        </main>
      </div>
    </>
  );
};

export default TripPage;