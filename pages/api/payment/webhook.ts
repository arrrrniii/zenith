// pages/api/payment/webhook.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { client } from '@/lib/apollo-client';
import { GET_BOOKING, UPDATE_BOOKING_PAYMENT } from '@/graphql/bookings';

// Helper to parse NestPay date format
const parseNestPayDate = (dateStr: string) => {
  // Format: "20250103 22:19:46"
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const time = dateStr.substring(9);
  return new Date(`${year}-${month}-${day}T${time}`).toISOString();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('=== NestPay Webhook Handler Started ===');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      oid: booking_reference,
      Response,
      mdStatus,
      amount,
      TransId,
      AuthCode,
      maskedCreditCard,
      EXTRA_TRXDATE: transactionDate,
      clientIp,
      currency,
      EXTRA_CARDISSUER: cardIssuer,
      EXTRA_CARDBRAND: cardBrand,
      HostRefNum,
      ReturnOid
    } = req.body;

    console.log('Processing payment webhook:', {
      booking_reference,
      Response,
      mdStatus
    });

    // Validate required fields
    if (!booking_reference || !Response || !mdStatus) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get booking details
    const { data: bookingData } = await client.query({
      query: GET_BOOKING,
      variables: { reference: booking_reference },
      fetchPolicy: 'no-cache'
    });

    const booking = bookingData?.bookings?.[0];
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Determine payment status based on NestPay response
    const isSuccessful = Response === 'Approved' && mdStatus === '1';
    const payment_status = isSuccessful ? 'paid' : 'failed';
    const booking_status = isSuccessful ? 'confirmed' : 'pending';

    // Prepare payment data
    const payment_data = {
      booking_id: booking.id,
      amount: parseFloat(amount),
      payment_method: 'credit_card',
      transaction_id: TransId,
      payment_status,
      payment_date: transactionDate ? parseNestPayDate(transactionDate) : new Date().toISOString(),
      // Additional payment details
      masked_card_number: maskedCreditCard?.replace(/\s+/g, '') || null,
      authorization_code: AuthCode || null,
      card_issuer: cardIssuer || null,
      card_brand: cardBrand || null,
      client_ip: clientIp || null,
      currency: currency || '008',
      host_reference: HostRefNum || null,
      response_code: mdStatus,
      response_message: Response
    };

    // Update payment record and booking status
    const { data: updateData } = await client.mutate({
      mutation: UPDATE_BOOKING_PAYMENT,
      variables: {
        booking_id: booking.id,
        payment_data,
        booking_status,
        payment_status
      }
    });

    console.log('Payment record updated:', {
      booking_reference,
      payment_status,
      booking_status
    });

    // Return appropriate response
    return res.status(200).json({
      success: true,
      message: 'Payment webhook processed',
      booking_reference,
      payment_status,
      booking_status
    });

  } catch (error) {
    console.error('Payment Webhook Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment webhook processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}