//components/admin/dashboard/blog/blocks/components/BlockCanvas.js
import React, { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useBlockStore from '../store';
import { BlockEditor } from './BlockEditor';
import { Button } from '@/components/ui/button';
import { X, GripVertical } from 'lucide-react';
import { BlockTypeLabel } from './BlockTypeLabel';

export const BlockCanvas = ({ disabled, onChange }) => {
  const { blocks, moveBlock, removeBlock, addBlock, setBlocks } = useBlockStore();

  // Debug log to track blocks in BlockCanvas
  useEffect(() => {
    console.log('BlockCanvas - Current blocks:', blocks);
  }, [blocks]);

  const handleDragEnd = (result) => {
    if (!result.destination || disabled) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for each block
    const reorderedBlocks = items.map((block, index) => ({
      ...block,
      order_index: index
    }));

    console.log('Reordered blocks:', reorderedBlocks);
    setBlocks(reorderedBlocks);

    if (onChange) {
      onChange(reorderedBlocks);
    }
  };

  const handleBlockRemove = (blockId) => {
    if (disabled) return;

    // Get current blocks
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    
    // Reindex remaining blocks
    const reindexedBlocks = updatedBlocks.map((block, index) => ({
      ...block,
      order_index: index
    }));

    console.log('Removing block:', blockId);
    console.log('Updated blocks:', reindexedBlocks);

    removeBlock(blockId);
    
    if (onChange) {
      onChange(reindexedBlocks);
    }
  };

  const handleBlockAdd = (blockType) => {
    if (disabled) return;
    
    const newBlock = {
      id: `${blockType}-${Date.now()}`,
      type: blockType,
      content: {},
      order_index: blocks.length
    };

    console.log('Adding new block:', newBlock);
    addBlock(blockType);

    if (onChange) {
      onChange([...blocks, newBlock]);
    }
  };

  const handleDrop = (e) => {
    if (disabled) return;
    const blockType = e.dataTransfer.getData('block-type');
    if (blockType) {
      handleBlockAdd(blockType);
    }
  };

  // Sort blocks by order_index before rendering
  const sortedBlocks = [...blocks].sort((a, b) => 
    (a.order_index || 0) - (b.order_index || 0)
  );

  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-y-auto h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks" isDropDisabled={disabled}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`min-h-full ${
                snapshot.isDraggingOver && !disabled ? 'bg-blue-50' : ''
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {sortedBlocks.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="mb-2">Drag blocks here</p>
                    <p className="text-sm">or</p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => !disabled && handleBlockAdd('text')}
                      disabled={disabled}
                    >
                      Add a text block
                    </Button>
                  </div>
                </div>
              ) : (
                sortedBlocks.map((block, index) => (
                  <Draggable
                    key={block.id}
                    draggableId={block.id}
                    index={index}
                    isDragDisabled={disabled}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`mb-4 group ${
                          snapshot.isDragging ? 'ring-2 ring-blue-400' : ''
                        }`}
                      >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                          <div className="flex items-center p-3 border-b bg-gray-50">
                            <div {...provided.dragHandleProps} className="cursor-move">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="ml-3 flex-1">
                              <BlockTypeLabel block={block} />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => !disabled && handleBlockRemove(block.id)}
                              disabled={disabled}
                              className="opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="p-4">
                            <BlockEditor block={block} />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};