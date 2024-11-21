//tour/ToursHeader.jsx
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

export const ToursHeader = () => {
  const router = useRouter();
  
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Tours</h1>
        <p className="text-sm text-gray-500">
          Manage your tour listings and availability
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* <Button
          variant="outline"
          onClick={() => router.push('/dashboard/tours/import')}
        >
          Import Tours
        </Button> */}
        <Button
          onClick={() => router.push('/dashboard/tours/new')}
          className="flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Tour
        </Button>
      </div>
    </div>
  );
};