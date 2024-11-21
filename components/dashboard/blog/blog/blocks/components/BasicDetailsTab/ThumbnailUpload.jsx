// components/BasicDetailsTab/ThumbnailUpload.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

export const ThumbnailUpload = ({ 
  imagePreview, 
  onImageUpload, 
  onImageRemove,
  error 
}) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2">
      Blog Thumbnail
      <span className="text-xs text-gray-500">(Recommended: 1200x630px)</span>
    </Label>
    <div className="flex items-start gap-4">
      <div className="flex-1">
        <div className={`
          border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 
          transition-colors ${error ? 'border-red-500' : ''}
        `}>
          <input
            type="file"
            id="thumbnail"
            className="hidden"
            accept="image/*"
            onChange={(e) => onImageUpload(e.target.files[0])}
          />
          <label
            htmlFor="thumbnail"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-400">
              PNG, JPG or WebP (max. 2MB)
            </span>
          </label>
        </div>
      </div>
      
      {imagePreview && (
        <div className="w-32 h-32 relative">
          <img
            src={imagePreview}
            alt="Thumbnail preview"
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2"
            onClick={onImageRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
    {error && <div className="text-xs text-red-500">{error}</div>}
  </div>
);