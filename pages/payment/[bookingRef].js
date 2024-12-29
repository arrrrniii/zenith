// FILE: /pages/payment/[bookingRef].js
import React, { useEffect } from 'react';
import Head from 'next/head';
import crypto from 'crypto';
import { useRouter } from 'next/router';

/**
 * Helper to escape '\' => '\\' and '|' => '\|'
 */
function escapeNestPay(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
}

/**
 * Generate the NestPay (Hash Version 3):
 *   1) Sort keys (A-Z, case-insensitive)
 *   2) Escape values, join by '|'
 *   3) Append storeKey => '|storeKey'
 *   4) SHA-512 => base64
 */
function generateNestPayHashV3(params, storeKey) {
  const sortedKeys = Object.keys(params).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );
  let plaintext = '';
  for (const key of sortedKeys) {
    // skip "hash" or "encoding" if they exist
    const val = params[key] ?? '';
    plaintext += escapeNestPay(val) + '|';
  }
  plaintext += escapeNestPay(storeKey);

  // Do SHA-512 => base64
  const hashBuffer = crypto.createHash('sha512').update(plaintext, 'utf-8').digest();
  const base64Hash = hashBuffer.toString('base64');

  return base64Hash;
}

export default function PaymentPage({ nestPayFormData, nestPayUrl }) {
  const router = useRouter();

  // Auto-submit the form on mount
  useEffect(() => {
    const form = document.getElementById('nestpay-form');
    if (form) form.submit();
  }, []);

  if (!nestPayFormData) {
    return <div>Loading Payment...</div>;
  }

  return (
    <>
      <Head>
        <title>Redirecting to Bank for 3D Secure</title>
      </Head>
      <div style={{ margin: 40 }}>
        <h1>Redirecting you to secure bank page for card & 3D code...</h1>
        <form id="nestpay-form" method="POST" action={nestPayUrl}>
          {Object.entries(nestPayFormData).map(([key, val]) => (
            <input key={key} type="hidden" name={key} value={val} />
          ))}
          <p>If you are not automatically redirected, click below:</p>
          <button type="submit">Go to 3D Secure</button>
        </form>
      </div>
    </>
  );
}

/**
 * getServerSideProps:
 *   - fetch or mock the booking
 *   - build param object for 3D_PAY_HOSTING
 *   - generate hash
 *   - pass them as props to auto-submit to NestPay
 */
export async function getServerSideProps(context) {
  const { bookingRef } = context.query;

  // 1) Mock fetch a booking from DB
  const booking = {
    bookingRef,
    totalAmount: '95.93', // example
    customerName: 'John Doe',
    currency: '008', // for BKT test
  };

  if (!booking) {
    return { notFound: true };
  }

  // 2) Hardcoded test credentials
  const clientId = '520036124';
  const storeKey = 'SKEY4550';
  // The NestPay 3D Gate URL for your test environment
  const nestPayUrl = 'https://torus-stage-bkt.asseco-see.com.tr/fim/est3Dgate';

  // 3) Build param object for 3D_PAY_HOSTING
  const nowStr = String(Date.now());
  const nestPayParams = {
    clientId,
    amount: booking.totalAmount,
    currency: booking.currency,
    storetype: '3D_PAY_HOSTING', // so the bank page collects card info
    hashAlgorithm: 'ver3',
    rnd: nowStr,
    tranType: 'Auth',
    instalment: '',
    oid: booking.bookingRef || `BK-${Date.now()}-FAKE`,
    lang: 'en',

    // Where the bank will POST success/fail responses
    okUrl: 'https://webhook.site/ca4d8a8a-a209-4d21-bba2-a42a3c352a50/payment/response',
    failUrl: 'https://webhook.site/ca4d8a8a-a209-4d21-bba2-a42a3c352a50/payment/response',

    // optional fields
    BillToName: booking.customerName,
    BillToCompany: 'Zenith Travel',
    callbackUrl: 'https://webhook.site/ca4d8a8a-a209-4d21-bba2-a42a3c352a50/payment/response',
    refreshTime: '5',
  };

  // 4) Generate hash
  const hash = generateNestPayHashV3(nestPayParams, storeKey);

  // 5) Build the final form data
  const nestPayFormData = {
    ...nestPayParams,
    hash,
    storeKey,     // for Hash V3
    encoding: 'UTF-8',
  };

  return {
    props: {
      nestPayFormData,
      nestPayUrl,
    },
  };
}
