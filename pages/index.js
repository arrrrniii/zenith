// pages/index.js
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_TOURS, GET_ATTRACTIONS, GET_FEATURED_BLOGS } from '../graphql/queries';
import { CARD_TYPES } from '@/types';
import FourCardSection from '@/components/client/FourCardSection';
import FiveCardSection from '@/components/client/FiveCardSection';
import ThreeCardSection from '@/components/client/ThreeCardSection';
import SearchBlock from '@/components/client/SearchBlock';
import Header from '@/components/client/Header';
import Footer from '@/components/client/Footer';

// Helper functions
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

const transformAttractionData = (attractions) => {
  if (!attractions) return [];
  
  return attractions.map(attraction => ({
    id: attraction.id,
    image: attraction.attraction_images?.[0]?.image_url || '/placeholder.jpg',
    title: attraction.name,
    badge: attraction.status,
    href: `/attractions/${attraction.id}`,
    subtitle: attraction.description?.substring(0, 100) + '...',
    rating: attraction.rating,
    reviewCount: attraction.review_count,
    description: attraction.description,
    price: attraction.price_range,
    categories: attraction.attraction_categories?.map(cat => cat.category.name) || [],
  }));
};

const transformBlogData = (blogs) => {
  if (!blogs) return [];
  
  return blogs.map(blog => ({
    id: blog.id,
    image: blog.thumbnail_url || '/blog-placeholder.jpg',
    title: blog.title,
    href: `/blog/${blog.slug}`,
    subtitle: blog.description?.substring(0, 100) + '...',
    badge: blog.category,
    status: blog.status,
    publishedAt: blog.published_at,
  }));
};

const HomePage = () => {
  // Fetch featured tours
  const { data: toursData, loading: toursLoading, error: toursError } = useQuery(GET_FEATURED_TOURS, {
    variables: {
      limit: 4,
      where: {
        status: { _eq: "published" },
        tour_dates: { date: { _gte: "now()" } }
      }
    }
  });

  // Fetch attractions
  const { 
    data: attractionsData, 
    loading: attractionsLoading, 
    error: attractionsError 
  } = useQuery(GET_ATTRACTIONS, {
    variables: {
      limit: 5,
      where: { status: { _eq: "open" } }
    }
  });

  // Fetch blogs
  const { 
    data: blogsData, 
    loading: blogsLoading, 
    error: blogsError 
  } = useQuery(GET_FEATURED_BLOGS, {
    variables: {
      limit: 3,
      where: { 
        status: { _eq: "PUBLISHED" }
      }
    }
  });

  // Transform data
  const tours = React.useMemo(() => 
    transformTourData(toursData?.tours),
    [toursData]
  );

  const attractions = React.useMemo(() => 
    transformAttractionData(attractionsData?.attractions),
    [attractionsData]
  );

  const blogs = React.useMemo(() => 
    transformBlogData(blogsData?.blogs),
    [blogsData]
  );

  // Loading state
  if (toursLoading || attractionsLoading || blogsLoading) {
    return (
      <div className="space-y-12 mx-10 lg:mx-20 2xl:mx-[20vw]">
        <Header />
        <SearchBlock />
        {[1, 2, 3].map((section) => (
          <div key={section} className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  const hasError = toursError || attractionsError || blogsError;
  if (hasError) {
    console.error('Error loading content:', { toursError, attractionsError, blogsError });
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Content
          </h3>
          <p className="text-sm text-red-600">
            We encountered an error while loading the content. Please try again later.
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
      {tours.length > 0 && (
        <FourCardSection
          title="Popular Tours"
          subtitle="Discover our most booked experiences"
          items={tours}
          cardType={CARD_TYPES.MEDIA_DETAIL}
          loading={toursLoading}
          error={toursError}
        />
      )}

      {/* Destination Spotlight Section */}
      {attractions.length > 0 && (
        <FiveCardSection
          title="Destination Spotlight"
          subtitle="Discover our most popular destinations"
          items={attractions}
          cardType={CARD_TYPES.MEDIA_DETAIL}
          loading={attractionsLoading}
          error={attractionsError}
        />
      )}

      {/* Featured Blog Posts Section */}
      {blogs.length > 0 && (
        <ThreeCardSection
          title="Travel Stories"
          subtitle="Expert guides and travel inspiration"
          items={blogs}
          cardType={CARD_TYPES.COLLECTION_PREVIEW}
          loading={blogsLoading}
          error={blogsError}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default HomePage;