// components/dashboard/bookings/BookingsPage.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import BookingsFilter from './BookingsFilter';
import BookingsList from './BookingsList';

const BookingsPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    tourType: '',
    date: ''
  });

  // Sample data
  const bookings = [
    {
      id: 1,
      bookingNumber: 'BK-2024001',
      tourName: 'Chicago Architecture Tour',
      customerName: 'John Smith',
      date: '2024-03-20',
      time: '09:00 AM',
      participants: 3,
      totalAmount: 299.97,
      status: 'confirmed',
      bookingDate: '2024-03-15'
    },
    {
      id: 2,
      bookingNumber: 'BK-2024002',
      tourName: 'Food Tasting Tour',
      customerName: 'Sarah Johnson',
      date: '2024-03-21',
      time: '11:00 AM',
      participants: 2,
      totalAmount: 159.98,
      status: 'pending',
      bookingDate: '2024-03-16'
    },
    {
      id: 3,
      bookingNumber: 'BK-2024003',
      tourName: 'Night Photography Tour',
      customerName: 'Michael Brown',
      date: '2024-03-19',
      time: '07:00 PM',
      participants: 1,
      totalAmount: 89.99,
      status: 'cancelled',
      bookingDate: '2024-03-14'
    }
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleViewDetails = (booking) => {
    router.push(`/dashboard/bookings/${booking.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your tour bookings and reservations
          </p>
        </div>
      </div>

      {/* Filters */}
      <BookingsFilter onFilterChange={handleFilterChange} />

      {/* Bookings List */}
      <BookingsList 
        bookings={bookings}
        onViewDetails={handleViewDetails}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
        <div className="flex flex-1 justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">10</span> of{' '}
              <span className="font-medium">20</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                2
              </button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;