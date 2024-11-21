// components/admin/dashboard/service/blocks/components/editors/TableEditor.js
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, MoveVertical, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export const TableEditor = ({ content, onChange }) => {
  // Initialize default content
  const tableContent = {
    headers: ['Column 1', 'Column 2'],
    rows: [['', '']],
    striped: true,
    bordered: true,
    hover: true,
    compact: false,
    headerStyle: 'dark', // dark, light, none
    alignment: 'left', // left, center, right
    ...content
  };

  const addColumn = () => {
    const newHeaders = [...tableContent.headers, `Column ${tableContent.headers.length + 1}`];
    const newRows = tableContent.rows.map(row => [...row, '']);
    onChange({
      ...tableContent,
      headers: newHeaders,
      rows: newRows
    });
  };

  const addRow = () => {
    const newRow = new Array(tableContent.headers.length).fill('');
    onChange({
      ...tableContent,
      rows: [...tableContent.rows, newRow]
    });
  };

  const removeColumn = (index) => {
    const newHeaders = tableContent.headers.filter((_, i) => i !== index);
    const newRows = tableContent.rows.map(row => row.filter((_, i) => i !== index));
    onChange({
      ...tableContent,
      headers: newHeaders,
      rows: newRows
    });
  };

  const removeRow = (index) => {
    const newRows = tableContent.rows.filter((_, i) => i !== index);
    onChange({
      ...tableContent,
      rows: newRows
    });
  };

  const updateHeader = (index, value) => {
    const newHeaders = [...tableContent.headers];
    newHeaders[index] = value;
    onChange({
      ...tableContent,
      headers: newHeaders
    });
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const newRows = [...tableContent.rows];
    newRows[rowIndex] = [...newRows[rowIndex]];
    newRows[rowIndex][colIndex] = value;
    onChange({
      ...tableContent,
      rows: newRows
    });
  };

  const handleRowDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tableContent.rows);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({
      ...tableContent,
      rows: items
    });
  };

  return (
    <div className="space-y-6">
      {/* Table Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Header Style</Label>
          <Select
            value={tableContent.headerStyle}
            onValueChange={(value) => onChange({ ...tableContent, headerStyle: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select header style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Alignment</Label>
          <div className="flex gap-2 mt-2">
            {['left', 'center', 'right'].map((align) => (
              <Button
                key={align}
                variant={tableContent.alignment === align ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange({ ...tableContent, alignment: align })}
                className="flex-1"
              >
                {align === 'left' && <AlignLeft className="w-4 h-4" />}
                {align === 'center' && <AlignCenter className="w-4 h-4" />}
                {align === 'right' && <AlignRight className="w-4 h-4" />}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={tableContent.striped}
            onCheckedChange={(checked) => 
              onChange({ ...tableContent, striped: checked })
            }
          />
          <Label>Striped Rows</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={tableContent.bordered}
            onCheckedChange={(checked) => 
              onChange({ ...tableContent, bordered: checked })
            }
          />
          <Label>Bordered</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={tableContent.hover}
            onCheckedChange={(checked) => 
              onChange({ ...tableContent, hover: checked })
            }
          />
          <Label>Hover Effect</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={tableContent.compact}
            onCheckedChange={(checked) => 
              onChange({ ...tableContent, compact: checked })
            }
          />
          <Label>Compact</Label>
        </div>
      </div>

      {/* Table Editor */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`bg-${tableContent.headerStyle === 'dark' ? 'gray-800 text-white' : 'gray-100'}`}>
              <tr>
                <th className="w-10 p-2"></th>
                {tableContent.headers.map((header, index) => (
                  <th key={index} className="p-2">
                    <div className="flex gap-2">
                      <Input
                        value={header}
                        onChange={(e) => updateHeader(index, e.target.value)}
                        placeholder={`Column ${index + 1}`}
                        className="min-w-[150px]"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeColumn(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </th>
                ))}
                <th className="w-10 p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addColumn}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </th>
              </tr>
            </thead>
            <DragDropContext onDragEnd={handleRowDragEnd}>
              <Droppable droppableId="table-rows">
                {(provided) => (
                  <tbody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {tableContent.rows.map((row, rowIndex) => (
                      <Draggable
                        key={rowIndex}
                        draggableId={`row-${rowIndex}`}
                        index={rowIndex}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={tableContent.striped && rowIndex % 2 ? 'bg-gray-50' : ''}
                          >
                            <td className="w-10 p-2">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-move text-gray-400 hover:text-gray-600"
                              >
                                <MoveVertical className="w-4 h-4" />
                              </div>
                            </td>
                            {row.map((cell, colIndex) => (
                              <td key={colIndex} className="p-2">
                                <Input
                                  value={cell}
                                  onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                  placeholder={`Cell ${rowIndex + 1}-${colIndex + 1}`}
                                />
                              </td>
                            ))}
                            <td className="w-10 p-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeRow(rowIndex)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
          </table>
        </div>
        <div className="p-2 border-t bg-gray-50">
          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Row
          </Button>
        </div>
      </div>


    </div>
  );
};