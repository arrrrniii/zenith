//pages/dashboard/bookings/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { BOOKING_FIELDS } from '@/graphql/bookings';
import { GET_TOUR_BY_ID } from '@/graphql/queries';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BookingDetails from '@/components/dashboard/bookings/BookingDetails';

// Updated GraphQL query to include booking_payments
const GET_BOOKING_BY_ID = gql`
  query GetBookingById($id: uuid!) {
    bookings_by_pk(id: $id) {
      ...BookingFields
      booking_payments {
        id
        amount
        payment_method
        transaction_id
        payment_status
        payment_date
        created_at
      }
    }
  }
  ${BOOKING_FIELDS}
`;

const BookingDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Fetch booking details
  const { 
    loading: bookingLoading, 
    error: bookingError, 
    data: bookingData 
  } = useQuery(GET_BOOKING_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only' // Ensures we always get fresh data
  });

  // Fetch tour details
  const { 
    loading: tourLoading, 
    error: tourError, 
    data: tourData 
  } = useQuery(GET_TOUR_BY_ID, {
    variables: { id: bookingData?.bookings_by_pk?.tour_id },
    skip: !bookingData?.bookings_by_pk?.tour_id
  });

  const loading = bookingLoading || tourLoading;
  const error = bookingError || tourError;

  if (loading) {
    return (
      <DashboardLayout pageTitle="Booking Details">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout pageTitle="Booking Details">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error loading booking details: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  if (!bookingData?.bookings_by_pk) {
    return (
      <DashboardLayout pageTitle="Booking Details">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">Booking Not Found</h2>
          <p className="mt-2 text-gray-600">
            The booking you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => router.push('/dashboard/bookings')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Bookings
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const booking = bookingData.bookings_by_pk;
  const tour = tourData?.tours_by_pk;

  // Get the successful payment if exists
  const successfulPayment = booking.booking_payments?.find(
    payment => payment.payment_status === 'paid'
  );

  // Transform the data for BookingDetails component
  const transformedBookingData = {
    // Basic booking information
    id: booking.id,
    bookingNumber: booking.booking_reference,
    status: booking.booking_status,
    bookingDate: booking.created_at,
    
    // Customer information
    customerName: booking.customer_name,
    customerEmail: booking.customer_email,
    customerPhone: booking.customer_phone,
    
    // Tour details
    tourName: tour?.title || 'Tour name not available',
    date: booking.selected_date,
    time: tour?.default_start_time || '',
    participants: booking.number_of_participants,
    meetingPoint: tour?.meeting_point || 'Meeting point details will be provided',
    tourDescription: tour?.description || 'Tour description not available',
    
    // Payment information
    subtotal: booking.total_amount - (booking.tax || 0),
    tax: booking.tax || 0,
    totalAmount: booking.total_amount,
    paymentStatus: booking.payment_status,
    paymentMethod: successfulPayment?.payment_method || 'Not specified',
    paymentDate: successfulPayment?.payment_date,
    booking_payments: booking.booking_payments || [],
    
    // Additional tour details
    price: tour?.tour_pricing?.price_per_person || 0,
    duration: tour ? `${tour.duration} ${tour.duration_type}` : 'Duration not available',
    tourType: tour?.tour_type || 'Standard Tour',
    difficulty: tour?.difficulty_level,
    maxCapacity: tour?.tour_pricing?.max_capacity,
    refundPolicy: tour?.tour_pricing?.refund_policy,
    
    // Tour activities
    activities: tour?.tour_activities?.map(activity => ({
      title: activity.title,
      duration: activity.duration,
      description: activity.description,
      location: activity.location
    })) || [],

    // Timeline events
    events: [
      {
        id: 'booking-created',
        type: 'status',
        content: 'Booking created',
        date: booking.created_at
      },
      ...(successfulPayment ? [{
        id: 'payment-received',
        type: 'payment',
        content: 'Payment received',
        date: successfulPayment.payment_date,
        paymentMethod: successfulPayment.payment_method,
        transactionId: successfulPayment.transaction_id
      }] : []),
      {
        id: 'tour-date',
        type: 'upcoming',
        content: 'Tour date',
        date: booking.selected_date
      }
    ].filter(event => event.date) // Remove events without dates
  };

  return (
    <DashboardLayout pageTitle="Booking Details">
      <BookingDetails booking={transformedBookingData} />
    </DashboardLayout>
  );
};

export default BookingDetailsPage;