// components/dashboard/bookings/BookingStatusBadge.js
import React from 'react';
import { CheckCircle, Clock, XCircle, Flag } from 'lucide-react';

const statusConfig = {
  confirmed: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock
  },
  cancelled: {
    color: 'bg-red-100 text-red-800',
    icon: XCircle
  },
  completed: {
    color: 'bg-blue-100 text-blue-800',
    icon: Flag
  }
};

const BookingStatusBadge = ({ status }) => {
  const config = statusConfig[status.toLowerCase()];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default BookingStatusBadge;