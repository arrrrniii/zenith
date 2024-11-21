import { ImagePlus, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export const ImageEditor = ({ content, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or WebP)');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size should be less than 2MB');
      return;
    }

    try {
      setIsUploading(true);

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
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      const uploadedUrl = data.filePaths[0];
      console.log('Image uploaded successfully:', uploadedUrl);

      // Update the content with the new URL
      onChange({ 
        ...content, 
        url: uploadedUrl 
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Image Upload Section */}
      <div className="border-2 border-dashed rounded-lg p-4">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="mt-2 text-sm text-gray-500">Uploading image...</span>
          </div>
        ) : content.url ? (
          <div className="relative">
            <img
              src={content.url}
              alt={content.alt}
              className="w-full h-48 object-cover rounded"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onChange({ ...content, url: '' })}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center cursor-pointer p-8 hover:bg-gray-50 transition-colors rounded-lg">
            <ImagePlus className="w-8 h-8 text-gray-400" />
            <span className="mt-2 text-sm text-gray-500">Upload image</span>
            <span className="text-xs text-gray-400 mt-1">
              JPG, PNG or WebP, max 2MB
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      <div className="grid gap-4">
        {/* Link Settings */}
        <div className="space-y-4 border-t pt-4">
          <div>
            <Label className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link URL
            </Label>
            <Input
              value={content.linkUrl || ''}
              onChange={(e) => onChange({ ...content, linkUrl: e.target.value })}
              placeholder="https://"
              type="url"
              disabled={isUploading}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Label className="flex-1">Open in New Tab</Label>
            <Switch
              checked={content.openInNewTab !== false}
              onCheckedChange={(checked) => 
                onChange({ ...content, openInNewTab: checked })
              }
              disabled={isUploading}
            />
          </div>
        </div>

        {/* Alt Text */}
        <div>
          <Label>Alt Text</Label>
          <Input
            value={content.alt || ''}
            onChange={(e) => onChange({ ...content, alt: e.target.value })}
            placeholder="Describe the image for accessibility"
            disabled={isUploading}
          />
          {!content.alt && (
            <p className="text-xs text-amber-500 mt-1">
              Adding alt text improves accessibility
            </p>
          )}
        </div>

        {/* Caption */}
        <div>
          <Label>Caption</Label>
          <Input
            value={content.caption || ''}
            onChange={(e) => onChange({ ...content, caption: e.target.value })}
            placeholder="Optional image caption"
            disabled={isUploading}
          />
        </div>

        {/* Credit */}
        <div>
          <Label>Credit</Label>
          <Input
            value={content.credit || ''}
            onChange={(e) => onChange({ ...content, credit: e.target.value })}
            placeholder="Optional image credit"
            disabled={isUploading}
          />
        </div>

        {/* Size Selection */}
        <div>
          <Label>Size</Label>
          <Select
            value={content.size || 'full'}
            onValueChange={(value) => onChange({ ...content, size: value })}
            disabled={isUploading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full width</SelectItem>
              <SelectItem value="large">Large (75%)</SelectItem>
              <SelectItem value="medium">Medium (50%)</SelectItem>
              <SelectItem value="small">Small (33%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alignment */}
        <div>
          <Label>Alignment</Label>
          <div className="flex gap-2 mt-2">
            {['left', 'center', 'right'].map((align) => (
              <Button
                key={align}
                variant={content.align === align ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...content, align })}
                className="flex-1"
                disabled={isUploading}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Zoom Enable Toggle */}
        <div className="flex items-center gap-2">
          <Label className="flex-1">Enable Zoom</Label>
          <Switch
            checked={content.zoomEnabled !== false}
            onCheckedChange={(checked) => 
              onChange({ ...content, zoomEnabled: checked })
            }
            disabled={isUploading}
          />
        </div>

        {/* Lazy Loading Toggle */}
        <div className="flex items-center gap-2">
          <Label className="flex-1">Lazy Loading</Label>
          <Switch
            checked={content.lazyLoad !== false}
            onCheckedChange={(checked) => 
              onChange({ ...content, lazyLoad: checked })
            }
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Preview Section */}
      {content.url && (
        <div className="mt-4">
          <Label>Preview</Label>
          <div className={`mt-2 relative ${
            content.size === 'medium' ? 'w-1/2' :
            content.size === 'small' ? 'w-1/3' :
            content.size === 'large' ? 'w-3/4' : 'w-full'
          } ${
            content.align === 'left' ? 'ml-0 mr-auto' :
            content.align === 'right' ? 'ml-auto mr-0' : 'mx-auto'
          }`}>
            <img
              src={content.url}
              alt={content.alt || 'Preview'}
              className="w-full rounded-lg shadow-sm"
            />
            {(content.caption || content.credit) && (
              <p className="text-sm text-gray-500 text-center mt-2">
                {content.caption}
                {content.credit && (
                  <span className="text-gray-400 ml-2">
                    © {content.credit}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};