// components/dashboard/blog/graphql/BlogFragments.js
import { gql } from '@apollo/client';

export const BLOG_FIELDS = gql`
  fragment BlogDetails on blogs {
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
    category
    blog_content_blocks {
      id
      type
      content
      order_index
      parent_block_id
    }
  }
`;