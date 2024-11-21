// components/dashboard/bookings/BookingsList.js
import React from 'react';
import { 
  MoreHorizontal, 
  ChevronRight, 
  Users,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

const BookingItem = ({ booking, onViewDetails }) => (
  <div 
    className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
    onClick={() => onViewDetails(booking)}
  >
    <div className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Booking #{booking.bookingNumber}
            </h3>
            <BookingStatusBadge status={booking.status} />
          </div>
          
          <div className="mt-2">
            <h4 className="font-medium text-gray-800">{booking.tourName}</h4>
            <p className="text-sm text-gray-600">{booking.customerName}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              {booking.date}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              {booking.time}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-2" />
              {booking.participants} participants
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <DollarSign className="w-4 h-4 mr-2" />
              ${booking.totalAmount}
            </div>
          </div>
        </div>

        <button className="p-2 hover:bg-gray-50 rounded-full">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
    
    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center rounded-b-lg">
      <div className="text-sm text-gray-500">
        Booked on {booking.bookingDate}
      </div>
      <button 
        className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(booking);
        }}
      >
        View Details
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  </div>
);

const BookingsList = ({ bookings, onViewDetails }) => (
  <div className="space-y-4">
    {bookings.map((booking) => (
      <BookingItem
        key={booking.id}
        booking={booking}
        onViewDetails={onViewDetails}
      />
    ))}
  </div>
);

export default BookingsList;