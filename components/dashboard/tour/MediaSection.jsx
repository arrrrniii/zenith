// MediaSection.jsx
import React, { useCallback } from 'react';
import { Camera, Upload, X, FileVideo, ImageIcon } from 'lucide-react';
import FormSection  from './FormSection';

const ImagePreview = ({ src, onRemove, isMain = false }) => (
  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
    <img 
      src={src} 
      alt={isMain ? "Main tour image" : "Tour gallery image"}
      className="w-full h-full object-cover"
    />
    {onRemove && (
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remove image"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    )}
    {isMain && (
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-xs">
        Main Image
      </div>
    )}
  </div>
);

const ImageUploadBox = ({ onUpload, text = "Add Image", icon: Icon = Upload }) => (
  <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
    <Icon className="w-6 h-6 text-gray-400" />
    <span className="mt-2 text-sm text-gray-500">{text}</span>
    <input 
      type="file" 
      className="hidden" 
      accept="image/*" 
      onChange={onUpload}
    />
  </label>
);

const MediaSection = ({ formData, updateFormData, errors }) => {
  const handleMainImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd handle file upload to a server here
      const imageUrl = URL.createObjectURL(file);
      updateFormData('mainImage', imageUrl);
    }
  }, [updateFormData]);

  const handleGalleryUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      // In a real app, you'd handle file upload to a server here
      const imageUrls = files.map(file => URL.createObjectURL(file));
      updateFormData('gallery', [...(formData.gallery || []), ...imageUrls]);
    }
  }, [formData.gallery, updateFormData]);

  const removeGalleryImage = useCallback((index) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    updateFormData('gallery', newGallery);
  }, [formData.gallery, updateFormData]);

  const handleVideoUrlChange = useCallback((e) => {
    updateFormData('videoUrl', e.target.value);
  }, [updateFormData]);

  return (
    <FormSection 
      title="Images and Media"
      description="Upload high-quality images and video content for your tour."
      infoTooltip="Add compelling visuals to showcase your tour. Main image will be featured prominently."
    >
      <div className="space-y-6">
        {/* Main Image Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Main Image
            </label>
            {errors?.mainImage && (
              <span className="text-sm text-red-600">{errors.mainImage}</span>
            )}
          </div>
          {formData.mainImage ? (
            <ImagePreview 
              src={formData.mainImage} 
              onRemove={() => updateFormData('mainImage', null)}
              isMain={true}
            />
          ) : (
            <ImageUploadBox 
              onUpload={handleMainImageUpload}
              text="Upload Main Image"
              icon={Camera}
            />
          )}
        </div>

        {/* Gallery Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Gallery
            </label>
            {errors?.gallery && (
              <span className="text-sm text-red-600">{errors.gallery}</span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.gallery?.map((image, index) => (
              <ImagePreview 
                key={index}
                src={image}
                onRemove={() => removeGalleryImage(index)}
              />
            ))}
            <ImageUploadBox 
              onUpload={handleGalleryUpload}
              text="Add to Gallery"
              icon={ImageIcon}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Add multiple images to showcase different aspects of your tour
          </p>
        </div>

        {/* Video URL Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL (Optional)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileVideo className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={formData.videoUrl || ''}
              onChange={handleVideoUrlChange}
              className={`block w-full pl-10 rounded-md shadow-sm
                ${errors?.videoUrl 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              placeholder="Enter YouTube or Vimeo URL"
            />
          </div>
          {errors?.videoUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.videoUrl}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Supported platforms: YouTube, Vimeo
          </p>
        </div>

        {/* Media Guidelines */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Image Guidelines</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Main image should be landscape orientation (16:9 recommended)</li>
            <li>• Maximum file size: 5MB per image</li>
            <li>• Supported formats: JPG, PNG</li>
            <li>• Minimum resolution: 1280x720 pixels</li>
          </ul>
        </div>
      </div>
    </FormSection>
  );
};

export default MediaSection;