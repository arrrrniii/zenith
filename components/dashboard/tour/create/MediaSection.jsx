//components/dashboard/tour/create/MediaSection.jsx
import React, { useState } from 'react';
import { Camera, ImageIcon, Loader2, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import FormSection from './FormSection';
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

const ImagePreview = ({ src, onRemove, isMain = false, isLoading }) => (
  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
    {isLoading ? (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    ) : (
      <img 
        src={typeof src === 'object' ? src.image_url : src} 
        alt={isMain ? "Main tour image" : "Tour gallery image"}
        className="w-full h-full object-cover"
      />
    )}
    {onRemove && !isLoading && (
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
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

const UploadBox = ({ onUpload, text, icon: Icon, isLoading, multiple = false, className }) => (
  <label className={cn(
    "flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer",
    isLoading && "opacity-50 cursor-not-allowed",
    className
  )}>
    {isLoading ? (
      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
    ) : (
      <>
        <Icon className="w-6 h-6 text-gray-400" />
        <span className="mt-2 text-sm text-gray-500">{text}</span>
      </>
    )}
    <input 
      type="file" 
      className="hidden" 
      accept="image/*" 
      onChange={onUpload}
      multiple={multiple}
      disabled={isLoading}
    />
  </label>
);

const MediaSection = ({ formData, updateFormData, errors }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFiles = (files) => {
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`Invalid file type. Only JPG and PNG are allowed.`);
      }
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File ${file.name} exceeds 5MB limit.`);
      }
    }
  };

  const uploadFiles = async (files) => {
    try {
      validateFiles(files);
      setIsUploading(true);

      const formDataBody = new FormData();
      files.forEach(file => formDataBody.append('files', file));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataBody,
      });

      if (!response.ok) {
        throw new Error(response.statusText || 'Upload failed');
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
      return data.filePaths;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to upload images",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const [imagePath] = await uploadFiles([file]);
      updateFormData('mainImage', imagePath);
    } catch (error) {
      console.error('Main image upload error:', error);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const paths = await uploadFiles(files);
      updateFormData('gallery', [...(formData.gallery || []), ...paths]);
    } catch (error) {
      console.error('Gallery upload error:', error);
    }
  };

  const removeImage = (type, index = null) => {
    try {
      if (type === 'main') {
        updateFormData('mainImage', null);
      } else if (type === 'gallery' && index !== null) {
        const newGallery = [...formData.gallery];
        newGallery.splice(index, 1);
        updateFormData('gallery', newGallery);
      }
      
      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove image",
      });
    }
  };

  return (
    <FormSection 
      title="Images and Media"
      description="Upload high-quality images and video content for your tour."
    >
      <div className="space-y-6">
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
              onRemove={() => removeImage('main')}
              isMain={true}
              isLoading={isUploading}
            />
          ) : (
            <UploadBox 
              onUpload={handleMainImageUpload}
              text="Upload Main Image"
              icon={Camera}
              isLoading={isUploading}
            />
          )}
        </div>

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
                key={typeof image === 'object' ? image.image_url : image}
                src={image}
                onRemove={() => removeImage('gallery', index)}
                isLoading={isUploading}
              />
            ))}
            <UploadBox 
              onUpload={handleGalleryUpload}
              text="Add to Gallery"
              icon={ImageIcon}
              isLoading={isUploading}
              multiple={true}
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Image Guidelines</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Main image should be landscape orientation (16:9)</li>
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
