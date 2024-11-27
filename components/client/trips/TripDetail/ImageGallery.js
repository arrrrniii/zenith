// components/client/trips/TripDetail/ImageGallery.js
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ images, title }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeImage = useCallback((newIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveImage(newIndex);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextImage = () => {
    changeImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    changeImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-[16/9] relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-black/5" /> {/* Subtle overlay */}
          <Image
            src={images[activeImage]}
            alt={`${title} - View ${activeImage + 1}`}
            fill
            className={`
              object-cover transition-transform duration-700 ease-out
              ${isTransitioning ? 'scale-105' : 'scale-100'}
            `}
            priority={activeImage === 0}
          />
          
          {/* Navigation Arrows - Hidden by default, shown on hover */}
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={previousImage}
              className="backdrop-blur-md bg-white/30 hover:bg-white/40 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="backdrop-blur-md bg-white/30 hover:bg-white/40 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 backdrop-blur-md bg-black/20 text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="hidden lg:grid grid-cols-6 gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => changeImage(idx)}
            className={`
              relative aspect-square rounded-xl overflow-hidden
              transition-all duration-300 transform
              ${activeImage === idx 
                ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' 
                : 'opacity-80 hover:opacity-100 hover:scale-105'
              }
            `}
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
  );
};

export default ImageGallery;