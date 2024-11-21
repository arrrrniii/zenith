// pages/attractions/[id].js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AttractionDetail from '@/components/client/attractions/AttractionDetail';
import Header from '@/components/client/Header';
import Footer from '@/components/client/Footer';

// Mock data for related sections
const mockRelatedAttractions = {
  'chicago-riverwalk': [
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Millennium Park',
      subtitle: 'Home of Cloud Gate & Crown Fountain',
      rating: 4.8,
      reviews: '5,678',
      category: 'Parks',
      href: '/attractions/millennium-park',
    },
    {
      id: 2,
      image: '/caption.jpg',
      title: 'Navy Pier',
      subtitle: 'Historic pier with dining & entertainment',
      rating: 4.6,
      reviews: '4,892',
      category: 'Piers & Boardwalks',
      href: '/attractions/navy-pier',
    },
    {
      id: 3,
      image: '/caption.jpg',
      title: 'Magnificent Mile',
      subtitle: 'Upscale shopping & dining district',
      rating: 4.7,
      reviews: '3,456',
      category: 'Points of Interest',
      href: '/attractions/magnificent-mile',
    },
    {
      id: 4,
      image: '/caption.jpg',
      title: 'Grant Park',
      subtitle: 'Large urban park with fountains',
      rating: 4.5,
      reviews: '2,789',
      category: 'Parks',
      href: '/attractions/grant-park',
    }
  ],
  'millennium-park': [
    // Similar structure for Millennium Park related attractions
  ]
};

const mockNearbyRestaurants = {
  'chicago-riverwalk': [
    {
      id: 1,
      image: '/caption.jpg',
      title: 'River Roast',
      subtitle: 'Contemporary American cuisine',
      rating: 4.6,
      reviews: '2,345',
      category: 'American',
      href: '/restaurants/river-roast',
      price: '$$$',
    },
    {
      id: 2,
      image: '/caption.jpg',
      title: 'Chicago Cut Steakhouse',
      subtitle: 'Premium steaks with river views',
      rating: 4.8,
      reviews: '3,121',
      category: 'Steakhouse',
      href: '/restaurants/chicago-cut',
      price: '$$$$',
    },
    {
      id: 3,
      image: '/caption.jpg',
      title: 'Beat Kitchen on the Riverwalk',
      subtitle: 'Casual dining with live music',
      rating: 4.4,
      reviews: '1,567',
      category: 'American',
      href: '/restaurants/beat-kitchen',
      price: '$$',
    },
    {
      id: 4,
      image: '/caption.jpg',
      title: "O'Brien's Riverwalk Cafe",
      subtitle: 'Waterfront cafe & bar',
      rating: 4.3,
      reviews: '987',
      category: 'Cafe',
      href: '/restaurants/obriens',
      price: '$$',
    }
  ],
  'millennium-park': [
    // Similar structure for Millennium Park nearby restaurants
  ]
};

const mockPopularGuides = {
  'chicago-riverwalk': [
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Perfect Weekend in Chicago',
      author: 'John D',
      itemCount: 25,
      href: '/guides/chicago-weekend',
      saves: '3.2K',
    },
    {
      id: 2,
      image: '/caption.jpg',
      title: 'Chicago Architecture Tour',
      author: 'Sarah M',
      itemCount: 18,
      href: '/guides/chicago-architecture',
      saves: '2.8K',
    },
    {
      id: 3,
      image: '/caption.jpg',
      title: 'Chicago with Kids',
      author: 'Mike R',
      itemCount: 15,
      href: '/guides/chicago-kids',
      saves: '1.5K',
    },
    {
      id: 4,
      image: '/caption.jpg',
      title: 'Chicago Food Guide',
      author: 'Emily W',
      itemCount: 22,
      href: '/guides/chicago-food',
      saves: '4.1K',
    }
  ],
  'millennium-park': [
    // Similar structure for Millennium Park guides
  ]
};

// Static data for attractions
const attractionsData = {
  'chicago-riverwalk': {
    title: "Chicago Riverwalk",
    rating: 4.5,
    totalReviews: 3134,
    description: "Located on the south bank of the Chicago River, this bustling urban space is filled with public art, museums, water activities, and more. The Riverwalk is a 1.25-mile pedestrian waterfront, offering some of the best views of Chicago's architecture and vibrant city life. Featuring restaurants, boat tours, kayak rentals, and wine bars, it's perfect for both daytime exploration and evening entertainment.",
    duration: "1-2 hours",
    price: "Free entry",
    category: "Historic Walking Areas",
    location: "Chicago, Illinois",
    images: [
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg"
    ],
    features: [
      "Scenic walking paths",
      "Outdoor dining",
      "Boat tours",
      "Public art installations",
      "Kayak rentals",
      "Architecture views"
    ],
    bestTimeToVisit: "Spring through Fall",
    tips: [
      "Visit during sunset for the best photos",
      "Book boat tours in advance during peak season",
      "Check the event calendar for special programming"
    ]
  },
  'millennium-park': {
    title: "Millennium Park",
    rating: 4.8,
    totalReviews: 5678,
    description: "A state-of-the-art collection of architecture, landscape design and art that provides the backdrop for hundreds of cultural programs. Home to Cloud Gate (The Bean), Crown Fountain, and Lurie Garden. The park hosts various events throughout the year, including free concerts at the Jay Pritzker Pavilion and winter ice skating.",
    duration: "2-3 hours",
    price: "Free entry",
    category: "Parks",
    location: "Chicago, Illinois",
    images: [
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg"
    ],
    features: [
      "Cloud Gate sculpture",
      "Crown Fountain",
      "Lurie Garden",
      "Jay Pritzker Pavilion",
      "Ice rink (seasonal)",
      "Public art"
    ],
    bestTimeToVisit: "Year-round",
    tips: [
      "Visit early morning for fewer crowds",
      "Check concert schedule in summer",
      "Bring ice skates in winter to save on rentals"
    ]
  },
  'navy-pier': {
    title: "Navy Pier",
    rating: 4.6,
    totalReviews: 4892,
    description: "Historic pier on Lake Michigan featuring restaurants, shops, boat tours, and the iconic Centennial Wheel. Popular destination for families with children's museum, funhouse maze, and seasonal events.",
    duration: "3-4 hours",
    price: "Free entry (attractions vary)",
    category: "Piers & Boardwalks",
    location: "Chicago, Illinois",
    images: [
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg",
      "/caption.jpg"
    ],
    features: [
      "Centennial Wheel",
      "Chicago Children's Museum",
      "IMAX Theater",
      "Boat tours",
      "Dining options",
      "Fireworks (seasonal)"
    ],
    bestTimeToVisit: "Summer months",
    tips: [
      "Buy attraction passes online",
      "Visit on weekdays to avoid crowds",
      "Stay for evening fireworks in summer"
    ]
  }
};

const AttractionPage = ({ attractionData }) => {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Handle loading state
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Handle 404
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

  // Get related data based on current attraction ID
  const id = router.query.id;
  const relatedAttractions = mockRelatedAttractions[id] || [];
  const nearbyRestaurants = mockNearbyRestaurants[id] || [];
  const popularGuides = mockPopularGuides[id] || [];

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
          relatedAttractions={relatedAttractions}
          nearbyRestaurants={nearbyRestaurants}
          popularGuides={popularGuides}
        />
      </main>
      <Footer />
    </div>
  );
};

export async function getStaticPaths() {
  const paths = Object.keys(attractionsData).map((id) => ({
    params: { id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  try {
    const attractionData = attractionsData[params.id];

    if (!attractionData) {
      return { notFound: true };
    }

    return {
      props: {
        attractionData,
      },
      revalidate: 3600,
    };
  } catch (error) {
    return { notFound: true };
  }
}

export default AttractionPage;