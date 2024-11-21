import { cn } from '@/lib/utils';

export const HeadingBlock = ({ content }) => {
  const {
    level = 'h2',
    text = 'New Heading',
    align = 'left',
    color,
    backgroundColor,
    backgroundImage,
    padding,
    advanced
  } = content || {};

  // Default advanced options
  const defaultAdvanced = {
    darkOverlay: false,
    overlayOpacity: 0.3,
    textShadow: false,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowBlur: 3,
    letterSpacing: 0,
    textTransform: 'none',
  };

  // Merge default advanced options with provided ones
  const advancedOptions = {
    ...defaultAdvanced,
    ...advanced
  };

  // Parse level from content, default to 2 if not specified
  const headingLevel = parseInt(level.replace('h', '')) || 2;
  const Tag = `h${headingLevel}`;
  
  // Base styles for each heading level
  const styles = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-semibold tracking-tight',
    3: 'text-2xl font-medium',
    4: 'text-xl font-medium',
    5: 'text-lg font-medium',
    6: 'text-base font-medium'
  };

  // Alignment utilities
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Base spacing classes
  const baseSpacingClasses = {
    1: 'mb-6',
    2: 'mb-4',
    3: 'mb-3',
    4: 'mb-2',
    5: 'mb-2',
    6: 'mb-2'
  };

  // Function to check if a color is dark
  function isColorDark(color) {
    if (!color || color === 'transparent') return false;
    
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }

  // Determine if we need text contrast
  const needsTextContrast = (backgroundImage && advancedOptions.darkOverlay) || 
    (backgroundColor && isColorDark(backgroundColor));

  // Only add base spacing if no custom padding is set
  const spacingClass = (!padding || !padding.bottom) ? baseSpacingClasses[headingLevel] : '';

  // Generate text shadow style if enabled
  const textShadowStyle = advancedOptions.textShadow
    ? `${advancedOptions.shadowBlur}px ${advancedOptions.shadowBlur}px ${advancedOptions.shadowBlur * 2}px ${advancedOptions.shadowColor}`
    : undefined;

  // Wrapper component for background image and overlay
  const BackgroundWrapper = ({ children }) => {
    if (!backgroundImage) return children;

    return (
      <div className="relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
        
        {/* Dark Overlay */}
        {advancedOptions.darkOverlay && (
          <div 
            className="absolute inset-0 bg-black transition-opacity"
            style={{
              opacity: advancedOptions.overlayOpacity
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    );
  };

  return (
    <BackgroundWrapper>
      <Tag 
        className={cn(
          styles[headingLevel], 
          alignmentClasses[align],
          spacingClass,
          'transition-all duration-200 ease-in-out',
          {
            'rounded-lg overflow-hidden': backgroundImage || backgroundColor,
            'text-gray-900': !color && !needsTextContrast,
            'text-white': needsTextContrast,
            'hover:shadow-lg': backgroundImage || backgroundColor,
          }
        )}
        style={{
          color: color || undefined,
          backgroundColor: !backgroundImage ? backgroundColor : undefined,
          paddingTop: `${padding?.top || 0}px`,
          paddingRight: `${padding?.right || 0}px`,
          paddingBottom: `${padding?.bottom || 0}px`,
          paddingLeft: `${padding?.left || 0}px`,
          textShadow: textShadowStyle,
          letterSpacing: `${advancedOptions.letterSpacing}px`,
          textTransform: advancedOptions.textTransform,
        }}
      >
        {text}
      </Tag>
    </BackgroundWrapper>
  );
};
