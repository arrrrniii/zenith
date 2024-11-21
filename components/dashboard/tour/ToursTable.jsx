// components/tours/ToursTable.jsx
import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TourTableRow } from './TourTableRow';

export const ToursTable = ({ 
  tours, 
  loading, 
  onEdit, 
  onDelete, 
  page, 
  pageSize, 
  totalCount, 
  onPageChange 
}) => {
  const [selectedTours, setSelectedTours] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const toggleSelectAll = () => {
    setSelectedTours(selectedTours.length === tours.length ? [] : tours.map(tour => tour.id));
  };

  const toggleSelect = (tourId) => {
    setSelectedTours(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const handleDelete = async (ids) => {
    if (window.confirm('Are you sure you want to delete the selected tours?')) {
      await onDelete(ids);
      setSelectedTours([]);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={selectedTours.length === tours.length}
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          {selectedTours.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {selectedTours.length} selected
              </span>
              <button 
                onClick={() => handleDelete(selectedTours)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => handleSort('created_at')}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            Date {sortConfig.key === 'created_at' && (
              <ArrowUpDown className="w-4 h-4 ml-1" />
            )}
          </button>
          <button 
            onClick={() => handleSort('title')}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            Name {sortConfig.key === 'title' && (
              <ArrowUpDown className="w-4 h-4 ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="divide-y divide-gray-200">
        {tours.map((tour) => (
          <TourTableRow
            key={tour.id}
            tour={tour}
            onEdit={onEdit}
            onDelete={onDelete}
            isSelected={selectedTours.includes(tour.id)}
            onToggleSelect={() => toggleSelect(tour.id)}
          />
        ))}
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {startItem} to {endItem} of {totalCount} tours
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

