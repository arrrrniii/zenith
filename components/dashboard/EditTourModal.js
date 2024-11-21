import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Plus } from 'lucide-react';
import ToursFilter from './ToursFilter';
import ToursTable from './ToursTable';
import EditTourModal from './EditTourModal';

const ToursPage = () => {
  const router = useRouter();
  const [editingTour, setEditingTour] = useState(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Tours</h1>
        <button
          onClick={() => router.push('/dashboard/tours/new')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Tour
        </button>
      </div>

      {/* Content */}
      <ToursFilter />
      <ToursTable 
        onEdit={(tour) => setEditingTour(tour)}
      />

      {/* Edit Modal */}
      {editingTour && (
        <EditTourModal
          tour={editingTour}
          onClose={() => setEditingTour(null)}
          onSave={async (data) => {
            // Handle save
            console.log('Saving tour:', data);
            setEditingTour(null);
          }}
        />
      )}
    </div>
  );
};

export default ToursPage;