import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Youtube, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const YoutubeEditor = ({ content, onChange }) => {
  const youtubeContent = {
    videoId: '',
    title: '',
    autoplay: false,
    muted: true,
    controls: true,
    loop: false,
    aspectRatio: '16:9',
    width: 'full',
    showRelated: false,
    si: '', // Security parameter
    enableJsApi: true,
    modestBranding: true,
    playsinline: true,
    cc_load_policy: false, // Closed captions setting
    iv_load_policy: 3, // Video annotations setting (3 = do not show)
    start: 0, // Start time in seconds
    end: 0, // End time in seconds
    ...content
  };

  const extractVideoId = (url) => {
    if (!url) return '';
    
    const patterns = [
      // Standard watch URLs
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\s*[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      // Short URLs
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      // Embed URLs
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      // With timestamp or parameters
      /[?&]v=([a-zA-Z0-9_-]{11})/
    ];

    // Extract video ID and parameters
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        const videoId = match[1];
        const urlObj = new URL(url);
        
        // Extract common parameters
        const si = urlObj.searchParams.get('si');
        const start = urlObj.searchParams.get('t') || urlObj.searchParams.get('start');
        const end = urlObj.searchParams.get('end');

        // Update all extracted parameters
        onChange({
          ...youtubeContent,
          videoId,
          ...(si && { si }),
          ...(start && { start: parseInt(start) }),
          ...(end && { end: parseInt(end) })
        });

        return videoId;
      }
    }
    return url;
  };

  const handleUrlChange = (e) => {
    const videoId = extractVideoId(e.target.value);
    onChange({ ...youtubeContent, videoId });
  };

  const handleTitleChange = (e) => {
    onChange({ ...youtubeContent, title: e.target.value });
  };

  const handleToggleChange = (field) => (checked) => {
    onChange({ ...youtubeContent, [field]: checked });
  };

  const handleNumberChange = (field) => (e) => {
    const value = parseInt(e.target.value) || 0;
    onChange({ ...youtubeContent, [field]: value });
  };

  const handleAspectRatioChange = (value) => {
    onChange({ ...youtubeContent, aspectRatio: value });
  };

  const handleWidthChange = (value) => {
    onChange({ ...youtubeContent, width: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Youtube className="h-5 w-5" />
        <h3 className="font-medium">YouTube Video Settings</h3>
      </div>

      {youtubeContent.autoplay && !youtubeContent.muted && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Autoplay may be blocked by browsers unless the video is muted
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="youtube-url">Video URL or ID</Label>
          <Input
            id="youtube-url"
            placeholder="https://youtube.com/watch?v=... or video ID"
            value={youtubeContent.videoId}
            onChange={handleUrlChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube-title">Title (Optional)</Label>
          <Input
            id="youtube-title"
            placeholder="Video title for accessibility"
            value={youtubeContent.title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoplay">Autoplay</Label>
            <Switch
              id="autoplay"
              checked={youtubeContent.autoplay}
              onCheckedChange={handleToggleChange('autoplay')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="muted">Start Muted</Label>
            <Switch
              id="muted"
              checked={youtubeContent.muted}
              onCheckedChange={handleToggleChange('muted')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="controls">Show Controls</Label>
            <Switch
              id="controls"
              checked={youtubeContent.controls}
              onCheckedChange={handleToggleChange('controls')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="modestBranding">Hide YouTube Logo</Label>
            <Switch
              id="modestBranding"
              checked={youtubeContent.modestBranding}
              onCheckedChange={handleToggleChange('modestBranding')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="loop">Loop Video</Label>
            <Switch
              id="loop"
              checked={youtubeContent.loop}
              onCheckedChange={handleToggleChange('loop')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showRelated">Show Related Videos</Label>
            <Switch
              id="showRelated"
              checked={youtubeContent.showRelated}
              onCheckedChange={handleToggleChange('showRelated')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="cc_load_policy">Show Closed Captions</Label>
            <Switch
              id="cc_load_policy"
              checked={youtubeContent.cc_load_policy}
              onCheckedChange={handleToggleChange('cc_load_policy')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start">Start Time (seconds)</Label>
            <Input
              id="start"
              type="number"
              min="0"
              value={youtubeContent.start}
              onChange={handleNumberChange('start')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end">End Time (seconds)</Label>
            <Input
              id="end"
              type="number"
              min="0"
              value={youtubeContent.end}
              onChange={handleNumberChange('end')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
          <Select
            id="aspect-ratio"
            value={youtubeContent.aspectRatio}
            onValueChange={handleAspectRatioChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
              <SelectItem value="4:3">4:3 (Standard)</SelectItem>
              <SelectItem value="1:1">1:1 (Square)</SelectItem>
              <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="width">Video Width</Label>
          <Select
            id="width"
            value={youtubeContent.width}
            onValueChange={handleWidthChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select video width" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width</SelectItem>
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

export default YoutubeEditor;