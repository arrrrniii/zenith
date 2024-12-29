import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { BOOKING_FIELDS, GET_BOOKING } from '@/graphql/bookings';
import { gql } from '@apollo/client';
import BookingsFilter from './BookingsFilter';
import BookingsList from './BookingsList';

const GET_BOOKINGS = gql`
  query GetBookings {
    bookings(order_by: { created_at: desc }) {
      ...BookingFields
    }
  }
  ${BOOKING_FIELDS}
`;

const BookingsPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    tourType: '',
    date: ''
  });

  const { loading, error, data } = useQuery(GET_BOOKINGS);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleViewDetails = (booking) => {
    router.push(`/dashboard/bookings/${booking.id}`);
  };

  // Transform and filter the data client-side
  const transformedBookings = data?.bookings
    .filter(booking => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          booking.booking_reference,
          booking.customer_name,
          booking.tour.title
        ].map(field => field?.toLowerCase());
        
        if (!searchableFields.some(field => field?.includes(searchTerm))) {
          return false;
        }
      }

      // Status filter
      if (filters.status && booking.booking_status !== filters.status) {
        return false;
      }

      // Date filter
      if (filters.date && booking.selected_date !== filters.date) {
        return false;
      }

      // Tour type filter
      if (filters.tourType && !booking.tour.title.toLowerCase().includes(filters.tourType.toLowerCase())) {
        return false;
      }

      return true;
    })
    .map(booking => ({
      id: booking.id,
      bookingNumber: booking.booking_reference,
      tourName: booking.tour.title,
      customerName: booking.customer_name,
      date: booking.selected_date,
      time: 'N/A',
      participants: booking.number_of_participants,
      totalAmount: booking.total_amount,
      status: booking.booking_status,
      bookingDate: new Date(booking.created_at).toISOString().split('T')[0]
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your tour bookings and reservations
          </p>
        </div>
      </div>

      <BookingsFilter onFilterChange={handleFilterChange} />

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error loading bookings: {error.message}
        </div>
      )}

      {!loading && !error && (
        <BookingsList 
          bookings={transformedBookings}
          onViewDetails={handleViewDetails}
        />
      )}

      {!loading && !error && transformedBookings.length > 0 && (
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
                <span className="font-medium">{transformedBookings.length}</span> of{' '}
                <span className="font-medium">{transformedBookings.length}</span> results
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
      )}
    </div>
  );
};

export default BookingsPage;