// components/dashboard/tour/ToursTable.jsx
import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TourTableRow } from './TourTableRow';

export const ToursTable = ({ 
  tours = [], 
  loading, 
  onEdit, 
  onDelete, 
  page = 1, 
  pageSize = 10, 
  totalCount = 0, 
  onStatusChange, 
  onPageChange
}) => {
  const [selectedTours, setSelectedTours] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const toggleSelectAll = () => {
    setSelectedTours(prev => prev.length === tours.length ? [] : tours.map(tour => tour.id));
  };

  const toggleSelect = (tourId) => {
    setSelectedTours(prev => prev.includes(tourId) 
      ? prev.filter(id => id !== tourId)
      : [...prev, tourId]
    );
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
          {Array.from({ length: 3 }).map((_, i) => (
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
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={selectedTours.length === tours.length}
            onCheckedChange={toggleSelectAll}
          />
          {selectedTours.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {selectedTours.length} selected
              </span>
              <Button 
                variant="ghost"
                className="text-sm text-red-600 hover:text-red-700"
                onClick={() => onDelete(selectedTours)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost"
            onClick={() => handleSort('created_at')}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            Date {sortConfig.key === 'created_at' && (
              <ArrowUpDown className="w-4 h-4 ml-1" />
            )}
          </Button>
          <Button 
            variant="ghost"
            onClick={() => handleSort('title')}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            Name {sortConfig.key === 'title' && (
              <ArrowUpDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {tours.map((tour) => (
          <TourTableRow
            key={tour.id}
            tour={tour}
            onEdit={() => onEdit(tour)}
            onDelete={() => onDelete([tour.id])}
            isSelected={selectedTours.includes(tour.id)}
            onToggleSelect={() => toggleSelect(tour.id)}
            onStatusChange={onStatusChange}  // Pass it here

          />
        ))}
      </div>

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