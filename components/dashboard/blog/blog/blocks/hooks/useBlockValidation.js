// hooks/useBlockValidation.js
import { useState, useCallback } from 'react';

export const useBlockValidation = () => {
  const [errors, setErrors] = useState([]);

  const validateBlocks = useCallback((blocks) => {
    const newErrors = [];

    // Check for empty blocks
    if (blocks.length === 0) {
      newErrors.push('Content is required');
    }

    // Check for required block properties
    blocks.forEach((block, index) => {
      if (!block.type) {
        newErrors.push(`Block ${index + 1} is missing a type`);
      }
      
      // Validate block-specific requirements
      switch (block.type) {
        case 'heading':
          if (!block.content?.text) {
            newErrors.push(`Heading block ${index + 1} is missing text`);
          }
          break;
        case 'paragraph':
          if (!block.content?.text) {
            newErrors.push(`Paragraph block ${index + 1} is missing text`);
          }
          break;
        case 'image':
          if (!block.content?.url) {
            newErrors.push(`Image block ${index + 1} is missing URL`);
          }
          break;
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  }, []);

  return {
    errors,
    validateBlocks
  };
};