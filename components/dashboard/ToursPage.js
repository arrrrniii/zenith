// pages/dashboard/tours/index.jsx
import { useState } from 'react';
import { ToursHeader } from './tour/ToursHeader';
import { ToursFilter } from './tour/ToursFilter';
import { ToursTable } from './tour/ToursTable';
import { ToursEmptyState } from './tour/ToursEmptyState';
import { EditTourModal } from './tour/EditTourModal';
import { LoadingOverlay } from './tour/LoadingOverlay';
import { useTours } from './tour/hooks/useTours';

const ToursPage = () => {
  const [editingTour, setEditingTour] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: ''
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    tours,
    totalCount,
    loading,
    error,
    isDeleting,
    isUpdating,
    handleDelete,
    handleUpdate
  } = useTours(filters, page, pageSize);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSaveTour = async (tourData) => {
    const success = await handleUpdate(editingTour.id, tourData);
    if (success) {
      setEditingTour(null);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading tours: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToursHeader />
      
      <ToursFilter 
        onFilterChange={handleFilterChange} 
        isLoading={loading} 
      />

      {!loading && tours.length === 0 ? (
        <ToursEmptyState />
      ) : (
        <ToursTable 
          tours={tours}
          loading={loading}
          onEdit={setEditingTour}
          onDelete={handleDelete}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
        />
      )}

      {editingTour && (
        <EditTourModal
          tour={editingTour}
          onClose={() => setEditingTour(null)}
          onSave={handleSaveTour}
          isLoading={isUpdating}
        />
      )}

      {(isDeleting || isUpdating) && (
        <LoadingOverlay 
          message={isDeleting ? 'Deleting...' : 'Saving...'}
        />
      )}
    </div>
  );
};

export default ToursPage;