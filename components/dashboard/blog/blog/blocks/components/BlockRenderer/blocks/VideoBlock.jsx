// components/BlockRenderer/blocks/VideoBlock.jsx
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const VideoBlock = ({ content }) => {
  const {
    type = 'url',
    url = '',
    title = '',
    autoplay = false,
    muted = true,
    controls = true,
    loop = false,
    poster = '',
    aspectRatio = '16:9',
    width = 'full'
  } = content;

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [url, poster]);

  if (!url) {
    return null;
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-square';
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

  return (
    <figure className={cn(
      'my-6 mx-auto',
      getWidthClass()
    )}>
      <div className={cn(
        'relative overflow-hidden rounded-lg bg-gray-100',
        getAspectRatioClass()
      )}>
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster={poster}
          autoPlay={autoplay}
          muted={muted}
          controls={controls}
          loop={loop}
          playsInline
        >
          <source src={url} type={`video/${url.split('.').pop()}`} />
          Your browser does not support the video tag.
        </video>
      </div>
      {title && (
        <figcaption className="mt-2 text-sm text-center text-gray-500">
          {title}
        </figcaption>
      )}
    </figure>
  );
};