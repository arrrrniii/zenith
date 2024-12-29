//components/ui/card.js
import React from 'react';

export const Card = ({
  className = "",
  children,
  ...props
}) => (
  <div 
    className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
    {...props}
    
  >
    {children}
  </div>
);