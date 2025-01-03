// graphql/bookings.js
import { gql } from '@apollo/client';

// Base Booking Fields
export const BOOKING_FIELDS = gql`
  fragment BookingFields on bookings {
    id
    booking_reference
    tour_id
    customer_name
    customer_email
    customer_phone
    selected_date
    number_of_participants
    total_amount
    special_requirements
    booking_status
    payment_status
    created_at
    updated_at
    tour {
      id 
      title
      main_image_url
      tour_pricing {
        price_per_person
      }
    }
  }
`;

// Payment Fields
export const PAYMENT_FIELDS = gql`
  fragment PaymentFields on booking_payments {
    id
    booking_id
    amount
    payment_method
    transaction_id
    payment_status
    payment_date
    masked_card_number
    authorization_code
    card_issuer
    card_brand
    client_ip
    currency
    host_reference
    response_code
    response_message
    created_at
  }
`;

// Get Booking by Reference
export const GET_BOOKING = gql`
  query GetBooking($reference: String!) {
    bookings(where: { booking_reference: { _eq: $reference } }) {
      ...BookingFields
      booking_payments {
        ...PaymentFields
      }
    }
  }
  ${BOOKING_FIELDS}
  ${PAYMENT_FIELDS}
`;

// Create New Booking
export const CREATE_BOOKING = gql`
  mutation CreateBooking($booking: bookings_insert_input!) {
    insert_bookings_one(object: $booking) {
      ...BookingFields
    }
  }
  ${BOOKING_FIELDS}
`;

// Add Booking Add-ons
export const ADD_BOOKING_ADDONS = gql`
  mutation AddBookingAddons($objects: [booking_add_ons_insert_input!]!) {
    insert_booking_add_ons(objects: $objects) {
      returning {
        id
        booking_id
        add_on_id
        quantity
        price
      }
    }
  }
`;

// Get Booking Status with Payment Details
export const GET_BOOKING_STATUS = gql`
  query GetBookingStatus($reference: String!) {
    bookings(where: { booking_reference: { _eq: $reference } }) {
      ...BookingFields
      booking_payments(order_by: { created_at: desc }, limit: 1) {
        ...PaymentFields
      }
    }
  }
  ${BOOKING_FIELDS}
  ${PAYMENT_FIELDS}
`;

// Create Payment Record
export const CREATE_PAYMENT_RECORD = gql`
  mutation CreatePaymentRecord($payment: booking_payments_insert_input!) {
    insert_booking_payments_one(object: $payment) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FIELDS}
`;

// Update Booking Status
export const UPDATE_BOOKING_STATUS = gql`
  mutation UpdateBookingStatus(
    $booking_reference: String!,
    $payment_status: payment_status_enum!,
    $booking_status: booking_status_enum!
  ) {
    update_bookings(
      where: { booking_reference: { _eq: $booking_reference }},
      _set: {
        payment_status: $payment_status,
        booking_status: $booking_status,
        updated_at: "now()"
      }
    ) {
      returning {
        ...BookingFields
      }
    }
  }
  ${BOOKING_FIELDS}
`;

// Process Payment Webhook
export const PROCESS_PAYMENT_WEBHOOK = gql`
  mutation ProcessPaymentWebhook(
    $booking_reference: String!,
    $payment_data: booking_payments_insert_input!,
    $booking_status: booking_status_enum!,
    $payment_status: payment_status_enum!
  ) {
    # Create payment record
    insert_booking_payments_one(object: $payment_data) {
      ...PaymentFields
    }
    # Update booking status
    update_bookings(
      where: { booking_reference: { _eq: $booking_reference }},
      _set: {
        payment_status: $payment_status,
        booking_status: $booking_status,
        updated_at: "now()"
      }
    ) {
      returning {
        ...BookingFields
        booking_payments(order_by: { created_at: desc }, limit: 1) {
          ...PaymentFields
        }
      }
    }
  }
  ${BOOKING_FIELDS}
  ${PAYMENT_FIELDS}
`;