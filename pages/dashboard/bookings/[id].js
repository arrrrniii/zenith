// pages/dashboard/bookings/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BookingDetails from '@/components/dashboard/bookings/BookingDetails';

const BookingDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Sample booking data - replace with actual data fetch
  const bookingData = {
    id: 1,
    bookingNumber: 'BK-2024001',
    tourName: 'Chicago Architecture Tour',
    customerName: 'John Smith',
    customerEmail: 'john.smith@example.com',
    customerPhone: '+1 (555) 123-4567',
    date: '2024-03-20',
    time: '09:00 AM',
    participants: 3,
    subtotal: 279.97,
    tax: 20.00,
    totalAmount: 299.97,
    status: 'confirmed',
    bookingDate: '2024-03-15',
    meetingPoint: '400 N Michigan Ave, Chicago',
    tourDescription: 'Discover Chicago\'s legendary architecture during a 3-hour walking tour.',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card (**** 1234)'
  };

  return (
    <DashboardLayout pageTitle="Booking Details">
      <BookingDetails booking={bookingData} />
    </DashboardLayout>
  );
};

export default BookingDetailsPage;