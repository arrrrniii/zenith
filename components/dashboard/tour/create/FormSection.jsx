// components/dashboard/tour/FormSection.jsx
import React from 'react';
import { Info } from 'lucide-react';

const FormSection = ({ 
  title, 
  description, 
  children, 
  className = '',
  infoTooltip
}) => {
  return (
    <div className={`border rounded-lg bg-white p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium text-gray-900">
            {title}
          </h3>
          {infoTooltip && (
            <div className="group relative">
              <Info className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {infoTooltip}
              </div>
            </div>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;