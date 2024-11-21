// pages/index.js

import React from 'react';
import { CARD_TYPES } from '@/types';
import FourCardSection from '@/components/client/FourCardSection';
import FiveCardSection from '@/components/client/FiveCardSection';
import ThreeCardSection from '@/components/client/ThreeCardSection';
import SearchBlock from '@/components/client/SearchBlock';
import Header from '@/components/client/Header';
import Footer from '@/components/client/Footer';


const YourPage = () => {
  // Dining categories section
  const diningItems = [
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Fine Dining',
      badge: '2024',
      href: '/categories/fine-dining',
    },

    // ... more items
  ];

  // Chicago attractions section
  const attractionItems = [
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Chicago Riverwalk',
      subtitle: 'Explore the scenic Chicago Riverwalk.',
      rating: 4.5,
      reviews: '3,137',
      category: 'Historic Walking Areas',
      href: '/attractions/chicago-riverwalk',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Chicago Riverwalk',
      subtitle: 'Explore the scenic Chicago Riverwalk.',
      rating: 4.5,
      reviews: '3,137',
      category: 'Historic Walking Areas',
      href: '/attractions/chicago-riverwalk',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Chicago Riverwalk',
      subtitle: 'Explore the scenic Chicago Riverwalk.',
      rating: 4.5,
      reviews: '3,137',
      category: 'Historic Walking Areas',
      href: '/attractions/chicago-riverwalk',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Chicago Riverwalk',
      subtitle: 'Explore the scenic Chicago Riverwalk.',
      rating: 4.5,
      reviews: '3,137',
      category: 'Historic Walking Areas',
      href: '/attractions/chicago-riverwalk',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Chicago Riverwalk',
      subtitle: 'Explore the scenic Chicago Riverwalk.',
      rating: 4.5,
      reviews: '3,137',
      category: 'Historic Walking Areas',
      href: '/attractions/chicago-riverwalk',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Chicago Riverwalk',
      subtitle: 'Explore the scenic Chicago Riverwalk.',
      rating: 4.5,
      reviews: '3,137',
      category: 'Historic Walking Areas',
      href: '/attractions/chicago-riverwalk',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Chicago Riverwalk',
      subtitle: 'Explore the scenic Chicago Riverwalk.',
      rating: 4.5,
      reviews: '3,137',
      category: 'Historic Walking Areas',
      href: '/attractions/chicago-riverwalk',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Chicago Riverwalk',
      subtitle: 'Explore the scenic Chicago Riverwalk.',
      rating: 4.5,
      reviews: '3,137',
      category: 'Historic Walking Areas',
      href: '/attractions/chicago-riverwalk',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: 'Chicago Riverwalk',
      subtitle: 'Explore the scenic Chicago Riverwalk.',
      rating: 4.5,
      reviews: '3,137',
      category: 'Historic Walking Areas',
      href: '/attractions/chicago-riverwalk',
    },

    // ... more items
  ];

  // Travel trip section
  const guideItems = [
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    {
      id: 1,
      image: '/caption.jpg',
      title: '3 Family-Friendly Days in Rome',
      author: 'Ashlyn S',
      itemCount: 30,
      href: '/trip/rome-family-trip',
    },
    // ... more items
  ];

  return (
    <div className="space-y-12 mx-10 lg:mx-20 2xl:mx-[20vw]">
      <Header />
      <SearchBlock/>
      {/* Dining Categories - Four cards with image overlay */}
      <FourCardSection
        title="Popular Categories"
        items={diningItems}
        cardType={CARD_TYPES.MEDIA_DETAIL}
      />

      {/* Chicago Attractions - Five cards with detailed info */}
      <FiveCardSection
        title="Destination Spotlight: Chicago"
        subtitle="Discover why Chicago ranks among our 2024 Travelers' Choice Best of the Best Destinations."
        items={attractionItems}
        cardType={CARD_TYPES.MEDIA_DETAIL}
      />

      {/* Travel trip - Three cards with collection preview */}
      <ThreeCardSection
        title="Get Inspired by Our Fave Travel Creators"
        subtitle="Tried-and-true guidance to fuel your next big trip."
        items={guideItems}
        cardType={CARD_TYPES.COLLECTION_PREVIEW}
      />
            <Footer />

    </div>
  );
};

export default YourPage;
