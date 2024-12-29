// pages/api/payment/failed.ts
import { client } from '../../../lib/apollo-client';
import { GET_BOOKING_STATUS, UPDATE_BOOKING_PAYMENT } from '../../../graphql/bookings';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function failureHandler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get booking_id from either query params or request body
    const booking_id = req.query.id || req.body.booking_id;

    if (!booking_id || typeof booking_id !== 'string') {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const { transaction_id, payment_method, error_code, error_message } = req.body;

    // Get current booking status
    const { data: statusData } = await client.query({
      query: GET_BOOKING_STATUS,
      variables: { id: booking_id },
      fetchPolicy: 'no-cache'
    });

    const currentBooking = statusData.bookings_by_pk;

    if (!currentBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only proceed if payment status is PENDING
    if (currentBooking.payment_status !== 'PENDING') {
      return res.status(400).json({ 
        message: 'Invalid payment status transition', 
        current_status: currentBooking.payment_status 
      });
    }

    // Prepare payment data
    const payment_data = {
      booking_id,
      amount: currentBooking.total_amount,
      payment_method: payment_method || 'ONLINE',
      transaction_id,
      payment_status: 'FAILED',
      payment_date: new Date().toISOString(),
      error_details: {
        error_code: error_code || 'UNKNOWN_ERROR',
        error_message: error_message || 'Payment failed'
      }
    };

    // Update both booking and payment tables
    const { data: updateData } = await client.mutate({
      mutation: UPDATE_BOOKING_PAYMENT,
      variables: {
        booking_id,
        payment_data,
        payment_status: 'FAILED'
      }
    });

    // Redirect to failure page
    res.redirect(307, `/booking/failed?reference=${currentBooking.booking_reference}`);

  } catch (error) {
    console.error('Payment Failure Handler Error:', error);
    res.redirect(307, `/booking/error?message=system-error`);
  }
}