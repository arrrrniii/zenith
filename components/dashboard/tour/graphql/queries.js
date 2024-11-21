// graphql/queries.js
import { gql } from '@apollo/client';

export const TOUR_FRAGMENT = gql`
  fragment TourFields on tours {
    id
    title
    description
    tour_type
    duration
    duration_type
    status
    created_at
    updated_at
    tour_pricing {
      price_per_person
      max_capacity
    }
    tour_dates_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const GET_TOURS = gql`
  query GetTours(
    $where: tours_bool_exp
    $limit: Int
    $offset: Int
    $order_by: [tours_order_by!]
  ) {
    tours(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $order_by
    ) {
      ...TourFields
    }
    tours_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
  ${TOUR_FRAGMENT}
`;

export const DELETE_TOUR = gql`
  mutation DeleteTour($id: uuid!) {
    delete_tours_by_pk(id: $id) {
      id
    }
  }
`;

export const UPDATE_TOUR = gql`
  mutation UpdateTour($id: uuid!, $object: tours_set_input!) {
    update_tours_by_pk(
      pk_columns: { id: $id }
      _set: $object
    ) {
      ...TourFields
    }
  }
  ${TOUR_FRAGMENT}
`;