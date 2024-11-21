// components/BlockRenderer/blocks/MapBlock.jsx
import React from 'react';
import { ExternalLink } from 'lucide-react';

export const MapBlock = ({ content }) => {
  const {
    url = '',
    height = 400
  } = content;

  if (!url) {
    return null;
  }

  // Convert sharing URL to embed URL
  const getEmbedUrl = (url) => {
    // Extract the location ID from the URL
    let locationId = '';
    
    if (url.includes('maps.app.goo.gl/')) {
      locationId = url.split('maps.app.goo.gl/')[1];
    } else if (url.includes('goo.gl/maps/')) {
      locationId = url.split('goo.gl/maps/')[1];
    }
    
    // If we have a location ID, create the embed URL
    if (locationId) {
      return `https://www.google.com/maps/embed?pb=${locationId}`;
    }
    
    // For regular Google Maps URLs
    if (url.includes('google.com/maps')) {
      return url.replace('/maps/', '/maps/embed?pb=');
    }
    
    return url;
  };

  return (
    <div className="space-y-2">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={getEmbedUrl(url)}
          width="100%"
          height={height}
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
          className="bg-gray-50"
        />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
      >
        <ExternalLink className="w-4 h-4 mr-1" />
        View larger map
      </a>
    </div>
  );
};