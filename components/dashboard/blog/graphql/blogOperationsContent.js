

// components/dashboard/blog/graphql/blogOperationsContent.js
import { gql } from '@apollo/client';
import { BLOG_FIELDS } from './BlogFragments';

export const INSERT_BLOG = gql`
  mutation InsertBlog(
    $title: String!,
    $titletag: String!,
    $slug: String!,
    $description: String,
    $keywords: String,
    $thumbnail_url: String,
    $status: blog_status_enum!,
    $blog_content_blocks: [blog_content_blocks_insert_input!]!
  ) {
    insert_blogs_one(
      object: {
        title: $title,
        titletag: $titletag,
        slug: $slug,
        description: $description,
        keywords: $keywords,
        thumbnail_url: $thumbnail_url,
        status: $status,
        blog_content_blocks: {
          data: $blog_content_blocks
        }
      }
    ) {
      ...BlogDetails
    }
  }
  ${BLOG_FIELDS}
`;

export const UPDATE_BLOG = gql`
  mutation UpdateBlog(
    $id: uuid!,
    $title: String!,
    $titletag: String!,
    $slug: String!,
    $description: String,
    $keywords: String,
    $thumbnail_url: String,
    $status: blog_status_enum!,
    $content_blocks: [blog_content_blocks_insert_input!]!
  ) {
    update_blogs_by_pk(
      pk_columns: { id: $id },
      _set: {
        title: $title,
        titletag: $titletag,
        slug: $slug,
        description: $description,
        keywords: $keywords,
        thumbnail_url: $thumbnail_url,
        status: $status,
        updated_at: "now()"
      }
    ) {
      ...BlogDetails
    }

    delete_blog_content_blocks(
      where: { blog_id: { _eq: $id } }
    ) {
      affected_rows
    }

    insert_blog_content_blocks(
      objects: $content_blocks
    ) {
      returning {
        id
        type
        content
        order_index
        parent_block_id
      }
    }
  }
  ${BLOG_FIELDS}
`;

export const GET_BLOGS = gql`
  query GetBlogs(
    $limit: Int = 50,
    $where: blogs_bool_exp = {}
  ) {
    blogs(
      where: $where
      order_by: { created_at: desc }
      limit: $limit
    ) {
      ...BlogDetails
    }
  }
  ${BLOG_FIELDS}
`;

export const GET_BLOG_DETAILS = gql`
  query GetBlogDetails($id: uuid!) {
    blogs_by_pk(id: $id) {
      ...BlogDetails
    }
  }
  ${BLOG_FIELDS}
`;

export const UPDATE_BLOG_STATUS = gql`
  mutation UpdateBlogStatus(
    $id: uuid!,
    $status: blog_status_enum!,
    $published_at: timestamptz
  ) {
    update_blogs_by_pk(
      pk_columns: { id: $id }
      _set: {
        status: $status,
        published_at: $published_at,
        updated_at: "now()"
      }
    ) {
      ...BlogDetails
    }
  }
  ${BLOG_FIELDS}
`;

export const DELETE_BLOG = gql`
  mutation DeleteBlog($id: uuid!) {
    delete_blog_content_blocks(
      where: { blog_id: { _eq: $id } }
    ) {
      affected_rows
    }
    delete_blogs_by_pk(id: $id) {
      id
      title
    }
  }
`;