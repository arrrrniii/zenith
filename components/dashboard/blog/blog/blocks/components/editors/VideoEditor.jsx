// components/admin/dashboard/service/blocks/components/editors/VideoEditor.jsx
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImagePlus, X, Loader2, Video as VideoIcon } from 'lucide-react';

export const VideoEditor = ({ content, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Initialize default content
  const videoContent = {
    type: 'url', // 'url' or 'upload'
    url: '',
    title: '',
    autoplay: false,
    muted: true,
    controls: true,
    loop: false,
    poster: '', // thumbnail image URL
    aspectRatio: '16:9', // or '4:3', '1:1'
    width: 'full', // 'full', 'large', 'medium', 'small'
    ...content
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid video file (MP4, WebM, or OGG)');
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File size should be less than 50MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // Create FormData
      const formData = new FormData();
      formData.append('files', file);

      // Upload to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload video');
      }

      const data = await response.json();
      const uploadedUrl = data.filePaths[0];

      onChange({ 
        ...videoContent,
        type: 'upload',
        url: uploadedUrl 
      });

    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePosterUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file for the poster');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload poster image');
      }

      const data = await response.json();
      onChange({ 
        ...videoContent,
        poster: data.filePaths[0] 
      });

    } catch (error) {
      console.error('Error uploading poster:', error);
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={videoContent.type} onValueChange={(value) => onChange({ ...videoContent, type: value })}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url">Video URL</TabsTrigger>
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <div>
            <Label>Video URL</Label>
            <Input
              type="url"
              value={videoContent.url}
              onChange={(e) => onChange({ ...videoContent, url: e.target.value })}
              placeholder="Enter video URL (MP4, WebM, OGG)"
              disabled={isUploading}
            />
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-4">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="mt-2 text-sm text-gray-500">Uploading video...</span>
              </div>
            ) : videoContent.url && videoContent.type === 'upload' ? (
              <div className="relative">
                <video
                  src={videoContent.url}
                  className="w-full rounded"
                  controls
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => onChange({ ...videoContent, url: '' })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer p-8 hover:bg-gray-50 transition-colors rounded-lg">
                <VideoIcon className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Upload video</span>
                <span className="text-xs text-gray-400 mt-1">
                  MP4, WebM or OGG, max 50MB
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleVideoUpload}
                  disabled={isUploading}
                />
              </label>
            )}
            {uploadError && (
              <p className="text-sm text-red-500 mt-2">{uploadError}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4">
        {/* Video Title */}
        <div>
          <Label>Title</Label>
          <Input
            value={videoContent.title}
            onChange={(e) => onChange({ ...videoContent, title: e.target.value })}
            placeholder="Video title (optional)"
            disabled={isUploading}
          />
        </div>

        {/* Poster Image */}
        <div>
          <Label>Poster Image (Thumbnail)</Label>
          <div className="mt-2 border-2 border-dashed rounded-lg p-4">
            {videoContent.poster ? (
              <div className="relative">
                <img
                  src={videoContent.poster}
                  alt="Video thumbnail"
                  className="w-full h-48 object-cover rounded"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => onChange({ ...videoContent, poster: '' })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer p-8 hover:bg-gray-50 transition-colors rounded-lg">
                <ImagePlus className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Upload thumbnail</span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG or WebP
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePosterUpload}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Video Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Autoplay</Label>
            <Switch
              checked={videoContent.autoplay}
              onCheckedChange={(checked) => 
                onChange({ ...videoContent, autoplay: checked })
              }
              disabled={isUploading}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Muted</Label>
            <Switch
              checked={videoContent.muted}
              onCheckedChange={(checked) => 
                onChange({ ...videoContent, muted: checked })
              }
              disabled={isUploading}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Show Controls</Label>
            <Switch
              checked={videoContent.controls}
              onCheckedChange={(checked) => 
                onChange({ ...videoContent, controls: checked })
              }
              disabled={isUploading}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Loop</Label>
            <Switch
              checked={videoContent.loop}
              onCheckedChange={(checked) => 
                onChange({ ...videoContent, loop: checked })
              }
              disabled={isUploading}
            />
          </div>
        </div>

        {/* Aspect Ratio */}
        <div>
          <Label>Aspect Ratio</Label>
          <Select
            value={videoContent.aspectRatio}
            onValueChange={(value) => onChange({ ...videoContent, aspectRatio: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9</SelectItem>
              <SelectItem value="4:3">4:3</SelectItem>
              <SelectItem value="1:1">1:1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Width */}
        <div>
          <Label>Width</Label>
          <Select
            value={videoContent.width}
            onValueChange={(value) => onChange({ ...videoContent, width: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full width</SelectItem>
              <SelectItem value="large">Large (75%)</SelectItem>
              <SelectItem value="medium">Medium (50%)</SelectItem>
              <SelectItem value="small">Small (25%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

   
    </div>
  );
};