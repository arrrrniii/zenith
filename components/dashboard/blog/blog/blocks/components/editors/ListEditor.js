// components/admin/dashboard/service/blocks/components/editors/ListEditor.js
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, X, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ListBlock } from '../BlockRenderer/blocks/ListBlock';

export const ListEditor = ({ content, onChange }) => {
  // Initialize default content
  const listContent = {
    type: 'bullet',
    items: [],
    markerColor: 'default',
    spacing: 'normal',
    indented: true,
    ...content
  };

  const addItem = () => {
    onChange({
      ...listContent,
      items: [...listContent.items, '']
    });
  };

  const removeItem = (index) => {
    onChange({
      ...listContent,
      items: listContent.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index, value) => {
    const newItems = [...listContent.items];
    newItems[index] = value;
    onChange({
      ...listContent,
      items: newItems
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(listContent.items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({
      ...listContent,
      items
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {/* List Type Selection */}
        <div>
          <Label>List Type</Label>
          <Select
            value={listContent.type}
            onValueChange={(value) => onChange({ ...listContent, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select list type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bullet">Bullet List</SelectItem>
              <SelectItem value="numbered">Numbered List</SelectItem>
              <SelectItem value="checklist">Checklist</SelectItem>
              <SelectItem value="custom">Custom Markers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Marker Color (for bullet lists) */}
        {listContent.type === 'bullet' && (
          <div>
            <Label>Marker Color</Label>
            <Select
              value={listContent.markerColor}
              onValueChange={(value) => onChange({ ...listContent, markerColor: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select marker color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Spacing Control */}
        <div>
          <Label>Item Spacing</Label>
          <Select
            value={listContent.spacing}
            onValueChange={(value) => onChange({ ...listContent, spacing: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select spacing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tight">Tight</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="relaxed">Relaxed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Indentation Toggle */}
        <div className="flex items-center justify-between">
          <Label>Indent List</Label>
          <Switch
            checked={listContent.indented}
            onCheckedChange={(checked) => onChange({ ...listContent, indented: checked })}
          />
        </div>
      </div>

      {/* List Items */}
      <div className="mt-6">
        <Label>List Items</Label>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="list-items">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2 mt-2"
              >
                {listContent.items.map((item, index) => (
                  <Draggable
                    key={`item-${index}`}
                    draggableId={`item-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-2"
                      >
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <Input
                          value={item}
                          onChange={(e) => updateItem(index, e.target.value)}
                          placeholder={`Item ${index + 1}`}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button
          variant="outline"
          size="sm"
          onClick={addItem}
          className="w-full mt-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Preview */}
      <div className="mt-6 pt-4 border-t">
        <Label className="text-sm text-gray-500">Preview</Label>
        <div className="mt-2">
          <ListBlock content={listContent} />
        </div>
      </div>
    </div>
  );
};