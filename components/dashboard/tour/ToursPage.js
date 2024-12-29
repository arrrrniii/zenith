

// components/dashboard/tour/ToursPage.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ToursHeader } from './ToursHeader';
import { ToursFilter } from './ToursFilter';
import { ToursTable } from './ToursTable';
import { ToursEmptyState } from './ToursEmptyState';
import { LoadingOverlay } from './LoadingOverlay';

export const ToursPage = ({
  tours,
  totalCount,
  loading,
  error,
  isDeleting,
  page,
  pageSize,
  filters,
  selectedTours,
  tourToDelete,
  onPageChange,
  onFilterChange,
  onEdit,
  onDelete,
  onConfirmDelete,
  onCreateTour,
  onSelectTours,
  onBulkDelete,
  onStatusChange
}) => {
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error loading tours: {error.message}
      </div>
    );
  }

  const getDeleteMessage = () => {
    if (!tourToDelete) return '';
    const count = Array.isArray(tourToDelete) ? tourToDelete.length : 1;
    return count > 1 
      ? `Are you sure you want to delete these ${count} tours?` 
      : 'Are you sure you want to delete this tour?';
  };

  return (
    <div className="space-y-6 p-6">
      <ToursHeader 
        onCreateTour={onCreateTour}
        selectedCount={selectedTours.length}
        onBulkDelete={onBulkDelete}
      />

      <ToursFilter
        onFilterChange={onFilterChange}
        isLoading={loading}
        initialFilters={filters}
      />

      {!loading && tours.length === 0 ? (
        <ToursEmptyState onCreateTour={onCreateTour} />
      ) : (
        <ToursTable
          tours={tours}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDelete}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
          selectedTours={selectedTours}
          onSelectTours={onSelectTours}
          onStatusChange={onStatusChange}  // Pass through the correct prop name
          />
      )}

      <AlertDialog 
        open={!!tourToDelete}
        onOpenChange={(open) => !open && onDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {getDeleteMessage()} This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onConfirmDelete(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isDeleting && <LoadingOverlay message="Deleting..." />}
    </div>
  );
};

ToursPage.propTypes = {
  tours: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.string,
      created_at: PropTypes.string,
      tour_type: PropTypes.string,
      duration: PropTypes.number,
      duration_type: PropTypes.string,
      tour_pricing: PropTypes.shape({
        price_per_person: PropTypes.number
      }),
      tour_dates_aggregate: PropTypes.shape({
        aggregate: PropTypes.shape({
          count: PropTypes.number
        })
      })
    })
  ).isRequired,
  totalCount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  isDeleting: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }).isRequired,
  selectedTours: PropTypes.arrayOf(PropTypes.string).isRequired,
  tourToDelete: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  onPageChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
  onCreateTour: PropTypes.func.isRequired,
  onSelectTours: PropTypes.func.isRequired,
  onBulkDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired  // Add this

};

export default ToursPage;