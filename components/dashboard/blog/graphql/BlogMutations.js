

// components/dashboard/blog/graphql/BlogMutations.js
import { gql } from '@apollo/client';
import { BLOG_FIELDS } from './BlogFragments';

// Status enums for blogs
export const BlogStatusEnum = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export const BLOG_STATUS_ENUM = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

// Helper functions for blog status
export const isValidBlogStatus = (status) => {
  if (!status) return false;
  const upperStatus = status.toUpperCase();
  return Object.values(BlogStatusEnum).includes(upperStatus);
};

export const normalizeBlogStatus = (status) => {
  if (!status) return BlogStatusEnum.DRAFT;
  const upperStatus = status.toUpperCase();
  return isValidBlogStatus(upperStatus) 
    ? upperStatus 
    : BlogStatusEnum.DRAFT;
};

export const INSERT_BLOG = gql`
  mutation InsertBlog(
    $title: String!
    $titletag: String
    $slug: String!
    $description: String
    $keywords: String
    $thumbnail_url: String
    $category: String
    $status: blog_status_enum!
    $content_blocks: [blog_content_blocks_insert_input!]!
  ) {
    insert_blogs_one(
      object: {
        title: $title
        titletag: $titletag
        slug: $slug
        description: $description
        keywords: $keywords
        thumbnail_url: $thumbnail_url
        category: $category
        status: $status
        blog_content_blocks: {
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
      category
      status
      created_at
      updated_at
      ...BlogDetails
      blog_content_blocks {
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

export const UPDATE_BLOG = gql`
  mutation UpdateBlog(
    $id: uuid!
    $title: String!
    $titletag: String!
    $slug: String!
    $description: String
    $keywords: String
    $thumbnail_url: String
    $category: String
    $status: blog_status_enum!
    $content_blocks: [blog_content_blocks_insert_input!]!
  ) {
    update_blogs_by_pk(
      pk_columns: { id: $id }
      _set: {
        title: $title
        titletag: $titletag
        slug: $slug
        description: $description
        keywords: $keywords
        thumbnail_url: $thumbnail_url
        category: $category
        status: $status
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
      # Each object in content_blocks should include blog_id: $id
    ) {
      returning {
        id
        type
        content
        order_index
        parent_block_id
        blog_id
      }
    }
  }
  ${BLOG_FIELDS}
`;

export const GET_BLOG = gql`
  query GetBlog($id: uuid!) {
    blogs_by_pk(id: $id) {
      id
      title
      titletag
      slug
      description
      keywords
      thumbnail_url
      category
      status
      created_at
      updated_at
      ...BlogDetails
      blog_content_blocks {
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
  query GetBlogs {
    blogs(order_by: { created_at: desc }) {
      id
      title
      titletag
      slug
      description
      thumbnail_url
      category
      status
      created_at
      updated_at
      blog_content_blocks_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

export const DELETE_BLOG = gql`
  mutation DeleteBlog($id: uuid!) {
    delete_blogs_by_pk(id: $id) {
      id
    }
  }
`;

export const GET_BLOG_BY_SLUG = gql`
  query GetBlogBySlug($slug: String!) {
    blogs(where: { 
      slug: { _eq: $slug },
      status: { _eq: "PUBLISHED" }
    }, limit: 1) {
      id
      title
      titletag
      slug
      description
      keywords
      thumbnail_url
      category
      status
      created_at
      updated_at
      blog_content_blocks(order_by: { order_index: asc }) {
        id
        type
        content
        order_index
        parent_block_id
      }
    }
  }
`;