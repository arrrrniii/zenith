import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowRight, ExternalLink, ChevronRight, MoveRight } from 'lucide-react';

export const ButtonBlock = ({ content }) => {
  const {
    text = 'Click me',
    url = '#',
    size = 'default',
    style = 'solid',
    icon = 'none',
    animation = 'none',
    fullWidth = false,
    openInNewTab = false,
    alignment = 'left',
    backgroundColor = '#000000',
    textColor = '#ffffff',
    underline = false,
  } = content;

  const getVariantClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200';

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      default: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };

    const styles = {
      solid: 'rounded-md',
      rounded: 'rounded-lg',
      pill: 'rounded-full',
      soft: 'rounded-md bg-opacity-20 hover:bg-opacity-30',
    };

    const animations = {
      none: '',
      hover: 'group hover:translate-x-1',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce',
    };

    return cn(
      baseClasses,
      sizes[size],
      styles[style],
      animations[animation],
      fullWidth && 'w-full',
      underline && 'underline decoration-2 decoration-current'
    );
  };

  const renderIcon = () => {
    const iconClasses = 'w-4 h-4 ml-2 transition-transform group-hover:translate-x-1';
    switch (icon) {
      case 'arrow':
        return <ArrowRight className={iconClasses} />;
      case 'chevron':
        return <ChevronRight className={iconClasses} />;
      case 'external':
        return <ExternalLink className={iconClasses} />;
      case 'move':
        return <MoveRight className={iconClasses} />;
      default:
        return null;
    }
  };

  const buttonStyles = {
    backgroundColor,
    color: textColor,
  };

  return (
    <div
      className={cn(
        'my-4',
        {
          'text-center': alignment === 'center',
          'text-right': alignment === 'right',
        }
      )}
    >
      <a
        href={url}
        target={openInNewTab ? '_blank' : undefined}
        rel={openInNewTab ? 'noopener noreferrer' : undefined}
        className={getVariantClasses()}
        style={buttonStyles}
      >
        <span>{text}</span>
        {renderIcon()}
      </a>
    </div>
  );
};