// components/client/trips/TripDetail/AccordionSection.js
// components/client/trips/TripDetail/AccordionSection.js
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionSection = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  showBorder = true 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div 
      className={`
        ${showBorder ? 'border-b border-gray-200/80' : ''} 
        ${className}
      `}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left group transition-colors duration-300"
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-medium text-gray-900 tracking-tight group-hover:text-gray-600 transition-colors duration-300">
          {title}
        </h3>
        <ChevronDown
          className={`
            w-5 h-5 text-gray-400 transition-all duration-500 ease-in-out
            ${isOpen ? 'rotate-180 text-gray-600' : ''}
            group-hover:text-gray-600
          `}
        />
      </button>

      {isOpen && (
        <div 
          className="pb-8 animate-fadeIn overflow-hidden"
          style={{
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;