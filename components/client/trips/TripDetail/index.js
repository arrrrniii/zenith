import React from 'react';
import { Share2, Heart } from 'lucide-react';
import ImageGallery from './ImageGallery';
import TripHighlights from './TripHighlights';
import BookingCard from './BookingCard';
import TripInfo from './TripInfo';

import StatusBadge from './StatusBadge';
import Header from '@/components/client/Header';
import Footer from '@/components/client/Footer';

import FourCardSection from '@/components/client/FourCardSection';
import { CARD_TYPES } from '@/types';

const TripDetail = ({
  title,
  rating,
  reviews,
  providedBy,
  images = [],
  description,
  price,
  badges = [],
  highlights = [],
  details,
  included,
  whatToExpect,
  departure,
  accessibility,
  additionalInfo,
  cancellation,
  faq,
  similarTrips = [],
  onSave,
  onShare,
  onBook,
  isSaved,
  // New props for similar trips section
  categoryName = '',
  location = '',
  tripType = '',
  // New props for header/footer
  navigationLinks = [],
  footerLinks = [],
  logoUrl = '',
  companyName = '',
}) => {
  // Function to generate dynamic similar trips section text
  const getSimilarTripsContent = () => {
    const parts = [];
    
    if (categoryName) parts.push(categoryName);
    if (location) parts.push(`in ${location}`);
    if (tripType) parts.push(`${tripType} experiences`);
    
    const title = parts.length > 0 
      ? `Similar ${parts.join(' ')}`
      : 'Similar Experiences';
      
    const subtitle = parts.length > 0
      ? `Discover more ${parts.join(' ').toLowerCase()}`
      : 'Discover more tours and activities like this one';
      
    return { title, subtitle };
  };

  const similarTripsContent = getSimilarTripsContent();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header 
        navigationLinks={navigationLinks}
        logoUrl={logoUrl}
        companyName={companyName}
      />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-white z-50 px-4 py-3 border-b">
        <h1 className="text-xl font-bold truncate">{title}</h1>
      </div>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-6">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {badges.map((badge, index) => (
                <StatusBadge key={index} type={badge.type} text={badge.text} />
              ))}
            </div>

            {/* Title Section */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-4 w-4 rounded-sm ${
                            i < Math.floor(rating) ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{reviews} reviews</span>
                  </div>
                  <span>By {providedBy}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Heart 
                    className={`w-5 h-5 ${isSaved ? 'fill-current text-red-500' : ''}`} 
                  />
                  <span className="hidden md:inline">Save</span>
                </button>
                <button
                  onClick={onShare}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden md:inline">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="mb-8">
                <ImageGallery images={images} title={title} />
              </div>

              {/* Description */}
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700">{description}</p>
              </div>

              {/* Highlights */}
              <TripHighlights highlights={highlights} />

              {/* Trip Information */}
              <div className="mt-8">
                <TripInfo
                  description={description}
                  highlights={highlights}
                  included={included}
                  whatToExpect={whatToExpect}
                  departure={departure}
                  accessibility={accessibility}
                  additionalInfo={additionalInfo}
                  cancellation={cancellation}
                  faq={faq}
                />
              </div>
            </div>

            {/* Right Column */}
            <div>
              <BookingCard
                price={price}
                details={details}
                onBook={onBook}
              />
            </div>
          </div>
        </div>

        {/* Similar Trips */}

        <div className="py-12 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 lg:px-8">
      <FourCardSection
            title="Related Attractions"
            subtitle="More places to explore nearby"
            items={similarTrips}
            cardType={CARD_TYPES.MEDIA_DETAIL}
          />

      </div>
    </div>

    <div className="py-12 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 lg:px-8">
      <FourCardSection
            title="Related Attractions"
            subtitle="More places to explore nearby"
            items={similarTrips}
            cardType={CARD_TYPES.MEDIA_DETAIL}
          />

      </div>
    </div>
      

    <div className="py-12 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 lg:px-8">
      <FourCardSection
            title="Related Attractions"
            subtitle="More places to explore nearby"
            items={similarTrips}
            cardType={CARD_TYPES.MEDIA_DETAIL}
          />

      </div>
    </div>
      
      
      </main>

      {/* Footer */}
      <Footer 
        links={footerLinks}
        companyName={companyName}
      />
    </div>
  );
};

export default TripDetail;