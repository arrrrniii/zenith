// pages/payment/[bookingRef].js
import React, { useEffect } from 'react';
import Head from 'next/head';
import crypto from 'crypto';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_BOOKING } from '@/graphql/bookings';
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    <span className="ml-2">Preparing payment...</span>
  </div>
);

const ErrorState = ({ message, onBack }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="max-w-md mx-auto text-center px-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Payment Error
      </h2>
      <p className="text-gray-600 mb-4">
        {message || "We couldn't process your payment. Please try again later."}
      </p>
      <div className="space-y-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onBack}
          className="w-full px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Return to Booking
        </button>
      </div>
    </div>
  </div>
);

function escapeNestPay(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
}

function generateNestPayHashV3(params, storeKey) {
  const {
    storeKey: _ignoreStoreKey,
    hash: _ignoreHash,
    encoding: _ignoreEncoding,
    ...hashParams
  } = params;

  const sortedKeys = Object.keys(hashParams).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  let plaintext = '';
  for (const key of sortedKeys) {
    const val = hashParams[key];
    plaintext += escapeNestPay(val ?? '') + '|';
  }
  plaintext += escapeNestPay(storeKey);

  const hashBuffer = crypto.createHash('sha512').update(plaintext, 'utf-8').digest();
  return hashBuffer.toString('base64');
}

function PaymentPage() {
  const router = useRouter();
  const { bookingRef } = router.query;

  const { data: bookingData, loading, error } = useQuery(GET_BOOKING, {
    variables: { reference: bookingRef },
    skip: !bookingRef,
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    const form = document.getElementById('nestpay-form');
    if (form && !loading && !error && bookingData?.bookings?.[0]) {
      form.submit();
    }
  }, [loading, error, bookingData]);

  const handleBack = () => {
    if (bookingRef) {
      router.push(`/bookings/${bookingRef}`);
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error.message} onBack={handleBack} />;
  }

  const booking = bookingData?.bookings?.[0];
  if (!booking) {
    return <ErrorState message="Booking not found" onBack={handleBack} />;
  }

  // NestPay configuration
  const clientId = '520036124';
  const storeKey = 'SKEY4550';
  const nestPayUrl = 'https://torus-stage-bkt.asseco-see.com.tr/fim/est3Dgate';
  const appUrl = 'http://localhost:3000';

  const nowStr = String(Date.now());
  const nestPayParams = {
    clientId,
    amount: booking.total_amount.toFixed(2),
    currency: '008', // TRY
    storetype: '3D_PAY_HOSTING',
    hashAlgorithm: 'ver3',
    rnd: nowStr,
    tranType: 'Auth',
    instalment: '',
    oid: booking.booking_reference,
    lang: 'en',
    okUrl: `${appUrl}/payment/response`,
    failUrl: `${appUrl}/payment/response`,
    BillToName: booking.customer_name,
    BillToCompany: 'Zenith Travel',
    email: booking.customer_email,
    tel: booking.customer_phone,
    description: `Tour booking: ${booking.tour.title}`,
    callbackUrl: `https://webhook.site/ca4d8a8a-a209-4d21-bba2-a42a3c352a50`,
    refreshTime: '5'
  };

  const hash = generateNestPayHashV3(nestPayParams, storeKey);
  const nestPayFormData = {
    ...nestPayParams,
    hash,
    encoding: 'UTF-8'
  };

  // Format date for display
  const bookingDate = new Date(booking.selected_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <Head>
        <title>Processing Payment</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Redirecting to Secure Payment
            </h1>
            <p className="text-gray-600">
              Please do not refresh or close this page. You will be redirected to the bank's secure payment page.
            </p>
          </div>

          <form
            id="nestpay-form"
            method="POST"
            action={nestPayUrl}
            className="space-y-4"
          >
            {Object.entries(nestPayFormData).map(([key, val]) => (
              <input key={key} type="hidden" name={key} value={val} />
            ))}

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Booking Reference:</dt>
                  <dd className="font-medium">{booking.booking_reference}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Tour:</dt>
                  <dd className="font-medium">{booking.tour.title}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Date:</dt>
                  <dd className="font-medium">{bookingDate}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Participants:</dt>
                  <dd className="font-medium">{booking.number_of_participants}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Amount:</dt>
                  <dd className="font-medium">₺{booking.total_amount.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Proceed to Payment
              </button>
              <p className="mt-4 text-sm text-gray-500">
                You will be redirected to the bank's secure 3D payment page
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PaymentPage;

// Disable automatic static optimization for this page
export const dynamic = 'force-dynamic';