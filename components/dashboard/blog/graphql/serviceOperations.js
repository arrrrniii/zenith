import { gql } from '@apollo/client';

// Optimized fields fragment for service listing
export const SERVICE_FIELDS = gql`
  fragment ServiceFields on creativesphere_services {
    id
    title
    titletag
    description
    keywords
    status
    thumbnail_url
    business_goal
    created_at
    updated_at
  }
`;

// Updated Insert Service mutation with correct enum type
export const INSERT_SERVICE = gql`
  mutation InsertService(
    $title: String!
    $slug: String!
    $description: String
    $keywords: String
    $thumbnail_url: String
    $status: service_status!
    $service_features: [creativesphere_service_features_insert_input!]!
    $content_blocks: [creativesphere_service_content_blocks_insert_input!]!
  ) {
    insert_creativesphere_services_one(
      object: {
        title: $title
        slug: $slug
        description: $description
        keywords: $keywords
        thumbnail_url: $thumbnail_url
        status: $status
        service_features: {
          data: $service_features
        }
        service_content_blocks: {
          data: $content_blocks
        }
      }
    ) {
      ...ServiceFields
    }
  }
  ${SERVICE_FIELDS}
`;

// Updated Update Service mutation with correct enum type
export const UPDATE_SERVICE = gql`
  mutation UpdateService(
    $id: uuid!
    $title: String!
    $slug: String!
    $description: String
    $keywords: String
    $thumbnail_url: String
    $status: service_status!
    $features: [creativesphere_service_features_insert_input!]!
    $content_blocks: [creativesphere_service_content_blocks_insert_input!]!
  ) {
    update_creativesphere_services_by_pk(
      pk_columns: { id: $id }
      _set: {
        title: $title
        slug: $slug
        description: $description
        keywords: $keywords
        thumbnail_url: $thumbnail_url
        status: $status
        updated_at: "now()"
      }
    ) {
      ...ServiceFields
    }
    delete_creativesphere_service_features(where: { service_id: { _eq: $id } }) {
      affected_rows
    }
    insert_creativesphere_service_features(objects: $features) {
      affected_rows
    }
    delete_creativesphere_service_content_blocks(where: { service_id: { _eq: $id } }) {
      affected_rows
    }
    insert_creativesphere_service_content_blocks(objects: $content_blocks) {
      affected_rows
    }
  }
  ${SERVICE_FIELDS}
`;

// Updated Status update mutation with fully qualified enum type
export const UPDATE_SERVICE_STATUS = gql`
  mutation UpdateServiceStatus(
    $id: uuid!, 
    $status: creativesphere_service_status_enum!, 
    $published_at: timestamptz
  ) {
    update_creativesphere_services_by_pk(
      pk_columns: { id: $id }
      _set: {
        status: $status,
        published_at: $published_at,
        updated_at: "now()"
      }
    ) {
      ...ServiceFields
    }
  }
  ${SERVICE_FIELDS}
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: uuid!) {
    delete_creativesphere_services_by_pk(id: $id) {
      id
    }
  }
`;