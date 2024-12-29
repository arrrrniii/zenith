import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const statusConfig = {
  published: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle2,
    description: 'Tour is live and bookable'
  },
  draft: {
    color: 'bg-gray-100 text-gray-800',
    icon: AlertCircle,
    description: 'Tour is not yet published'
  },
  archived: {
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    description: 'Tour is no longer available'
  }
};

export const TourStatusDropdown = ({ status, tourId, onStatusChange }) => {
  const handleStatusChange = async (newStatus) => {
    try {
      if (typeof onStatusChange !== 'function') {
        throw new Error('onStatusChange is not a function');
      }
      await onStatusChange(tourId, newStatus);
    } catch (error) {
      console.error('Failed to update tour status:', error);
    }
  };

  const CurrentIcon = statusConfig[status]?.icon || AlertCircle;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <span className={`inline-flex items-center ${statusConfig[status]?.color || statusConfig.draft.color}`}>
            <CurrentIcon className="w-3 h-3 mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
      {Object.entries(statusConfig).map(([statusKey, { icon: Icon, color, description }]) => (
          <DropdownMenuItem
            key={statusKey}
            onClick={() => handleStatusChange(statusKey)}
            className={`flex items-center space-x-2 ${status === statusKey ? 'bg-gray-100' : ''}`}
          >
            <Icon className="w-4 h-4" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
              </span>
              <span className="text-xs text-gray-500">{description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TourStatusDropdown;