// FILE: /pages/payment/response.js

import React from 'react';
import crypto from 'crypto';

/**
 * Escapes '\' => '\\' and '|' => '\|'
 */
function escapeNestPay(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
}

/**
 * Recompute Hash (Version 3) for the response:
 *   1) Sort keys,
 *   2) Escape values, join with '|',
 *   3) Append storeKey,
 *   4) SHA-512 => base64
 */
function generateNestPayHashV3(params, storeKey) {
  const sortedKeys = Object.keys(params).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  let plaintext = '';
  for (const key of sortedKeys) {
    const lowerKey = key.toLowerCase();
    // Skip "hash", "encoding", "countdown" from doc
    if (lowerKey === 'hash' || lowerKey === 'encoding' || lowerKey === 'countdown') {
      continue;
    }
    const val = params[key] ?? '';
    const escapedVal = escapeNestPay(val);
    plaintext += escapedVal + '|';
  }
  plaintext += escapeNestPay(storeKey);

  // DEBUG: Show the final plaintext before hashing
  console.log('[NestPay Debug] [RESPONSE] Plaintext BEFORE hashing:\n', plaintext);

  const hashBuffer = crypto.createHash('sha512').update(plaintext, 'utf-8').digest();
  const base64Hash = hashBuffer.toString('base64');

  // DEBUG: Show the computed base64 hash
  console.log('[NestPay Debug] [RESPONSE] Computed Base64 Hash:\n', base64Hash);

  return base64Hash;
}

export default function PaymentResponsePage({ isSuccess, isDeclined, message, postedFields }) {
  return (
    <div style={{ margin: 40 }}>
      <h1>Payment Response</h1>

      {isDeclined ? (
        <h2 style={{ color: 'red' }}>Payment Declined</h2>
      ) : isSuccess ? (
        <h2 style={{ color: 'green' }}>Payment Verified Successfully!</h2>
      ) : (
        <h2 style={{ color: 'red' }}>Security Alert: Hash Mismatch!</h2>
      )}

      <p>{message}</p>

      <h3>Posted Fields</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Param</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {postedFields.map(([k, v]) => (
            <tr key={k}>
              <td>{k}</td>
              <td>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  // 1) Must be a POST
  if (req.method !== 'POST') {
    return {
      props: {
        isSuccess: false,
        isDeclined: false,
        message: 'No POST data received. Possibly a direct GET.',
        postedFields: [],
      },
    };
  }

  // 2) Read raw body
  const rawBody = await new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });

  // DEBUG: Show raw body
  console.log('[NestPay Debug] [RESPONSE] rawBody =>', rawBody);

  // 3) Parse POST data
  const postData = {};
  rawBody.split('&').forEach((pair) => {
    const [k, v] = pair.split('=');
    postData[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });

  // DEBUG: Show the entire postData
  console.log('[NestPay Debug] [RESPONSE] postData =>', postData);

  const postedFields = Object.entries(postData);

  // 4) Check ProcReturnCode
  const procReturnCode = postData['ProcReturnCode'] || '';
  const errMsg = postData['ErrMsg'] || '';

  console.log('[NestPay Debug] [RESPONSE] ProcReturnCode:', procReturnCode);
  console.log('[NestPay Debug] [RESPONSE] ErrMsg:', errMsg);

  // If not "00", then it's declined or error
  if (procReturnCode !== '00') {
    return {
      props: {
        isSuccess: false,
        isDeclined: true,
        message: `Transaction Declined. Code: ${procReturnCode}, ErrMsg: ${errMsg}`,
        postedFields,
      },
    };
  }

  // 5) If success => check hash
  const storeKey = 'SKEY4550'; // same as in [bookingRef].js
  const localHash = generateNestPayHashV3(postData, storeKey);
  // The bank might return "HASH" or "hash"
  const bankHash = postData['hash'] || postData['HASH'] || '';

  // Compare
  if (localHash === bankHash) {
    // Payment verified
    return {
      props: {
        isSuccess: true,
        isDeclined: false,
        message: 'Hash is successful. Payment verified.',
        postedFields,
      },
    };
  } else {
    // Mismatch => potential tampering
    return {
      props: {
        isSuccess: false,
        isDeclined: false,
        message: 'Security Alert: The digital signature is not valid.',
        postedFields,
      },
    };
  }
}
