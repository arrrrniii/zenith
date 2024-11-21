import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery } from '@apollo/client';
import { GET_TOUR_BY_ID, GET_SIMILAR_TOURS } from '@/graphql/queries';
import TripDetail from '@/components/client/trips/TripDetail';

const TripPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isSaved, setIsSaved] = useState(false);

  // Fetch main tour data
  const { 
    data: tourData, 
    loading: tourLoading, 
    error: tourError 
  } = useQuery(GET_TOUR_BY_ID, {
    variables: { id },
    skip: !id
  });

  // Fetch similar tours once we have the main tour type
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

  // Check if the trip is saved in localStorage on mount
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

  const tour = tourData?.tours_by_pk;
  
  if (!tour) {
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
          title: tour.title,
          text: tour.description,
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

  const handleBook = (selectedDate) => {
    try {
      const recentActivity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
      recentActivity.unshift({
        type: 'booking_attempt',
        tripId: id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('recentActivity', JSON.stringify(recentActivity.slice(0, 10)));
    } catch (error) {
      console.error('Error storing recent activity:', error);
    }

    router.push(`/checkout/${id}${selectedDate ? `?date=${selectedDate}` : ''}`);
  };

  // Transform tour data for the component
  const transformedTour = {
    id: tour.id,
    title: tour.title,
    description: tour.description,
    images: [tour.main_image_url],
    rating: tour.rating || 0,
    reviews: tour.review_count || 0,
    providedBy: tour.provider_name || 'Tour Provider',
    duration: `${tour.duration} ${tour.duration_type}`,
    price: {
      amount: tour.tour_pricing?.price_per_person,
      currency: 'USD',
      unit: 'per person',
      originalPrice: tour.tour_pricing?.original_price,
      savings: tour.tour_pricing?.early_bird_discount_percentage 
        ? `Save ${tour.tour_pricing.early_bird_discount_percentage}%` 
        : null,
      deposit: tour.tour_pricing?.deposit && {
        amount: tour.tour_pricing.deposit.amount,
        refundable: tour.tour_pricing.deposit.refundable,
        deadline: tour.tour_pricing.deposit.deadline
      }
    },
    details: {
      duration: `${tour.duration} ${tour.duration_type}`,
      groupSize: `Up to ${tour.tour_pricing?.max_capacity} people`,
      ticketType: tour.ticket_type || 'Standard Admission',
      languages: {
        live: tour.languages || ['English']
      },
      features: tour.features || []
    },
    tourType: tour.duration_type === 'days' ? 'multi_day' : 'single_day',
    tourSchedule: {
      startDates: tour.tour_dates.map(date => date.date),
      dailySchedules: tour.tour_dates.map(date => ({
        date: date.date,
        schedule: date.schedule
      }))
    },
    allDatesPath: `/trip/${tour.id}/dates`,
    location: tour.meeting_point,
    categoryName: tour.tour_type,
    tripType: tour.tour_type,
    badges: [
      { type: 'category', text: tour.tour_type },
      ...(tour.badges || [])
    ],
    highlights: tour.highlights || [],
    included: tour.tour_inclusions,
    whatToExpect: tour.what_to_expect,
    departure: {
      location: tour.meeting_point,
      instructions: tour.departure_instructions
    },
    accessibility: {
      wheelchairAccessible: tour.tour_accessibility_feature?.wheelchair_accessible,
      mobilityAid: tour.tour_accessibility_feature?.mobility_aid,
      visualAid: tour.tour_accessibility_feature?.visual_aid,
      hearingAid: tour.tour_accessibility_feature?.hearing_aid,
      serviceAnimals: tour.tour_accessibility_feature?.service_animals,
      minimumAge: tour.tour_accessibility_feature?.minimum_age,
      fitnessLevel: tour.tour_accessibility_feature?.fitness_level,
      notes: tour.tour_accessibility_feature?.notes
    },
    additionalInfo: tour.additional_info,
    cancellation: tour.cancellation_policy,
    faq: tour.faq || [],
    similarTrips: similarToursData?.tours.map(similarTour => ({
      id: similarTour.id,
      title: similarTour.title,
      image: similarTour.main_image_url,
      price: similarTour.tour_pricing?.price_per_person,
      rating: similarTour.rating,
      category: similarTour.tour_type,
      bookings: similarTour.tour_dates_aggregate.aggregate.count
    })) || []
  };

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
            navigationLinks={[]}  // Add your navigation links here
            footerLinks={[]}     // Add your footer links here
            logoUrl=""           // Add your logo URL here
            companyName="Your Tours"
          />
        </main>
      </div>
    </>
  );
};

export default TripPage;