// components/BlockRenderer/blocks/TableBlock.jsx
import { cn } from '@/lib/utils';

export const TableBlock = ({ content }) => {
  const {
    headers = [],
    rows = [],
    striped = true,
    bordered = true,
    hover = true,
    compact = false,
    headerStyle = 'dark',
    alignment = 'left'
  } = content;

  const getHeaderClasses = () => {
    switch (headerStyle) {
      case 'dark':
        return 'bg-gray-800 text-white';
      case 'light':
        return 'bg-gray-100 text-gray-900';
      default:
        return 'bg-white text-gray-900 border-b';
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className={cn(
      'relative w-full overflow-x-auto',
      bordered && 'border rounded-lg'
    )}>
      <table className={cn(
        'w-full',
        compact ? 'text-sm' : 'text-base',
        getAlignmentClass()
      )}>
        <thead className={getHeaderClasses()}>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={cn(
                  'p-3 font-semibold',
                  bordered && headerStyle !== 'dark' && 'border'
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                striped && rowIndex % 2 === 0 && 'bg-gray-50',
                hover && 'hover:bg-gray-100 transition-colors'
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    'p-3',
                    bordered && 'border',
                    headerStyle === 'none' && rowIndex === 0 && 'border-t'
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};