
// components/dashboard/attractions/Form/parts/ImageSection.js
import React from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { FormSection } from '../FormComponents';

const ImageUpload = ({ images, onImagesChange, loading }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {images.map((image, index) => (
      <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
        <Image
          src={image}
          alt={`Attraction image ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {!loading && (
          <button 
            type="button"
            onClick={() => {
              const newImages = [...images];
              newImages.splice(index, 1);
              onImagesChange(newImages);
            }}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    ))}
    
    {!loading && (
      <button 
        type="button"
        onClick={() => onImagesChange([...images, '/api/placeholder/400/300'])}
        className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Upload className="w-6 h-6 text-gray-400" />
        <span className="mt-2 text-sm text-gray-500">Add Image</span>
      </button>
    )}
  </div>
);

const ImageSection = ({ formData, updateFormData, loading }) => (
  <FormSection title="Images">
    <ImageUpload 
      images={formData.images}
      onImagesChange={(images) => updateFormData('images', images)}
      loading={loading}
    />
  </FormSection>
);
