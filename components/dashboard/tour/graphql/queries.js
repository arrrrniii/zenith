// components/dashboard/tour/graphql/queries.js
import { gql } from '@apollo/client';

export const GET_TOUR = gql`
  query GetTour($id: uuid!) {
    tours_by_pk(id: $id) {
      id
      title
      description
      tour_type
      duration
      duration_type
      meeting_point
      status
      main_image_url
      video_url
      default_start_time
      tour_pricing {
        price_per_person
        max_capacity
        early_bird_discount_percentage
        group_discount_percentage
        payment_details
        refund_policy
        deposit_requirements
      }
      tour_accessibility_feature {
        wheelchair_accessible
        mobility_aid
        visual_aid
        hearing_aid
        service_animals
        minimum_age
        fitness_level
        notes
      }
      tour_galleries {
        image_url
        sequence_order
      }
      tour_dates {
        date
        end_date
        start_time
        status
      }
      tour_activities {
        title
        duration
        description
        location
      }
      tour_inclusions {
        type
        description
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
      id
      title
      description
      status
      created_at
      tour_type
      duration
      duration_type
      tour_pricing {
        price_per_person
      }
      # Include the aggregate field so we can display the count
      tour_dates_aggregate {
        aggregate {
          count
        }
      }
    }
    tours_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
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
    update_tours_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      title
      description
      status
      updated_at
    }
  }
`;




export const UPDATE_TOUR_STATUS = gql`
  mutation UpdateTourStatus($id: uuid!, $_set: tours_set_input!) {
    update_tours_by_pk(
      pk_columns: { id: $id },
      _set: $_set
    ) {
      id
      status
    }
  }
`;