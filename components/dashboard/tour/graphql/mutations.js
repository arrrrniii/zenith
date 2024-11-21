import { gql } from '@apollo/client';

// Fragment remains the same
const TOUR_FIELDS = gql`
  fragment TourFields on tours {
    id
    title
    description
    tour_type
    duration
    duration_type
    meeting_point
    difficulty_level
    status
    main_image_url
    video_url
    default_start_time
    tour_pricing {
      id
      price_per_person
      max_capacity
      early_bird_discount_percentage
      group_discount_percentage
      payment_details
      refund_policy
      deposit_requirements
    }
    tour_accessibility_features {
      id
      wheelchair_accessible
      mobility_aid
      visual_aid
      hearing_aid
      service_animals
      minimum_age
      fitness_level
      notes
    }
    tour_activities {
      id
      title
      duration
      description
      location
      sequence_order
    }
    tour_dates {
      id
      date
      end_date
      start_time
      status
      available_spots
    }
    tour_inclusions {
      id
      type
      description
    }
  }
`;

// Updated mutation to match GraphiQL schema
export const CREATE_TOUR = gql`
  mutation CreateTour($objects: [tours_insert_input!]!) {
    insert_tours(objects: $objects) {
      returning {
        ...TourFields
      }
    }
  }
  ${TOUR_FIELDS}
`;

export const UPDATE_TOUR = gql`
  mutation UpdateTour($id: uuid!, $_set: tours_set_input!) {
    update_tours_by_pk(pk_columns: { id: $id }, _set: $_set) {
      ...TourFields
    }
  }
  ${TOUR_FIELDS}
`;

export const GET_TOUR = gql`
  query GetTour($id: uuid!) {
    tours_by_pk(id: $id) {
      ...TourFields
    }
  }
  ${TOUR_FIELDS}
`;