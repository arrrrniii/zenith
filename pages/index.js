// pages/index.js
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_TOURS, GET_UPCOMING_TOURS } from '../graphql/queries';
import { CARD_TYPES } from '@/types';
import FourCardSection from '@/components/client/FourCardSection';
import FiveCardSection from '@/components/client/FiveCardSection';
import ThreeCardSection from '@/components/client/ThreeCardSection';
import SearchBlock from '@/components/client/SearchBlock';
import Header from '@/components/client/Header';
import Footer from '@/components/client/Footer';

// Helper functions outside the component
const calculateDiscountedPrice = (price, discountPercentage) => {
  if (!price || !discountPercentage) return null;
  return price * (1 - discountPercentage / 100);
};

const transformTourData = (tours) => {
  if (!tours) return [];
  
  return tours.map(tour => ({
    id: tour.id,
    image: tour.main_image_url || '/caption.jpg',
    title: tour.title,
    badge: tour.tour_type,
    href: `/trip/${tour.id}`,
    subtitle: `${tour.duration} ${tour.duration_type}`,
    price: tour.tour_pricing?.price_per_person,
    discountedPrice: calculateDiscountedPrice(
      tour.tour_pricing?.price_per_person,
      tour.tour_pricing?.early_bird_discount_percentage
    ),
    bookings: tour.tour_dates_aggregate.aggregate.count,
    difficulty: tour.difficulty_level,
    nextAvailableDate: tour.tour_dates?.[0]?.date,
    highlights: tour.tour_inclusions?.slice(0, 3).map(inc => inc.description) || [],
    activities: tour.tour_activities?.length || 0,
  }));
};

const YourPage = () => {
  // Fetch featured tours
  const { data: toursData, loading: toursLoading, error: toursError } = useQuery(GET_FEATURED_TOURS, {
    variables: {
      limit: 12,
      where: {
        status: { _eq: "active" },
        tour_dates: { date: { _gte: "now()" } }
      }
    }
  });

  // Transform tours data for the card component
  const transformedTourItems = React.useMemo(() => 
    transformTourData(toursData?.tours),
    [toursData]
  );

  // Loading state
  if (toursLoading) {
    return (
      <div className="space-y-12 mx-10 lg:mx-20 2xl:mx-[20vw]">
        <Header />
        <SearchBlock />
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (toursError) {
    console.error('Error loading tours:', toursError);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Tours
          </h3>
          <p className="text-sm text-red-600">
            We encountered an error while loading the tours. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 mx-10 lg:mx-20 2xl:mx-[20vw]">
      <Header />
      <SearchBlock/>
      
      {/* Popular Tours Section */}
      <FourCardSection
        title="Popular Tours"
        subtitle="Discover our most booked experiences"
        items={transformedTourItems}
        cardType={CARD_TYPES.MEDIA_DETAIL}
        loading={toursLoading}
        error={toursError}
      />

      {/* Destination Spotlight Section */}
      {transformedTourItems.length > 4 && (
        <FiveCardSection
          title="Destination Spotlight"
          subtitle="Discover our most popular destinations"
          items={transformedTourItems.slice(4, 9)}
          cardType={CARD_TYPES.MEDIA_DETAIL}
        />
      )}

      {/* Featured Guides Section */}
      {transformedTourItems.length > 9 && (
        <ThreeCardSection
          title="Featured Guides"
          subtitle="Expert-curated tours for unforgettable experiences"
          items={transformedTourItems.slice(9, 12)}
          cardType={CARD_TYPES.COLLECTION_PREVIEW}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default YourPage;