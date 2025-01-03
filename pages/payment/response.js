/* eslint-disable @next/next/no-html-link-for-pages */
// pages/payment/response.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { UPDATE_BOOKING_PAYMENT } from '@/graphql/bookings';
import { Loader2 } from "lucide-react";
import Head from 'next/head';

const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    <span className="ml-2">Verifying payment...</span>
  </div>
);

const SuccessState = ({ bookingRef }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed. Booking reference: {bookingRef}
        </p>
        <div className="space-y-3">
          <a
            href={`/bookings/${bookingRef}`}
            className="block w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            View Booking Details
          </a>
          <a
            href="/"
            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ message, bookingRef }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          {message || "We couldn't process your payment. Please try again."}
          {bookingRef && <><br />Booking reference: {bookingRef}</>}
        </p>
        <div className="space-y-3">
          {bookingRef && (
            <a
              href={`/payment/${bookingRef}`}
              className="block w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Try Payment Again
            </a>
          )}
          <a
            href="/"
            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default function PaymentResponsePage() {
  const router = useRouter();
  const [updateBookingPayment] = useMutation(UPDATE_BOOKING_PAYMENT);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPaymentResponse = async () => {
      try {
        const {
          TransId,
          Response,
          mdStatus,
          oid: bookingRef,
          amount,
          ...otherParams
        } = router.query;

        // Validate required parameters
        if (!TransId || !Response || !mdStatus || !bookingRef) {
          throw new Error('Invalid payment response parameters');
        }

        // Check 3D authentication status
        if (mdStatus !== '1') {
          throw new Error('3D authentication failed');
        }

        // Check payment response
        if (Response !== 'Approved') {
          throw new Error('Payment was not approved');
        }

        // Update booking status in database
        await updateBookingPayment({
          variables: {
            booking_id: bookingRef,
            payment_data: {
              amount: parseFloat(amount),
              payment_method: 'credit_card',
              transaction_id: TransId,
              payment_status: 'completed',
              payment_date: new Date().toISOString(),
              payment_details: JSON.stringify(otherParams)
            },
            booking_status: 'confirmed',
            payment_status: 'completed'
          }
        });

        setStatus('success');
      } catch (err) {
        console.error('Payment processing error:', err);
        setError(err.message);
        setStatus('error');
      }
    };

    if (router.isReady && Object.keys(router.query).length > 0) {
      processPaymentResponse();
    }
  }, [router.isReady, router.query, updateBookingPayment]);

  const bookingRef = router.query.oid;

  return (
    <>
      <Head>
        <title>Payment {status === 'success' ? 'Successful' : 'Status'}</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      {status === 'loading' && <LoadingState />}
      {status === 'success' && <SuccessState bookingRef={bookingRef} />}
      {status === 'error' && <ErrorState message={error} bookingRef={bookingRef} />}
    </>
  )}