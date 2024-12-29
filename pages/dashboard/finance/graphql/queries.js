import { gql } from '@apollo/client';

// Example new query to fetch finance overview data
export const GET_FINANCE_OVERVIEW = gql`
  query GetFinanceOverview {
    financeOverview {
      totalRevenue
      monthlyGrowth
      pendingPayments
      averageBookingValue
      totalBookings
    }
    recentTransactions {
      id
      customerName
      amount
      date
      status
      tourName
      tourId
      tourDate
      bookingId
    }
    tours {
      id
      name
    }
    tourDates {
      id
      date
    }
  }
`;

// Example query for a specific tour's finance details
export const GET_TOUR_FINANCE = gql`
  query GetTourFinance($id: ID!) {
    tourFinance(id: $id) {
      id
      name
      totalRevenue
      monthlyGrowth
      averageBookingValue
      totalBookings
      upcomingBookings
      averageGroupSize
      popularTimes
      nextAvailableDate
    }
    tourTransactions(id: $id) {
      id 
      customerName
      email
      phone
      country
      amount
      bookingDate
      status
      tourDate
      bookingId
      participants
      paymentMethod
      timeSlot
      specialRequests
    }
  }
`;

// Example query for a single transaction details
export const GET_TRANSACTION_DETAILS = gql`
  query GetTransactionDetails($id: ID!) {
    transaction(id: $id) {
      id
      bookingId
      customerName
      email
      phone
      country
      amount
      bookingDate
      status
      tourDate
      participants
      paymentMethod
      timeSlot
      specialRequests
    }
  }
`;
