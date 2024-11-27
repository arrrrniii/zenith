// graphql/bookings.js
import { gql } from '@apollo/client';

// Fragments
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

// Mutation to create a booking
export const CREATE_BOOKING = gql`
  mutation CreateBooking($booking: bookings_insert_input!) {
    insert_bookings_one(object: $booking) {
      ...BookingFields
    }
  }
  ${BOOKING_FIELDS}
`;

// Mutation to add booking add-ons
export const ADD_BOOKING_ADDONS = gql`
  mutation AddBookingAddons($objects: [booking_add_ons_insert_input!]!) {
    insert_booking_add_ons(objects: $objects) {
      returning {
        id
        booking_id
        add_on_id
        quantity
        price
        add_on {
          name
        }
      }
    }
  }
`;

// Query to get booking by reference
export const GET_BOOKING = gql`
  query GetBooking($reference: String!) {
    bookings(where: { booking_reference: { _eq: $reference } }) {
      ...BookingFields
      booking_add_ons {
        id
        add_on_id
        quantity
        price
        add_on {
          name
          description
        }
      }
    }
  }
  ${BOOKING_FIELDS}
`;