// components/BlockRenderer/blocks/ListBlock.jsx
import { Check } from 'lucide-react';

export const ListBlock = ({ content }) => {
  const {
    type = 'bullet',
    items = [],
    markerColor = 'default',
    spacing = 'normal',
    indented = true
  } = content;

  const getListStyle = () => {
    switch (type) {
      case 'numbered':
        return 'list-decimal';
      case 'checklist':
        return 'list-none';
      case 'custom':
        return 'list-none';
      default:
        return 'list-disc';
    }
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case 'tight':
        return 'space-y-1';
      case 'relaxed':
        return 'space-y-4';
      default:
        return 'space-y-2';
    }
  };

  const getMarkerColorClass = () => {
    switch (markerColor) {
      case 'primary':
        return 'marker:text-blue-500';
      case 'secondary':
        return 'marker:text-purple-500';
      case 'success':
        return 'marker:text-green-500';
      case 'warning':
        return 'marker:text-yellow-500';
      default:
        return 'marker:text-gray-400';
    }
  };

  return (
    <ul
      className={`
        ${indented ? 'ml-6' : 'ml-0'}
        ${getListStyle()}
        ${getSpacingClass()}
        ${type === 'bullet' ? getMarkerColorClass() : ''}
        my-4
      `}
    >
      {items.map((item, index) => (
        <li
          key={index}
          className={`
            text-gray-700
            ${type === 'checklist' ? 'flex items-center gap-2' : ''}
          `}
        >
          {type === 'checklist' && (
            <span className="flex-shrink-0 w-5 h-5 border rounded-sm flex items-center justify-center text-green-500">
              <Check className="w-4 h-4" />
            </span>
          )}
          {type === 'custom' && (
            <span className="inline-block w-6 text-center mr-2">
              {String.fromCharCode(9632)} {/* Custom bullet character */}
            </span>
          )}
          {item}
        </li>
      ))}
    </ul>
  );
};