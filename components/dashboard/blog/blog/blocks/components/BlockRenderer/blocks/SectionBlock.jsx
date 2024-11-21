// components/BlockRenderer/blocks/SectionBlock.jsx
import React from 'react';
import { cn } from '@/lib/utils';
import { BlockRenderer } from '../index';

export const SectionBlock = ({ content }) => {
  const {
    title = '',
    subtitle = '',
    background = 'white',
    padding = 'medium',
    container = 'default',
    divider = 'none',
    anchor = '',
    animation = 'none',
    fullHeight = false,
    centerContent = false,
    blocks = []
  } = content;

  const getBackgroundClass = () => {
    switch (background) {
      case 'light':
        return 'bg-gray-50';
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'primary':
        return 'bg-primary text-primary-foreground';
      case 'gradient':
        return 'bg-gradient-to-br from-primary to-primary-dark';
      default:
        return 'bg-white';
    }
  };

  const getPaddingClass = () => {
    switch (padding) {
      case 'small':
        return 'py-8';
      case 'large':
        return 'py-24';
      default:
        return 'py-16';
    }
  };

  const getContainerClass = () => {
    switch (container) {
      case 'narrow':
        return 'max-w-4xl';
      case 'wide':
        return 'max-w-7xl';
      case 'full':
        return 'max-w-none px-4';
      default:
        return 'max-w-6xl';
    }
  };

  const getDividerClass = () => {
    switch (divider) {
      case 'line':
        return 'border-t border-gray-200';
      case 'shadow':
        return 'shadow-lg';
      case 'wave':
        return 'relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-8 after:bg-wave-pattern';
      default:
        return '';
    }
  };

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-up';
      default:
        return '';
    }
  };

  return (
    <section
      id={anchor || undefined}
      className={cn(
        'relative w-full',
        getBackgroundClass(),
        getPaddingClass(),
        getDividerClass(),
        getAnimationClass(),
        fullHeight && 'min-h-screen',
        centerContent && 'flex items-center'
      )}
    >
      <div className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        getContainerClass()
      )}>
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className={cn(
                'text-3xl font-bold tracking-tight',
                background === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={cn(
                'mt-4 text-lg leading-8',
                background === 'dark' ? 'text-gray-300' : 'text-gray-600'
              )}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Section Content */}
        <div className={cn(
          'space-y-8',
          centerContent && 'text-center'
        )}>
          <BlockRenderer blocks={blocks} />
        </div>
      </div>
    </section>
  );
};