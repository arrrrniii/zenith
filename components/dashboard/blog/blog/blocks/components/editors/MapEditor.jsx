// components/admin/dashboard/service/blocks/components/editors/MapEditor.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ExternalLink } from 'lucide-react';

export const MapEditor = ({ content, onChange }) => {
  const mapContent = {
    url: '',
    height: 400,
    ...content
  };

  // Helper to validate Google Maps URL
  const isValidGoogleMapsUrl = (url) => {
    return url.includes('maps.app.goo.gl') || 
           url.includes('goo.gl/maps') || 
           url.includes('google.com/maps');
  };

  return (
    <div className="space-y-6">
      {/* Map URL Input */}
      <div className="space-y-2">
        <Label>Google Maps Link</Label>
        <div className="relative">
          <Input
            value={mapContent.url}
            onChange={(e) => onChange({ ...mapContent, url: e.target.value })}
            placeholder="Paste Google Maps sharing link (e.g., https://maps.app.goo.gl/...)"
          />
          {mapContent.url && !isValidGoogleMapsUrl(mapContent.url) && (
            <p className="text-sm text-red-500 mt-1">
              Please enter a valid Google Maps URL
            </p>
          )}
        </div>
      </div>

      {/* Height Input */}
      <div className="space-y-2">
        <Label>Map Height (px)</Label>
        <Input
          type="number"
          value={mapContent.height}
          onChange={(e) => onChange({ 
            ...mapContent, 
            height: parseInt(e.target.value) 
          })}
          min="200"
          max="800"
          step="50"
        />
      </div>

      {/* Instructions */}
      <div className="space-y-2 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
        <p className="font-medium">How to get the Google Maps link:</p>
        <ol className="list-decimal ml-4 space-y-1">
          <li>Open Google Maps</li>
          <li>Find your location</li>
          <li>Click the "Share" button</li>
          <li>Choose "Copy link"</li>
          <li>Paste the link here (e.g., https://maps.app.goo.gl/...)</li>
        </ol>
      </div>

   
    </div>
  );
};