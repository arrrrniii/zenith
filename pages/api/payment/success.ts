// pages/api/payment/success.ts
import { client } from '../../../lib/apollo-client';
import { GET_BOOKING_STATUS, UPDATE_BOOKING_PAYMENT } from '../../../graphql/bookings';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function successHandler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  console.log('=== Payment Success Handler Started ===');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if request is from URL or body
    const isUrlRequest = req.query.id !== undefined;
    const booking_id = req.query.id || req.body.booking_id;
    
    console.log('Processing booking:', booking_id);
    console.log('Request type:', isUrlRequest ? 'URL' : 'Body');

    if (!booking_id || typeof booking_id !== 'string') {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const { transaction_id, payment_method } = req.body;

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

    console.log('Current booking status:', {
      payment_status: currentBooking.payment_status,
      booking_status: currentBooking.booking_status
    });

    // Check both statuses
    if (currentBooking.payment_status !== 'pending') {
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
      payment_status: 'paid',
      payment_date: new Date().toISOString()
    };

    // Update payment record and both statuses
    const { data: updateData } = await client.mutate({
      mutation: UPDATE_BOOKING_PAYMENT,
      variables: {
        booking_id,
        payment_data,
        booking_status: 'confirmed',
        payment_status: 'paid'
      }
    });

    console.log('Updated booking:', {
      payment_status: updateData.update_bookings_by_pk.payment_status,
      booking_status: updateData.update_bookings_by_pk.booking_status
    });

    // Handle response based on request type
    if (isUrlRequest) {
      // Redirect for URL-based requests
      res.redirect(307, `/booking/success?reference=${currentBooking.booking_reference}`);
    } else {
      // JSON response for body-based requests
      res.status(200).json({
        message: 'Payment processed successfully',
        booking_reference: currentBooking.booking_reference,
        payment_status: 'paid',
        booking_status: 'confirmed'
      });
    }

  } catch (error) {
    console.error('Payment Success Handler Error:', error);
    
    if (req.query.id) {
      // Redirect for URL-based requests
      res.redirect(307, `/booking/error?message=payment-processing-failed`);
    } else {
      // JSON response for body-based requests
      res.status(500).json({
        message: 'Payment processing failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}