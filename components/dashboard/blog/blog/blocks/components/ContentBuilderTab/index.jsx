//components/admin/dashboard/blog/blocks/components/ContentBuilderTab/index.jsx
import React, { useEffect } from 'react';
import { BlockPalette } from '../BlockPalette';
import { BlockCanvas } from '../BlockCanvas';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useBlockValidation } from '../../hooks/useBlockValidation';
import useBlockStore from '../../store';

export const ContentBuilderTab = ({ disabled, onBlocksChange }) => {
  const { blocks, setBlocks } = useBlockStore();
  const { errors, validateBlocks } = useBlockValidation();

  // Debug log to track incoming blocks
  useEffect(() => {
    console.log('ContentBuilderTab - Current blocks:', blocks);
  }, [blocks]);

  const handleBlocksChange = (newBlocks) => {
    console.log('ContentBuilderTab - Blocks changing to:', newBlocks);
    validateBlocks(newBlocks);
    setBlocks(newBlocks);
    if (onBlocksChange) {
      onBlocksChange(newBlocks);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {errors.length > 0 && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc ml-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 flex overflow-hidden">
        <BlockPalette disabled={disabled} />
        <BlockCanvas
          onChange={handleBlocksChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};