// pages/dashboard/tours/index.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ToursPage from '@/components/dashboard/tour/ToursPage';
import { useTours } from '@/components/dashboard/tour/hooks/useTours';

const ToursPageWrapper = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  // State management
  const [selectedTours, setSelectedTours] = useState([]);
  const [tourToDelete, setTourToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    startDate: null,
    endDate: null
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Fetch tours data
  const {
    tours,
    totalCount,
    loading,
    error,
    isDeleting,
    handleDelete,
    handleStatusUpdate
  } = useTours(filters, page, pageSize);

  // Event handlers
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    if (tours.length === 0) {
      if (newFilters.status === 'all') delete updatedFilters.status;
      if (newFilters.type === 'all') delete updatedFilters.type;
    }
    setFilters(updatedFilters);
    setPage(1);
  };

  const handleEditTour = (tour) => {
    router.push(`/dashboard/tours/${tour.id}`);
  };

  const handleCreateTour = () => {
    router.push('/dashboard/tours/new');
  };

  const handleDeleteConfirm = async (confirmed) => {
    if (confirmed && tourToDelete) {
      try {
        const idsToDelete = Array.isArray(tourToDelete) ? tourToDelete : [tourToDelete];
        const success = await handleDelete(idsToDelete);
        
        if (success) {
          toast({
            title: "Success",
            description: `${idsToDelete.length > 1 ? 'Tours' : 'Tour'} deleted successfully`
          });
          setSelectedTours([]);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete tour",
          variant: "destructive"
        });
      }
    }
    setTourToDelete(null);
  };

  const handleSelectTours = (ids) => {
    setSelectedTours(ids);
  };

  const handleBulkDelete = () => {
    if (selectedTours.length > 0) {
      setTourToDelete(selectedTours);
    }
  };

  return (
    <DashboardLayout activeSection="tours">
      <ToursPage
        tours={tours}
        totalCount={totalCount}
        loading={loading}
        error={error}
        isDeleting={isDeleting}
        page={page}
        pageSize={pageSize}
        filters={filters}
        selectedTours={selectedTours}
        tourToDelete={tourToDelete}
        onPageChange={setPage}
        onFilterChange={handleFilterChange}
        onEdit={handleEditTour}
        onDelete={setTourToDelete}
        onConfirmDelete={handleDeleteConfirm}
        onCreateTour={handleCreateTour}
        onSelectTours={handleSelectTours}
        onBulkDelete={handleBulkDelete}
        onStatusChange={handleStatusUpdate}

      />
    </DashboardLayout>
  );
};

export default ToursPageWrapper;