import React from 'react';
import { MoreVertical, Eye } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ActivityItem = ({ title, status, bookings, lastModified }) => (
  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <StatusBadge status={status} />
      </div>
      <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
        <span>{bookings} bookings</span>
        <span>•</span>
        <span>Last modified {lastModified}</span>
      </div>
    </div>
    
    <div className="ml-4 flex items-center space-x-2">
      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
        <Eye className="w-4 h-4" />
      </button>
      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const RecentActivity = () => {
  const recentTours = [
    { 
      id: 1,
      title: 'Chicago Architecture Tour', 
      status: 'active', 
      bookings: 45,
      lastModified: '2 hours ago'
    },
    { 
      id: 2,
      title: 'City Food Tour', 
      status: 'draft', 
      bookings: 0,
      lastModified: '5 hours ago'
    },
    { 
      id: 3,
      title: 'Night Photography Tour', 
      status: 'active', 
      bookings: 12,
      lastModified: '1 day ago'
    },
    { 
      id: 4,
      title: 'Historical Walking Tour', 
      status: 'pending', 
      bookings: 8,
      lastModified: '2 days ago'
    },
    { 
      id: 5,
      title: 'Museum Private Tour', 
      status: 'cancelled', 
      bookings: 0,
      lastModified: '3 days ago'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tours</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700">
            View all
          </button>
        </div>

        <div className="space-y-3">
          {recentTours.map((tour) => (
            <ActivityItem
              key={tour.id}
              title={tour.title}
              status={tour.status}
              bookings={tour.bookings}
              lastModified={tour.lastModified}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;