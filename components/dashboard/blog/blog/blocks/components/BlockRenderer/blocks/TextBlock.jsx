import React from 'react';
import { cn } from '@/lib/utils';

export const TextBlock = ({ content = {} }) => {
  const getListClass = (html) => {
    if (!html || typeof html !== 'string') return '';
    if (html.includes('<ul>')) return 'list-disc';
    if (html.includes('<ol>')) return 'list-decimal';
    return '';
  };

  // Ensure content.text exists and is a string
  const text = content?.text || '';

  return (
    <div 
      className={cn(
        'prose max-w-none',
        'dark:prose-invert',
        'prose-headings:mb-4',
        'prose-p:mb-4',
        'prose-a:text-blue-500 prose-a:hover:underline',
        'prose-ul:list-disc prose-ul:mb-4',
        'prose-ol:list-decimal prose-ol:mb-4',
        'prose-li:mb-1',
        getListClass(text)
      )}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};