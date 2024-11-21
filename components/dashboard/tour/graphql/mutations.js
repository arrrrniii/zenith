//components/dashboard/tour/graphql/mutations.js
import { gql } from '@apollo/client';

// Base fragment for tour fields
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
    created_at
    updated_at
  }
`;

// Separate fragments for relationships
const PRICING_FIELDS = gql`
  fragment PricingFields on tour_pricing {
    id
    price_per_person
    max_capacity
    early_bird_discount_percentage
    group_discount_percentage
    payment_details
    refund_policy
    deposit_requirements
  }
`;

const ACCESSIBILITY_FIELDS = gql`
  fragment AccessibilityFields on tour_accessibility_feature {
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
`;

const ACTIVITY_FIELDS = gql`
  fragment ActivityFields on tour_activities {
    id
    title
    duration
    description
    location
    sequence_order
  }
`;

const DATE_FIELDS = gql`
  fragment DateFields on tour_dates {
    id
    date
    end_date
    start_time
    status
    available_spots
  }
`;

const INCLUSION_FIELDS = gql`
  fragment InclusionFields on tour_inclusions {
    id
    type
    description
  }
`;

// Create mutation
export const CREATE_TOUR = gql`
  mutation CreateTour($object: tours_insert_input!) {
    insert_tours_one(
      object: $object
    ) {
      ...TourFields
      tour_pricing {
        ...PricingFields
      }
      tour_accessibility_feature {
        ...AccessibilityFields
      }
      tour_activities {
        ...ActivityFields
      }
      tour_dates {
        ...DateFields
      }
      tour_inclusions {
        ...InclusionFields
      }
    }
  }
  ${TOUR_FIELDS}
  ${PRICING_FIELDS}
  ${ACCESSIBILITY_FIELDS}
  ${ACTIVITY_FIELDS}
  ${DATE_FIELDS}
  ${INCLUSION_FIELDS}
`;

// Update mutation
export const UPDATE_TOUR = gql`
  mutation UpdateTour(
    $id: uuid!,
    $object: tours_set_input!,
    $pricing: tour_pricing_set_input!,
    $accessibility: tour_accessibility_feature_set_input!,
    $activities: [tour_activities_insert_input!]!,
    $dates: [tour_dates_insert_input!]!,
    $inclusions: [tour_inclusions_insert_input!]!
  ) {
    # Update main tour
    update_tours_by_pk(
      pk_columns: { id: $id },
      _set: $object
    ) {
      id
    }

    # Update pricing (one-to-one)
    update_tour_pricing(
      where: { tour_id: { _eq: $id } },
      _set: $pricing
    ) {
      returning {
        ...PricingFields
      }
    }

    # Update accessibility (one-to-one)
    update_tour_accessibility_feature(
      where: { tour_id: { _eq: $id } },
      _set: $accessibility
    ) {
      returning {
        ...AccessibilityFields
      }
    }

    # Update activities (one-to-many)
    delete_tour_activities(where: { tour_id: { _eq: $id } }) {
      affected_rows
    }
    insert_tour_activities(objects: $activities) {
      returning {
        ...ActivityFields
      }
    }

    # Update dates (one-to-many)
    delete_tour_dates(where: { tour_id: { _eq: $id } }) {
      affected_rows
    }
    insert_tour_dates(objects: $dates) {
      returning {
        ...DateFields
      }
    }

    # Update inclusions (one-to-many)
    delete_tour_inclusions(where: { tour_id: { _eq: $id } }) {
      affected_rows
    }
    insert_tour_inclusions(objects: $inclusions) {
      returning {
        ...InclusionFields
      }
    }

    # Return updated tour
    tour: tours_by_pk(id: $id) {
      ...TourFields
      tour_pricing {
        ...PricingFields
      }
      tour_accessibility_feature {
        ...AccessibilityFields
      }
      tour_activities {
        ...ActivityFields
      }
      tour_dates {
        ...DateFields
      }
      tour_inclusions {
        ...InclusionFields
      }
    }
  }
  ${TOUR_FIELDS}
  ${PRICING_FIELDS}
  ${ACCESSIBILITY_FIELDS}
  ${ACTIVITY_FIELDS}
  ${DATE_FIELDS}
  ${INCLUSION_FIELDS}
`;

// Delete mutation
export const DELETE_TOUR = gql`
  mutation DeleteTour($id: uuid!) {
    delete_tours_by_pk(id: $id) {
      id
    }
  }
`;

// Query for fetching a single tour
export const GET_TOUR = gql`
  query GetTour($id: uuid!) {
    tours_by_pk(id: $id) {
      ...TourFields
      tour_pricing {
        ...PricingFields
      }
      tour_accessibility_feature {
        ...AccessibilityFields
      }
      tour_activities {
        ...ActivityFields
      }
      tour_dates {
        ...DateFields
      }
      tour_inclusions {
        ...InclusionFields
      }
    }
  }
  ${TOUR_FIELDS}
  ${PRICING_FIELDS}
  ${ACCESSIBILITY_FIELDS}
  ${ACTIVITY_FIELDS}
  ${DATE_FIELDS}
  ${INCLUSION_FIELDS}
`;