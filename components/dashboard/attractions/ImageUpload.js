

// components/dashboard/attractions/components/ImageUpload.js
import React, { useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const ImageUpload = ({ images = [], onImagesChange, loading }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { filePaths } = await response.json();
      onImagesChange([...images, ...filePaths]);
      
      toast({
        title: "Success",
        description: "Images uploaded successfully"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload images. Please try again."
      });
    } finally {
      setUploading(false);
    }
  }, [images, onImagesChange, toast]);

  const handleDeleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    if (newImages.length === 0) {
      newImages.push('/api/placeholder/400/300');
    }
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={`${index}-${image}`}
            className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group"
          >
            <Image
              src={image}
              alt={`Attraction image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {!loading && (
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
                aria-label="Remove image"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
                Main Image
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upload Button */}
      {!loading && (
        <div className="flex justify-center">
          <label className={`
            relative cursor-pointer
            flex flex-col items-center justify-center
            w-full p-6
            border-2 border-dashed border-gray-300 rounded-lg
            bg-gray-50 hover:bg-gray-100 transition-colors duration-200
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              disabled={uploading}
            />
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                <span className="mt-2 text-sm text-gray-500">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Click to upload images</span>
                <span className="mt-1 text-xs text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </span>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;