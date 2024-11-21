// components/admin/dashboard/service/blocks/components/DialogHeader.jsx
import { Save, Undo, Redo } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DialogHeader = ({ 
    title, 
    canUndo, 
    canRedo, 
    onUndo, 
    onRedo, 
    onClose, 
    onSave 
  }) => (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-2 ml-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Blog
        </Button>
      </div>
    </div>
  );