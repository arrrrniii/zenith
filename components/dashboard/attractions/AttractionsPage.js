// components/dashboard/attractions/AttractionsPage.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Plus } from 'lucide-react';
import AttractionsFilter from './AttractionsFilter';
import AttractionsList from './AttractionsList';
import { useAttractions, useDeleteAttraction } from './hooks/useAttractions';

const ITEMS_PER_PAGE = 10;

const AttractionsPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });
  const [page, setPage] = useState(1);
  
  const { attractions, totalCount, loading, refetch } = useAttractions(filters, {
    limit: ITEMS_PER_PAGE,
    offset: (page - 1) * ITEMS_PER_PAGE
  });
  
  const { deleteAttraction, loading: deleteLoading } = useDeleteAttraction();

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const handleEdit = (attraction) => {
    router.push(`/dashboard/attractions/edit/${attraction.id}`);
  };

  const handleDelete = async (attractionId) => {
    if (window.confirm('Are you sure you want to delete this attraction?')) {
      try {
        await deleteAttraction(attractionId);
        refetch();
      } catch (error) {
        console.error('Error deleting attraction:', error);
        // Handle error (show toast notification, etc.)
      }
    }
  };

  const handleView = (attraction) => {
    router.push(`/dashboard/attractions/view/${attraction.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Attractions</h1>
        <button
          onClick={() => router.push('/dashboard/attractions/new')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Attraction
        </button>
      </div>

      <AttractionsFilter 
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          <AttractionsList
            attractions={attractions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, totalCount)} of {totalCount} attractions
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page * ITEMS_PER_PAGE >= totalCount}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AttractionsPage;