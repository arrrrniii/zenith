import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Clock, DollarSign, MapPin, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import FourCardSection from '@/components/client/FourCardSection';
import { CARD_TYPES } from '@/types';

const AttractionDetail = ({ 
  // Data props
  title,
  rating,
  totalReviews,
  description,
  duration,
  price,
  category,
  images,
  location,
  relatedAttractions,
  nearbyRestaurants,
  popularGuides,
  // State props
  activeImage,
  // Action props
  onNextImage,
  onPreviousImage,
  onImageSelect,
  onSave,
  onShare,
  // Optional UI state
  isSaved = false
}) => {
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`h-3 w-3 md:h-4 md:w-4 rounded-sm ${
            i < fullStars 
              ? 'bg-green-500' 
              : i === fullStars && hasHalfStar 
                ? 'bg-gradient-to-r from-green-500 to-gray-300'
                : 'bg-gray-300'
          }`} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header - Fixed at top */}
        <div className="lg:hidden related top-0 left-0 right-0 bg-white z-50 px-4 py-3 border-b">
          <h1 className="text-xl font-bold truncate">{title}</h1>
        </div>

        <div className="max-w-7xl mx-auto pb-6">
          {/* Desktop Header */}
          <div className="hidden lg:block pt-6 px-6">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {renderRatingStars(rating)}
                <span className="text-gray-600">{totalReviews} reviews</span>
                <span className="text-gray-600">• {category}</span>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={onSave}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                  <span className="hidden md:inline">Save</span>
                </button>
                <button 
                  onClick={onShare}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="hidden md:inline">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Image Gallery Section */}
            <div className="lg:col-span-2">
              {/* Mobile Rating Bar */}
              <div className="lg:hidden related top-14 bg-white z-40 px-4 py-2 border-b flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {renderRatingStars(rating)}
                  <span className="text-sm text-gray-600">{rating}</span>
                </div>
                <div className="flex space-x-4">
                  <button onClick={onSave} className="p-2">
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current text-red-500' : 'text-gray-600'}`} />
                  </button>
                  <button onClick={onShare} className="p-2">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="relative">
                <div className="aspect-[4/3] lg:aspect-[16/9] relative overflow-hidden">
                  <Image 
                    src={images[activeImage]}
                    alt={`${title} view ${activeImage + 1}`}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Navigation Arrows */}
                  <button 
                    onClick={onPreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={onNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Thumbnails - Desktop Only */}
                <div className="hidden lg:flex space-x-2 mt-4 px-6">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => onImageSelect(idx)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden
                        ${activeImage === idx ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <Image 
                        src={img}
                        alt={`${title} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="px-4 lg:px-0 mt-4 lg:mt-0">
              <Card className="p-6 md:sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Essential Info</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{duration}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{price}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{location}</span>
                  </div>
                </div>
              </Card>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto space-y-12 px-6">
          <FourCardSection
            title="Related Attractions"
            subtitle="More places to explore nearby"
            items={relatedAttractions}
            cardType={CARD_TYPES.MEDIA_DETAIL}
          />

          <FourCardSection
            title="Nearby Restaurants"
            subtitle="Popular dining options in the area"
            items={nearbyRestaurants}
            cardType={CARD_TYPES.MEDIA_DETAIL}
          />

          <FourCardSection
            title="Popular Guides"
            subtitle="Curated guides featuring this attraction"
            items={popularGuides}
            cardType={CARD_TYPES.COLLECTION_PREVIEW}
          />
        </div>
      </div>
    </>
  );
};

export default AttractionDetail;