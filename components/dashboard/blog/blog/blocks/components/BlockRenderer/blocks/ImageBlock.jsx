import React, { useState, useEffect } from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ZoomIn, ZoomOut, RefreshCcw } from 'lucide-react';

export const ImageBlock = ({
  content: {
    url = '',
    alt = '',
    caption = '',
    credit = '',
    size = 'full',
    align = 'center',
    dimensions = null,
    zoomEnabled = true,
    lazyLoad = true,
    linkUrl = '',
    openInNewTab = true
  } = {}
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (url) {
      setIsLoading(true);
      setError(null);
      setIsZoomed(false);
    }
  }, [url]);

  if (!url) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Image URL is missing or invalid
        </AlertDescription>
      </Alert>
    );
  }

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError('Failed to load image');
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  const toggleZoom = (e) => {
    // Don't zoom if the image is a link and not already zoomed
    if (linkUrl && !isZoomed) return;
    
    if (zoomEnabled) {
      e.preventDefault(); // Prevent link navigation when zooming
      setIsZoomed(!isZoomed);
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'w-1/3';
      case 'medium': return 'w-1/2';
      case 'large': return 'w-3/4';
      default: return 'w-full';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'left': return 'ml-0 mr-auto';
      case 'right': return 'ml-auto mr-0';
      default: return 'mx-auto';
    }
  };

  // Default dimensions
  const defaultWidth = 1200;
  const defaultHeight = 800;
  const imageWidth = dimensions?.width || defaultWidth;
  const imageHeight = dimensions?.height || defaultHeight;

  const ImageContent = (
    <div className={`
      relative rounded-lg
      ${zoomEnabled ? (isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in') : ''}
      ${linkUrl && !isZoomed ? 'cursor-pointer' : ''}
    `}>
      {isLoading && (
        <Skeleton className="w-full aspect-[${imageWidth}/${imageHeight}]" />
      )}

      <div className={`
        transition-all duration-300
        ${isZoomed ? 'scale-150' : 'scale-100'}
      `}>
        <Image
          key={`${url}-${retryCount}`}
          src={url}
          alt={alt || 'Image'}
          width={imageWidth}
          height={imageHeight}
          layout="responsive"
          objectFit="cover"
          priority={!lazyLoad}
          quality={90}
          className="rounded-lg"
          onLoadingComplete={handleImageLoad}
          onError={handleImageError}
          onClick={zoomEnabled || linkUrl ? toggleZoom : undefined}
        />
      </div>

      {!isLoading && !error && zoomEnabled && (
        <div className="
          absolute top-2 right-2 opacity-0 group-hover:opacity-100
          transition-opacity duration-200 flex gap-2
        ">
          <Button
            size="sm"
            variant="secondary"
            className="bg-black/50 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              toggleZoom(e);
            }}
          >
            {isZoomed ? (
              <ZoomOut className="h-4 w-4 text-white" />
            ) : (
              <ZoomIn className="h-4 w-4 text-white" />
            )}
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <figure className={`my-6 relative group ${getSizeClass()} ${getAlignClass()}`}>
      {linkUrl && !isZoomed ? (
        <Link 
          href={linkUrl}
          target={openInNewTab ? "_blank" : "_self"}
          rel={openInNewTab ? "noopener noreferrer" : ""}
        >
          {ImageContent}
        </Link>
      ) : (
        ImageContent
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-3">{error}</p>
            <Button
              size="sm"
              onClick={handleRetry}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {(caption || credit) && !error && (
        <figcaption className="
          text-sm text-gray-500 text-center mt-2
          transition-opacity duration-200
          group-hover:opacity-100
          opacity-80
        ">
          {caption}
          {credit && (
            <span className="text-gray-400 ml-2">
              © {credit}
            </span>
          )}
        </figcaption>
      )}

      {dimensions && !error && !isLoading && (
        <div className="
          absolute bottom-2 left-2 
          text-xs text-white bg-black/50 
          px-2 py-1 rounded-md
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        ">
          {dimensions.width} × {dimensions.height}
        </div>
      )}
    </figure>
  );
};

export default ImageBlock;