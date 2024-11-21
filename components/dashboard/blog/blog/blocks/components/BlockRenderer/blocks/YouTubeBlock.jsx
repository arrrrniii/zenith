import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const YouTubeBlock = ({ content }) => {
  const {
    videoId = '',
    title = '',
    autoplay = false,
    muted = true,
    controls = true,
    loop = false,
    aspectRatio = '16:9',
    width = 'full',
    showRelated = false,
    si = '', // YouTube's secure initialization parameter
    enableJsApi = true
  } = content;

  const [origin, setOrigin] = useState('');

  useEffect(() => {
    // Set origin for API security
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  if (!videoId) {
    return null;
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
      case '9:16':
        return 'aspect-[9/16]';
      default: // 16:9
        return 'aspect-video';
    }
  };

  const getWidthClass = () => {
    switch (width) {
      case 'small':
        return 'w-1/4';
      case 'medium':
        return 'w-1/2';
      case 'large':
        return 'w-3/4';
      default:
        return 'w-full';
    }
  };

  const buildEmbedUrl = () => {
    const params = new URLSearchParams({
      enablejsapi: enableJsApi ? '1' : '0',
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
      controls: controls ? '1' : '0',
      loop: loop ? '1' : '0',
      rel: showRelated ? '1' : '0',
      si: si || '',
      origin: origin,
      playsinline: '1'
    });

    if (loop) {
      params.append('playlist', videoId);
    }

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  return (
    <figure className={cn(
      'my-6 mx-auto',
      getWidthClass()
    )}>
      <div className={cn(
        'relative overflow-hidden rounded-lg bg-gray-100',
        getAspectRatioClass()
      )}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={buildEmbedUrl()}
          title={title || 'YouTube video player'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {title && (
        <figcaption className="mt-2 text-sm text-center text-gray-500">
          {title}
        </figcaption>
      )}
    </figure>
  );
};

export default YouTubeBlock;