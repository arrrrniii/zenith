

// components/tours/ToursEmptyState.jsx
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

export const ToursEmptyState = () => {
  const router = useRouter();
  
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
      <div className="space-y-3">
        <div className="relative mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
          <Plus className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No tours found</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Get started by creating your first tour or import existing tours from a spreadsheet.
        </p>
        <div className="flex items-center justify-center gap-3 pt-3">
          {/* <Button
            variant="outline"
            onClick={() => router.push('/dashboard/tours/import')}
          >
            Import Tours
          </Button> */}
          <Button
            onClick={() => router.push('/dashboard/tours/new')}
          >
            Add New Tour
          </Button>
        </div>
      </div>
    </div>
  );
};