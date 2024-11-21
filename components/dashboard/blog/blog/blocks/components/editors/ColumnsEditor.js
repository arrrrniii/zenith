// ColumnsEditor.jsx
import React, { useCallback, memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { BlockEditor } from '../BlockEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GripVertical, Plus, X, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BLOCKS_CONFIG, BLOCK_CATEGORIES } from '../../config';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

const DEFAULT_COLUMN_STYLES = {
  backgroundColor: 'transparent',
  padding: '1rem',
  border: 'none',
  borderRadius: '0.5rem',
};

// Memoized BlockSelector component
const BlockSelector = memo(({ onSelect, disabled }) => {
  const blocksByCategory = React.useMemo(() => {
    return BLOCKS_CONFIG.reduce((acc, block) => {
      if (block.id === 'columns') return acc;

      if (!acc[block.category]) {
        acc[block.category] = [];
      }
      acc[block.category].push(block);
      return acc;
    }, {});
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          disabled={disabled}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <ScrollArea className="h-[300px]">
          {Object.entries(blocksByCategory).map(([category, blocks]) => (
            <div key={category} className="p-2">
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase">
                {BLOCK_CATEGORIES[category]?.label || category}
              </div>
              {blocks.map((block) => {
                const Icon = block.icon;
                return (
                  <DropdownMenuItem
                    key={block.id}
                    onClick={() => onSelect(block.id)}
                  >
                    <div className="flex items-center gap-2 py-1">
                      {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                      <div>
                        <div className="text-sm font-medium">{block.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {block.description}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
            </div>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

BlockSelector.displayName = 'BlockSelector';

// Memoized ColumnStyleEditor component
const ColumnStyleEditor = memo(({ styles, onStyleChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Background Color</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            type="color"
            value={styles.backgroundColor || 'transparent'}
            onChange={(e) => onStyleChange({ backgroundColor: e.target.value })}
            className="w-12 h-8 p-1"
          />
          <Input
            type="text"
            value={styles.backgroundColor || 'transparent'}
            onChange={(e) => onStyleChange({ backgroundColor: e.target.value })}
            className="flex-1"
            placeholder="e.g. #ffffff, rgb(255,255,255)"
          />
        </div>
      </div>
      <div>
        <Label>Padding</Label>
        <Input
          type="text"
          value={styles.padding || '1rem'}
          onChange={(e) => onStyleChange({ padding: e.target.value })}
          placeholder="e.g. 1rem, 16px, 1rem 2rem"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Border</Label>
        <Input
          type="text"
          value={styles.border || 'none'}
          onChange={(e) => onStyleChange({ border: e.target.value })}
          placeholder="e.g. 1px solid #eee"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Border Radius</Label>
        <Input
          type="text"
          value={styles.borderRadius || '0.5rem'}
          onChange={(e) => onStyleChange({ borderRadius: e.target.value })}
          placeholder="e.g. 0.5rem, 8px"
          className="mt-1.5"
        />
      </div>
    </div>
  );
});

ColumnStyleEditor.displayName = 'ColumnStyleEditor';

// Memoized ColumnBlock component
const ColumnBlock = memo(
  ({ block, columnIndex, blockIndex, onRemove, onBlockChange, provided, snapshot }) => {
    const handleBlockUpdate = useCallback(
      (newContent) => {
        if (!newContent || Object.keys(newContent).length === 0) return;

        onBlockChange(columnIndex, blockIndex, newContent);
      },
      [columnIndex, blockIndex, onBlockChange]
    );

    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        className={cn(
          'mb-4 group bg-background rounded-lg border shadow-sm',
          snapshot.isDragging ? 'ring-2 ring-primary' : ''
        )}
      >
        <div className="flex items-center p-2 border-b bg-muted/40">
          <div {...provided.dragHandleProps}>
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="ml-2 flex-1 text-sm">
            {BLOCKS_CONFIG.find((b) => b.id === block.type)?.label || 'Block'}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(columnIndex, blockIndex)}
            className="opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4">
          <BlockEditor block={block} onChange={handleBlockUpdate} />
        </div>
      </div>
    );
  }
);

ColumnBlock.displayName = 'ColumnBlock';

// Main ColumnsEditor component
const ColumnsEditor = ({ content, onChange }) => {
  // Initialize content with defaults if empty
  const columns = content.columns || [
    { blocks: [], styles: DEFAULT_COLUMN_STYLES },
    { blocks: [], styles: DEFAULT_COLUMN_STYLES },
  ];

  const columnGap = content.gap || '4';
  const columnLayout = content.layout || 'equal';
  const customWidths = content.customWidths || columns.map(() => '1fr');

  const handleColumnCountChange = useCallback(
    (count) => {
      const newCount = parseInt(count);
      let newColumns = [...columns];

      if (newCount > columns.length) {
        while (newColumns.length < newCount) {
          newColumns.push({ blocks: [], styles: DEFAULT_COLUMN_STYLES });
        }
      } else {
        newColumns = newColumns.slice(0, newCount);
      }

      onChange({
        ...content,
        columns: newColumns,
        customWidths:
          newCount === columns.length ? customWidths : Array(newCount).fill('1fr'),
      });
    },
    [columns, content, customWidths, onChange]
  );

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      const sourceColIndex = parseInt(result.source.droppableId.split('-')[1]);
      const destColIndex = parseInt(result.destination.droppableId.split('-')[1]);
      const sourceIndex = result.source.index;
      const destIndex = result.destination.index;

      const newColumns = [...columns];
      const [movedBlock] = newColumns[sourceColIndex].blocks.splice(
        sourceIndex,
        1
      );
      newColumns[destColIndex].blocks.splice(destIndex, 0, movedBlock);

      onChange({
        ...content,
        columns: newColumns,
      });
    },
    [columns, content, onChange]
  );

  const addBlockToColumn = useCallback(
    (columnIndex, blockType) => {
      const newColumns = [...columns];
      const blockConfig = BLOCKS_CONFIG.find((block) => block.id === blockType);
      const newBlock = {
        id: `block-${Date.now()}-${Math.random()}`,
        type: blockType,
        content: blockConfig?.defaultContent || {},
      };

      newColumns[columnIndex].blocks.push(newBlock);

      onChange({
        ...content,
        columns: newColumns,
      });
    },
    [columns, content, onChange]
  );

  const removeBlockFromColumn = useCallback(
    (columnIndex, blockIndex) => {
      const newColumns = [...columns];
      newColumns[columnIndex].blocks.splice(blockIndex, 1);

      onChange({
        ...content,
        columns: newColumns,
      });
    },
    [columns, content, onChange]
  );

  const updateColumnStyle = useCallback(
    (columnIndex, styles) => {
      const newColumns = [...columns];
      newColumns[columnIndex].styles = {
        ...newColumns[columnIndex].styles,
        ...styles,
      };

      onChange({
        ...content,
        columns: newColumns,
      });
    },
    [columns, content, onChange]
  );

  const updateColumnWidth = useCallback(
    (columnIndex, width) => {
      const newWidths = [...customWidths];
      newWidths[columnIndex] = width;

      onChange({
        ...content,
        customWidths: newWidths,
      });
    },
    [content, customWidths, onChange]
  );

  // Function to update block content within a column
  const updateBlockInColumn = useCallback(
    (columnIndex, blockIndex, contentUpdates) => {
      const newColumns = [...columns];
      const block = newColumns[columnIndex].blocks[blockIndex];
      newColumns[columnIndex].blocks[blockIndex] = {
        ...block,
        content: contentUpdates,
      };
      onChange({
        ...content,
        columns: newColumns,
      });
    },
    [columns, content, onChange]
  );

  return (
    <div className="space-y-6">
      {/* Column Controls */}
      <div className="flex items-center gap-4 pb-4 border-b">
        <Select value={columns.length.toString()} onValueChange={handleColumnCountChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Columns" />
          </SelectTrigger>
          <SelectContent>
            {[2, 3, 4].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} Columns
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={columnGap} onValueChange={(value) => onChange({ ...content, gap: value })}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Gap" />
          </SelectTrigger>
          <SelectContent>
            {['2', '4', '6', '8', '12'].map((gap) => (
              <SelectItem key={gap} value={gap}>
                Gap: {gap}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={columnLayout}
          onValueChange={(value) => onChange({ ...content, layout: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equal">Equal Width</SelectItem>
            <SelectItem value="auto">Auto Width</SelectItem>
            <SelectItem value="custom">Custom Width</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Custom Width Controls */}
      {columnLayout === 'custom' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
          {columns.map((_, index) => (
            <div key={`width-${index}`} className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground w-20">
                Column {index + 1}
              </Label>
              <Input
                type="text"
                value={customWidths[index]}
                onChange={(e) => updateColumnWidth(index, e.target.value)}
                placeholder="e.g., 1fr, 200px"
                className="flex-1"
              />
            </div>
          ))}
        </div>
      )}

      {/* Column Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className={`grid gap-${columnGap}`}
          style={{
            gridTemplateColumns:
              columnLayout === 'custom'
                ? customWidths.join(' ')
                : columnLayout === 'auto'
                ? `repeat(${columns.length}, auto)`
                : `repeat(${columns.length}, 1fr)`,
          }}
        >
          {columns.map((column, columnIndex) => (
            <Droppable key={columnIndex} droppableId={`col-${columnIndex}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'transition-colors',
                    snapshot.isDraggingOver ? 'ring-2 ring-primary/20' : ''
                  )}
                  style={column.styles}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium">Column {columnIndex + 1}</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Palette className="w-4 h-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <ColumnStyleEditor
                          styles={column.styles}
                          onStyleChange={(styles) => updateColumnStyle(columnIndex, styles)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Blocks */}
                  {column.blocks.map((block, blockIndex) => (
                    <Draggable key={block.id} draggableId={block.id} index={blockIndex}>
                      {(provided, snapshot) => (
                        <ColumnBlock
                          block={block}
                          columnIndex={columnIndex}
                          blockIndex={blockIndex}
                          onRemove={removeBlockFromColumn}
                          onBlockChange={updateBlockInColumn}
                          provided={provided}
                          snapshot={snapshot}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  <BlockSelector
                    onSelect={(blockType) => addBlockToColumn(columnIndex, blockType)}
                  />
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

// Add display name for debugging
ColumnsEditor.displayName = 'ColumnsEditor';

// Export memoized version
export default memo(ColumnsEditor);
