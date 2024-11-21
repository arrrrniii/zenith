// components/dashboard/tour/EditTourModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TourForm from './TourForm';
import { X } from 'lucide-react';

export const EditTourModal = ({ tour, onClose, onSave, isLoading }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 sticky top-0 bg-white border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Edit Tour</DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>
        <div className="p-6 pt-4">
          <TourForm 
            initialData={tour}
            onSubmit={onSave}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};