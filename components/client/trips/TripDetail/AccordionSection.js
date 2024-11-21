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
    <div className={`${showBorder ? 'border-b border-gray-200' : ''} ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left group"
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-semibold group-hover:text-gray-700">
          {title}
        </h3>
        <ChevronDown 
          className={`w-6 h-6 text-gray-500 transition-transform duration-200 ease-in-out
            ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="pb-6 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionSection;