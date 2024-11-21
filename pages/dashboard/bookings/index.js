// pages/dashboard/bookings/index.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BookingsPage from '@/components/dashboard/bookings/BookingsPage';

const BookingsIndex = () => {
  return (
    <DashboardLayout pageTitle="Bookings">
      <BookingsPage />
    </DashboardLayout>
  );
};

export default BookingsIndex;