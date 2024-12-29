import { Eye, Edit, Trash2 } from 'lucide-react';
import { TourStatusDropdown } from './TourStatusDropdown';

export const TourTableRow = ({ 
  tour, 
  onEdit, 
  onDelete, 
  isSelected, 
  onToggleSelect,
  onStatusChange  // Add this prop
 
}) => (
  <div className="flex items-center p-4 hover:bg-gray-50">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={onToggleSelect}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <div className="flex-1 ml-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{tour.title}</h3>
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
            <span>{tour.tour_type}</span>
            <span>•</span>
            <span>{tour.duration} {tour.duration_type}</span>
            <span>•</span>
            <span>${tour.tour_pricing?.price_per_person ?? 'N/A'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <TourStatusDropdown 
            status={tour.status} 
            tourId={tour.id}
            onStatusChange={onStatusChange}
          />
          <span className="text-sm text-gray-500">
            {tour.tour_dates_aggregate?.aggregate?.count ?? 0} bookings
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              onClick={() => window.open(`/trip/${tour.id}`, '_blank')}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(tour)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete([tour.id])}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);