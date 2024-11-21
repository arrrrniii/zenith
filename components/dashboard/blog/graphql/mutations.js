//components/admin/dashboard/graphql/mutations.js
import { gql } from '@apollo/client';
import { SERVICE_FIELDS } from './fragments';

// Status enums remain the same
export const ServiceStatusEnum = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export const SERVICE_STATUS_ENUM = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

// Helper functions remain the same
export const isValidServiceStatus = (status) => {
  if (!status) return false;
  const upperStatus = status.toUpperCase();
  return Object.values(ServiceStatusEnum).includes(upperStatus);
};

export const normalizeServiceStatus = (status) => {
  if (!status) return ServiceStatusEnum.DRAFT;
  const upperStatus = status.toUpperCase();
  return isValidServiceStatus(upperStatus) 
    ? upperStatus 
    : ServiceStatusEnum.DRAFT;
};

export const INSERT_SERVICE = gql`
  mutation InsertService(
    $title: String!
    $titletag:String
    $slug: String!
    $description: String
    $keywords: String
    $thumbnail_url: String
    $business_goal: String
    $status: service_status_enum!
    $content_blocks: [creativesphere_service_content_blocks_insert_input!]!
  ) {
    insert_creativesphere_services_one(
      object: {
        title: $title
        titletag: $titletag
        slug: $slug
        description: $description
        keywords: $keywords
        thumbnail_url: $thumbnail_url
        business_goal: $business_goal
        status: $status
        service_content_blocks: {
          data: $content_blocks
        }
      }
    ) {
      id
      title
      titletag
      slug
      description
      keywords
      thumbnail_url
      business_goal
      status
      created_at
      updated_at
      ...ServiceDetails
      service_content_blocks {
        id
        type
        content
        order_index
        parent_block_id
      }
    }
  }
  ${SERVICE_FIELDS}
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService(
    $id: uuid!
    $title: String!
    $titletag:String!
    $slug: String!
    $description: String
    $keywords: String
    $thumbnail_url: String
    $business_goal: String
    $status: service_status_enum!
    $content_blocks: [creativesphere_service_content_blocks_insert_input!]!
  ) {
    # Update the service details
    update_creativesphere_services_by_pk(
      pk_columns: { id: $id }
      _set: {
        title: $title
        titletag: $titletag
        slug: $slug
        description: $description
        keywords: $keywords
        thumbnail_url: $thumbnail_url
        business_goal: $business_goal
        status: $status
        updated_at: "now()"
      }
    ) {
      id
      title
      titletag
      slug
      description
      keywords
      thumbnail_url
      business_goal
      status
      created_at
      updated_at
      ...ServiceDetails
    }

    # Delete existing content blocks
    delete_creativesphere_service_content_blocks(
      where: { service_id: { _eq: $id } }
    ) {
      affected_rows
    }

    # Insert new content blocks
    insert_creativesphere_service_content_blocks(
      objects: $content_blocks
    ) {
      returning {
        id
        type
        content
        order_index
        parent_block_id
        service_id
      }
    }
  }
  ${SERVICE_FIELDS}
`;

// Query to fetch service details
export const GET_SERVICE = gql`
  query GetService($id: uuid!) {
    creativesphere_services_by_pk(id: $id) {
      id
      title
      titletag
      slug
      description
      keywords
      thumbnail_url
      business_goal
      status
      created_at
      updated_at
      ...ServiceDetails
      service_content_blocks {
        id
        type
        content
        order_index
        parent_block_id
      }
    }
  }
  ${SERVICE_FIELDS}
`;

// Query to fetch all services
export const GET_SERVICES = gql`
  query GetServices {
    creativesphere_services(order_by: { created_at: desc }) {
      id
      title
      titletag
      slug
      description
      thumbnail_url
      business_goal
      status
      created_at
      updated_at
      service_content_blocks_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

// Delete service mutation remains the same
export const DELETE_SERVICE = gql`
  mutation DeleteService($id: uuid!) {
    delete_creativesphere_services_by_pk(id: $id) {
      id
    }
  }
`;

export default {
  INSERT_SERVICE,
  UPDATE_SERVICE,
  GET_SERVICE,
  GET_SERVICES,
  DELETE_SERVICE,
  ServiceStatusEnum,
  isValidServiceStatus,
  normalizeServiceStatus
};