// components/dashboard/attractions/components/GallerySection.js
import React from 'react';
import { FormSection } from '../FormComponents';
import ImageUpload from '../ImageUpload';

const GallerySection = ({ images, onImagesChange, loading, error }) => {
  return (
    <FormSection title="Gallery">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Click to upload high-quality images. The first image will be used as the main image.
        </p>
        <ImageUpload
          images={images}
          onImagesChange={onImagesChange}
          loading={loading}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </FormSection>
  );
};

export default GallerySection;