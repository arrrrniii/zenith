// components/dashboard/tour/graphql/mutations.js
import { gql } from '@apollo/client';

export const CREATE_TOUR = gql`
  mutation CreateTour(
    $tour: tours_insert_input!,
    $tour_pricing: tour_pricing_insert_input!,
    $accessibility: tour_accessibility_features_insert_input!,
    $activities: [tour_activities_insert_input!]!,
    $dates: [tour_dates_insert_input!]!,
    $gallery: [tour_gallery_insert_input!]!,
    $inclusions: [tour_inclusions_insert_input!]!
  ) {
    # Insert new tour
    insert_tours_one(object: $tour) {
      id
      title
      created_at
      updated_at
    }

    # Insert pricing
    insert_tour_pricing_one(object: $tour_pricing) {
      id
      tour_id
    }

    # Insert accessibility features
    insert_tour_accessibility_features_one(object: $accessibility) {
      tour_id
    }

    # Insert activities
    insert_tour_activities(objects: $activities) {
      affected_rows
      returning {
        id
      }
    }

    # Insert tour dates
    insert_tour_dates(objects: $dates) {
      affected_rows
      returning {
        id
      }
    }

    # Insert gallery images
    insert_tour_gallery(objects: $gallery) {
      affected_rows
      returning {
        id
      }
    }

    # Insert inclusions
    insert_tour_inclusions(objects: $inclusions) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const UPDATE_TOUR = gql`
  mutation UpdateTour(
    $id: uuid!,
    $tour: tours_set_input!,
    $tour_pricing: tour_pricing_set_input!,
    $accessibility: tour_accessibility_features_set_input!,
    $activities: [tour_activities_insert_input!]!,
    $dates: [tour_dates_insert_input!]!,
    $gallery: [tour_gallery_insert_input!]!,
    $inclusions: [tour_inclusions_insert_input!]!
  ) {
    # Delete existing data
    delete_tour_activities(where: { tour_id: { _eq: $id } }) {
      affected_rows
    }
    delete_tour_dates(where: { tour_id: { _eq: $id } }) {
      affected_rows
    }
    delete_tour_inclusions(where: { tour_id: { _eq: $id } }) {
      affected_rows
    }
    delete_tour_gallery(where: { tour_id: { _eq: $id } }) {
      affected_rows
    }

    # Update the main tour record
    update_tours_by_pk(
      pk_columns: { id: $id },
      _set: $tour
    ) {
      id
      title
      updated_at
    }

    update_tour_pricing(
      where: { tour_id: { _eq: $id } },
      _set: $tour_pricing
    ) {
      affected_rows
    }

    update_tour_accessibility_features(
      where: { tour_id: { _eq: $id } },
      _set: $accessibility
    ) {
      affected_rows
    }

    insert_tour_activities(objects: $activities) {
      affected_rows
    }

    insert_tour_dates(objects: $dates) {
      affected_rows
    }

    insert_tour_gallery(objects: $gallery) {
      affected_rows
    }

    insert_tour_inclusions(objects: $inclusions) {
      affected_rows
    }
  }
`;