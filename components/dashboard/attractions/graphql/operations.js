import { gql } from '@apollo/client';

// Common fragments to reuse across queries
export const ATTRACTION_FIELDS = gql`
  fragment AttractionFields on attractions {
    id
    name
    description
    address
    directions
    hours
    website
    phone
    rating
    review_count
    monthly_visitors
    price_range
    status
    created_at
    updated_at
    attraction_categories {
      category {
        id
        name
      }
    }
    attraction_images {
      id
      image_url
      display_order
    }
  }
`;

// Queries
export const GET_ATTRACTIONS = gql`
  query GetAttractions(
    $where: attractions_bool_exp
    $limit: Int
    $offset: Int
    $order_by: [attractions_order_by!]
  ) {
    attractions(
      where: $where
      limit: $limit
      offset: $offset
      order_by: $order_by
    ) {
      ...AttractionFields
    }
    attractions_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
  ${ATTRACTION_FIELDS}
`;

export const GET_ATTRACTION = gql`
  query GetAttraction($id: Int!) {
    attractions_by_pk(id: $id) {
      ...AttractionFields
    }
  }
  ${ATTRACTION_FIELDS}
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(order_by: { name: asc }) {
      id
      name
    }
  }
`;

// Mutations
export const CREATE_ATTRACTION = gql`
  mutation CreateAttraction($object: attractions_insert_input!) {
    insert_attractions_one(object: $object) {
      ...AttractionFields
    }
  }
  ${ATTRACTION_FIELDS}
`;

export const UPDATE_ATTRACTION = gql`
  mutation UpdateAttraction(
    $id: Int!
    $changes: attractions_set_input!
  ) {
    update_attractions_by_pk(
      pk_columns: { id: $id }
      _set: $changes
    ) {
      ...AttractionFields
    }
  }
  ${ATTRACTION_FIELDS}
`;

export const DELETE_ATTRACTION = gql`
  mutation DeleteAttraction($id: Int!) {
    delete_attractions_by_pk(id: $id) {
      id
    }
  }
`;

export const ADD_ATTRACTION_IMAGES = gql`
  mutation AddAttractionImages($objects: [attraction_images_insert_input!]!) {
    insert_attraction_images(objects: $objects) {
      returning {
        id
        image_url
        display_order
        attraction_id
      }
    }
  }
`;

export const DELETE_ATTRACTION_IMAGE = gql`
  mutation DeleteAttractionImage($id: Int!) {
    delete_attraction_images_by_pk(id: $id) {
      id
    }
  }
`;

export const UPDATE_ATTRACTION_CATEGORIES = gql`
  mutation UpdateAttractionCategories(
    $attraction_id: Int!
    $categories: [attraction_categories_insert_input!]!
  ) {
    # First delete existing categories
    delete_attraction_categories(
      where: { attraction_id: { _eq: $attraction_id } }
    ) {
      affected_rows
    }
    # Then insert new categories
    insert_attraction_categories(objects: $categories) {
      returning {
        attraction_id
        category {
          id
          name
        }
      }
    }
  }
`;

// Search query with filtering
export const SEARCH_ATTRACTIONS = gql`
  query SearchAttractions(
    $search: String
    $category: String
    $status: attraction_status
    $limit: Int = 10
    $offset: Int = 0
  ) {
    attractions(
      where: {
        _and: [
          { name: { _ilike: $search } }
          { status: { _eq: $status } }
          {
            attraction_categories: {
              category: { name: { _eq: $category } }
            }
          }
        ]
      }
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
    ) {
      ...AttractionFields
    }
    attractions_aggregate(
      where: {
        _and: [
          { name: { _ilike: $search } }
          { status: { _eq: $status } }
          {
            attraction_categories: {
              category: { name: { _eq: $category } }
            }
          }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
  ${ATTRACTION_FIELDS}
`;