// components/BlockRenderer/blocks/ColumnsBlock.jsx
import React from 'react';
import { cn } from '@/lib/utils';

export const ColumnsBlock = ({ content, renderer: BlockRenderer }) => {
  // Early return if no content
  if (!content || !content.columns) {
    return null;
  }

  const { 
    columns = [], 
    gap = '4', 
    layout = 'equal',
    customWidths = []
  } = content;

  // Convert gap size to Tailwind classes
  const gapSizeMap = {
    '2': 'gap-2',
    '4': 'gap-4',
    '6': 'gap-6',
    '8': 'gap-8',
    '12': 'gap-12'
  };

  // For equal width columns, use responsive classes
  const getEqualWidthClass = (columnCount) => {
    const columnClasses = {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    };
    return columnClasses[columnCount] || 'grid-cols-1 md:grid-cols-2';
  };

  // Build grid template columns based on layout type
  const getGridStyle = () => {
    if (layout === 'custom' && customWidths.length) {
      return {
        gridTemplateColumns: customWidths.join(' ')
      };
    }
    
    if (layout === 'auto') {
      return {
        gridTemplateColumns: `repeat(${columns.length}, auto)`
      };
    }
    
    return {}; // For equal width, we'll use Tailwind classes
  };

  // Build container classes based on configuration
  const containerClasses = cn(
    'grid',
    layout === 'equal' && getEqualWidthClass(columns.length),
    gapSizeMap[gap] || 'gap-4',
    // Add responsive padding/margin if needed
    'my-6'
  );

  return (
    <div 
      className={containerClasses}
      style={getGridStyle()}
    >
      {columns.map((column, index) => {
        // Extract column-specific styles and blocks
        const { blocks = [], styles = {} } = column;

        return (
          <div
            key={index}
            className={cn(
              'min-h-[1rem]',
              // Add responsive styles for mobile
              'relative'
            )}
            style={{
              backgroundColor: styles.backgroundColor || 'transparent',
              padding: styles.padding || '1rem',
              border: styles.border || 'none',
              borderRadius: styles.borderRadius || '0.5rem',
              ...styles // Apply any additional custom styles
            }}
          >
            {/* Only render blocks if there are any */}
            {Array.isArray(blocks) && blocks.length > 0 && (
              <div className={cn(
                'space-y-6', // Add vertical spacing between blocks
                // Add any additional wrapper classes needed
              )}>
                {/* Use the provided BlockRenderer to render each block */}
                <BlockRenderer
                  blocks={blocks}
                  nested={true} // Indicate these blocks are nested
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Type validation (if using TypeScript)
const columnShape = {
  blocks: Array,
  styles: {
    backgroundColor: String,
    padding: String,
    border: String,
    borderRadius: String
  }
};

const contentShape = {
  columns: Array,
  gap: String,
  layout: String,
  customWidths: Array
};