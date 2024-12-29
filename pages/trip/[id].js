import { useState, useEffect } from 'react';
import Head from 'next/head';
import { client } from '@/lib/apollo-client';
import { GET_TOUR_BY_ID, GET_SIMILAR_TOURS } from '@/graphql/queries';
import TripDetail from '@/components/client/trips/TripDetail';

const transformTourData = (tour) => {
  if (!tour) return null;

  // Process schedule (activities)
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

  // Unique start times
  const startTimes = [...new Set(tour.tour_dates
    ?.map(date => date.start_time)
    .filter(Boolean))] || [];

  // Combine main_image_url with gallery images
  let images = [];
  if (tour.main_image_url) {
    images.push(tour.main_image_url);
  }
  if (tour.tour_galleries && tour.tour_galleries.length > 0) {
    images = images.concat(tour.tour_galleries.map(g => g.image_url));
  }

  return {
    id: tour.id,
    title: tour.title || null,
    description: tour.description || null,
    images, // Now includes main image (if any) + gallery images
    rating: tour.rating || 0,
    reviews: tour.review_count || 0,
    providedBy: tour.provider_name || 'Tour Provider',
    duration: `${tour.duration || 0} ${tour.duration_type || 'hours'}`,
    price: {
      amount: tour.tour_pricing?.price_per_person || 0,
      currency: 'USD',
      unit: 'per person',
      originalPrice: tour.tour_pricing?.original_price || null,
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

const TripPage = ({ tourData, similarToursData, error }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (tourData?.id) {
      try {
        const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
        setIsSaved(savedTrips.includes(tourData.id));
      } catch (error) {
        console.error('Error loading saved trips:', error);
      }
    }
  }, [tourData?.id]);

  const handleSave = () => {
    try {
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      const newSavedTrips = isSaved
        ? savedTrips.filter(tripId => tripId !== tourData.id)
        : [...savedTrips, tourData.id];
      
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
          title: tourData.title,
          text: tourData.description,
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
        tripId: tourData.id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('recentActivity', JSON.stringify(recentActivity.slice(0, 10)));
  
      const queryParams = new URLSearchParams();
      if (bookingDetails.selectedDate) queryParams.append('date', bookingDetails.selectedDate);
      if (bookingDetails.quantity) queryParams.append('quantity', bookingDetails.quantity);
  
      const queryString = queryParams.toString();
      window.location.href = `/checkout/${tourData.id}${queryString ? `?${queryString}` : ''}`;
    } catch (error) {
      console.error('Error storing recent activity:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tourData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Experience Not Found</h2>
          <p className="mt-2 text-gray-600">The experience you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${tourData.title} - Your Tours`}</title>
        <meta name="description" content={tourData.description} />
        <meta property="og:title" content={tourData.title} />
        <meta property="og:description" content={tourData.description} />
        <meta property="og:image" content={tourData.images[0]} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/trip/${tourData.id}`} />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <TripDetail
            {...tourData}
            similarTrips={similarToursData || []}
            onSave={handleSave}
            onShare={handleShare}
            onBook={handleBook}
            isSaved={isSaved}
            isLoadingSimilar={false}
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

export async function getServerSideProps({ params }) {
  try {
    const { data: tourResult } = await client.query({
      query: GET_TOUR_BY_ID,
      variables: { id: params.id }
    });

    if (!tourResult?.tours_by_pk) {
      return {
        props: {
          tourData: null
        }
      };
    }

    const transformedTour = transformTourData(tourResult.tours_by_pk);

    const { data: similarToursResult } = await client.query({
      query: GET_SIMILAR_TOURS,
      variables: { 
        tourType: tourResult.tours_by_pk.tour_type,
        currentTourId: params.id
      }
    });

    const similarTours = similarToursResult?.tours.map(similarTour => ({
      id: similarTour.id,
      title: similarTour.title,
      image: similarTour.main_image_url,
      price: similarTour.tour_pricing?.price_per_person || 0,
      rating: similarTour.rating || 0,
      category: similarTour.tour_type || 'Tour',
      bookings: similarTour.tour_dates_aggregate?.aggregate?.count || 0
    })) || [];

    return {
      props: {
        tourData: JSON.parse(JSON.stringify(transformedTour)),
        similarToursData: JSON.parse(JSON.stringify(similarTours))
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        error: 'Failed to load tour data'
      }
    };
  }
}

export default TripPage;
