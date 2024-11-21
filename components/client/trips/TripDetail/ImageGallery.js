// components/client/trips/TripDetail/ImageGallery.js
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageGallery = ({ images, title }) => {
  const [activeImage, setActiveImage] = useState(0);

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <div className="aspect-[4/3] lg:aspect-[16/9] relative overflow-hidden rounded-lg">
          <Image
            src={images[activeImage]}
            alt={`${title} - View ${activeImage + 1}`}
            fill
            className="object-cover"
            priority={activeImage === 0}
          />
          
          {/* Navigation Arrows */}
          <button 
            onClick={previousImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="hidden lg:grid grid-cols-6 gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`
              relative aspect-square rounded-lg overflow-hidden
              ${activeImage === idx ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}
              transition-all duration-200
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