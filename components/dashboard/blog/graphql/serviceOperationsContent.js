// components/admin/dashboard/graphql/serviceOperationsContent.js
import { gql } from '@apollo/client';

export const SERVICE_FIELDS = gql`
  fragment ServiceDetails on creativesphere_services {
    id
    title
    titletag
    slug
    description
    keywords
    status
    thumbnail_url
    created_at
    updated_at
    published_at
    business_goal
    service_content_blocks {
      id
      type
      content
      order_index
      parent_block_id
      service_id
    }
  }
`;

export const GET_SERVICES = gql`
  query GetServices(
    $limit: Int = 50,
    $where: creativesphere_services_bool_exp = {}
  ) {
    creativesphere_services(
      where: $where
      order_by: { created_at: desc }
      limit: $limit
    ) {
      ...ServiceDetails
    }
  }
  ${SERVICE_FIELDS}
`;

export const GET_SERVICE_DETAILS = gql`
  query GetServiceDetails($id: uuid!) {
    creativesphere_services_by_pk(id: $id) {
      ...ServiceDetails
    }
  }
  ${SERVICE_FIELDS}
`;

export const UPDATE_SERVICE_STATUS = gql`
  mutation UpdateServiceStatus(
    $id: uuid!,
    $status: service_status_enum!,
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
      ...ServiceDetails
    }
  }
  ${SERVICE_FIELDS}
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: uuid!) {
    delete_creativesphere_service_content_blocks(
      where: { service_id: { _eq: $id } }
    ) {
      affected_rows
    }
    delete_creativesphere_services_by_pk(id: $id) {
      id
      title
    }
  }
`;

export const UPDATE_SERVICE_CONTENT_BLOCKS = gql`
  mutation UpdateServiceContentBlocks(
    $serviceId: uuid!,
    $blocks: [creativesphere_service_content_blocks_insert_input!]!
  ) {
    delete_creativesphere_service_content_blocks(
      where: { service_id: { _eq: $serviceId } }
    ) {
      affected_rows
    }
    insert_creativesphere_service_content_blocks(
      objects: $blocks
    ) {
      returning {
        id
        block_type
        content
        order_index
        parent_block_id
        service_id
      }
    }
  }
`;