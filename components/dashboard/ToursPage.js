import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import TourForm from './tour/TourForm';

// ToursFilter Component
const ToursFilter = ({ onFilterChange }) => (
  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tours..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => onFilterChange?.({ search: e.target.value })}
        />
      </div>
    </div>
    
    <div className="flex gap-3">
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onFilterChange?.({ status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
      
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onFilterChange?.({ type: e.target.value })}
      >
        <option value="">All Types</option>
        <option value="single_day">Single Day</option>
        <option value="multi_day">Multi Day</option>
        <option value="guided">Guided</option>
        <option value="self_guided">Self Guided</option>
      </select>
      
      <button className="flex items-center px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">
        <Filter className="h-4 w-4 mr-2" />
        More Filters
      </button>
    </div>
  </div>
);

// Status Badge Component
const TourStatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle2
    },
    draft: {
      color: 'bg-gray-100 text-gray-800',
      icon: AlertCircle
    },
    archived: {
      color: 'bg-red-100 text-red-800',
      icon: XCircle
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Edit Tour Modal Component
const EditTourModal = ({ tour, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-h-[90vh] overflow-auto w-full max-w-4xl mx-4">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Tour</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <TourForm 
            initialData={tour}
            onSubmit={onSave}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

// Tours Table Component
const ToursTable = ({ onEdit }) => {
  const [selectedTours, setSelectedTours] = useState([]);

  const tours = [
    {
      id: 1,
      title: 'Chicago Architecture Tour',
      type: 'Guided',
      duration: '3 days',
      price: 599.00,
      bookings: 45,
      status: 'active',
      lastModified: '2024-03-15'
    },
    {
      id: 2,
      title: 'City Food Tour',
      type: 'Single Day',
      duration: '6 hours',
      price: 129.00,
      bookings: 0,
      status: 'draft',
      lastModified: '2024-03-14'
    },
    {
      id: 3,
      title: 'Night Photography Tour',
      type: 'Guided',
      duration: '4 hours',
      price: 89.00,
      bookings: 12,
      status: 'active',
      lastModified: '2024-03-13'
    },
    {
      id: 4,
      title: 'Historical Walking Tour',
      type: 'Self Guided',
      duration: '2 hours',
      price: 29.00,
      bookings: 8,
      status: 'archived',
      lastModified: '2024-03-12'
    }
  ];

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

  const handleDelete = (ids) => {
    // Handle delete functionality
    console.log('Deleting tours:', ids);
  };

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
        <button className="text-sm text-gray-500 hover:text-gray-700">
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* Table Content */}
      <div className="divide-y divide-gray-200">
        {tours.map((tour) => (
          <div key={tour.id} className="flex items-center p-4 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={selectedTours.includes(tour.id)}
              onChange={() => toggleSelect(tour.id)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1 ml-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{tour.title}</h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{tour.type}</span>
                    <span>•</span>
                    <span>{tour.duration}</span>
                    <span>•</span>
                    <span>${tour.price}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <TourStatusBadge status={tour.status} />
                  <span className="text-sm text-gray-500">{tour.bookings} bookings</span>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(tour)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          Showing {tours.length} tours
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// Main ToursPage Component
const ToursPage = () => {
  const router = useRouter();
  const [editingTour, setEditingTour] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: ''
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSaveTour = async (data) => {
    try {
      // Handle save tour logic here
      console.log('Saving tour:', data);
      setEditingTour(null);
      // Optionally refresh the tours list
    } catch (error) {
      console.error('Error saving tour:', error);
    }
  };

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

      {/* Filters */}
      <ToursFilter onFilterChange={handleFilterChange} />

      {/* Tours Table */}
      <ToursTable onEdit={setEditingTour} />

      {/* Edit Modal */}
      {editingTour && (
        <EditTourModal
          tour={editingTour}
          onClose={() => setEditingTour(null)}
          onSave={handleSaveTour}
        />
      )}
    </div>
  );
};

export default ToursPage;