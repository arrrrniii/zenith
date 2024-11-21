import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageOverlayCard from './ImageOverlayCard';
import MediaDetailCard from './MediaDetailCard';
import CollectionPreviewCard from './CollectionPreviewCard';

// Updated layout configurations with mobile breakpoints
const LAYOUT_CONFIG = {
  THREE: {
    maxVisible: {
      mobile: 1.2, // Show 1 full card and peek of next
      tablet: 2,
      desktop: 3,
    },
    gapPx: 16,
    hideScrollbar: 'scrollbar-hide md:scrollbar-default',
  },
  FOUR: {
    maxVisible: {
      mobile: 1.2,
      tablet: 3,
      desktop: 4,
    },
    gapPx: 16,
    hideScrollbar: 'scrollbar-hide md:scrollbar-default',
  },
  FIVE: {
    maxVisible: {
      mobile: 1.2,
      tablet: 3,
      desktop: 5,
    },
    gapPx: 16,
    hideScrollbar: 'scrollbar-hide md:scrollbar-default',
  },
};

const CardComponent = {
  IMAGE_OVERLAY: ImageOverlayCard,
  MEDIA_DETAIL: MediaDetailCard,
  COLLECTION_PREVIEW: CollectionPreviewCard,
};

const ScrollButton = ({ direction, onClick, disabled, className = '' }) => {
  const isLeft = direction === 'left';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        ${isLeft ? '-left-4' : '-right-4'}
        hidden md:flex items-center justify-center
        w-10 h-10 rounded-full bg-white shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:bg-gray-50 transition-colors
        ${className}
      `}
      aria-label={`Scroll ${direction}`}
    >
      {isLeft ? (
        <ChevronLeft className="w-6 h-6" />
      ) : (
        <ChevronRight className="w-6 h-6" />
      )}
    </button>
  );
};

const BaseCardSection = ({
  title,
  subtitle,
  items = [],
  cardType,
  layout = 'FOUR',
  className = '',
}) => {
  const scrollContainerRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
    canScroll: false,
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Get layout configuration
  const config = LAYOUT_CONFIG[layout];

  // Update device type based on window width
  const updateDeviceType = () => {
    if (typeof window === 'undefined') return;
    setIsMobile(window.innerWidth < 768);
    setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
  };

  // Calculate current number of visible cards based on screen size
  const getVisibleCards = () => {
    if (isMobile) return config.maxVisible.mobile;
    if (isTablet) return config.maxVisible.tablet;
    return config.maxVisible.desktop;
  };

  // Update scroll state
  const updateScrollState = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const canScrollLeft = container.scrollLeft > 0;
    const canScrollRight =
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1;

    setScrollState({
      canScrollLeft,
      canScrollRight,
      canScroll: container.scrollWidth > container.clientWidth,
    });
  };

  // Handle scroll
  const handleScroll = (direction) => {
    if (isScrolling || !scrollContainerRef.current) return;

    setIsScrolling(true);
    const container = scrollContainerRef.current;
    const visibleCards = getVisibleCards();
    const cardWidth = container.clientWidth / visibleCards;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });

    setTimeout(() => setIsScrolling(false), 500);
  };

  // Initialize and cleanup scroll observers
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateDeviceType();
    const handleResize = () => {
      updateDeviceType();
      updateScrollState();
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('scroll', updateScrollState);
    
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, []);

  const renderCard = (item, index) => {
    const Component = CardComponent[cardType];
    if (!Component) return null;

    const visibleCards = getVisibleCards();
    const width = `${100 / visibleCards}%`;

    return (
      <div
        key={item.id || index}
        className="flex-shrink-0 snap-start"
        style={{ 
          flex: `0 0 ${width}`,
          paddingRight: index < items.length - 1 ? `${config.gapPx}px` : 0
        }}
      >
        <Component {...item} />
      </div>
    );
  };

  return (
    <section className={`w-full ${className}`}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}

      {/* Cards Container */}
      <div className="relative">
        {/* Scroll Buttons (desktop only) */}
        {!isMobile && scrollState.canScroll && (
          <ScrollButton
            direction="left"
            onClick={() => handleScroll('left')}
            disabled={!scrollState.canScrollLeft || isScrolling}
          />
        )}

        {/* Cards */}
        <div
          ref={scrollContainerRef}
          className={`
            flex
            overflow-x-auto
            ${config.hideScrollbar}
            scroll-smooth
            snap-x snap-mandatory
            -mx-4 px-4
            md:mx-0 md:px-0
            touch-pan-x
          `}
        >
          {items.map(renderCard)}
        </div>

        {!isMobile && scrollState.canScroll && (
          <ScrollButton
            direction="right"
            onClick={() => handleScroll('right')}
            disabled={!scrollState.canScrollRight || isScrolling}
          />
        )}
      </div>
    </section>
  );
};

export default BaseCardSection;