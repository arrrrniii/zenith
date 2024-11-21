// components/admin/dashboard/graphql/fragments.js
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
    business_goal
    service_content_blocks {
      id
      type
      content
      order_index
      parent_block_id
    }
  }
`;