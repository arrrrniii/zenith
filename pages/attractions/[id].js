import React, { useState } from 'react';
import { client } from '@/lib/apollo-client';
import { GET_ATTRACTION } from '@/components/dashboard/attractions/graphql/operations';
import AttractionDetail from '@/components/client/attractions/AttractionDetail';
import Header from '@/components/client/Header';
import Footer from '@/components/client/Footer';

const AttractionPage = ({ attractionData, error }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  if (error) {
    return <div>Error loading attraction</div>;
  }

  if (!attractionData) {
    return <div>Attraction not found</div>;
  }

  const handleNextImage = () => {
    setActiveImage((prev) => (prev + 1) % attractionData.images.length);
  };

  const handlePreviousImage = () => {
    setActiveImage((prev) => (prev - 1 + attractionData.images.length) % attractionData.images.length);
  };

  const handleImageSelect = (index) => {
    setActiveImage(index);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    console.log('Sharing:', attractionData.title);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <AttractionDetail
          {...attractionData}
          activeImage={activeImage}
          onNextImage={handleNextImage}
          onPreviousImage={handlePreviousImage}
          onImageSelect={handleImageSelect}
          onSave={handleSave}
          onShare={handleShare}
          isSaved={isSaved}
          relatedAttractions={[]}
          nearbyRestaurants={[]}
          popularGuides={[]}
        />
      </main>
      <Footer />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const { data, error } = await client.query({
      query: GET_ATTRACTION,
      variables: { id: parseInt(params.id) },
    });

    if (error) {
      return {
        props: {
          error: error.message,
        },
      };
    }

    if (!data?.attractions_by_pk) {
      return {
        props: {
          attractionData: null,
        },
      };
    }

    const attraction = data.attractions_by_pk;
    
    // Transform the data and ensure no undefined values
    const attractionData = {
      title: attraction.name || null,
      rating: attraction.rating || null,
      totalReviews: attraction.review_count || 0,
      description: attraction.description || null,
      duration: attraction.duration || null,
      price: attraction.price_range || null,
      category: attraction.attraction_categories?.[0]?.category?.name || null,
      location: attraction.city && attraction.country ? 
        `${attraction.city}, ${attraction.country}` : null,
      images: attraction.attraction_images?.map(img => img.image_url) || [],
      features: attraction.features || [],
      bestTimeToVisit: attraction.best_time_to_visit || null,
      tips: attraction.tips || [],
      // Add any other fields that AttractionDetail component expects
    };

    // Ensure all values are serializable
    const serializedData = JSON.parse(JSON.stringify(attractionData));

    return {
      props: {
        attractionData: serializedData,
      },
    };
  } catch (error) {
    console.error('Error fetching attraction:', error);
    return {
      props: {
        error: 'Failed to fetch attraction data',
      },
    };
  }
}

export default AttractionPage;