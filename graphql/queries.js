// graphql/queries.js
import { gql } from '@apollo/client';

// Base fragments (reusing from mutations)
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

// Query for featured tours with complete information
export const GET_FEATURED_TOURS = gql`
  query GetFeaturedTours(
    $limit: Int = 12,
    $offset: Int = 0,
    $where: tours_bool_exp = { status: { _eq: "active" } },
    $orderBy: [tours_order_by!] = [{ created_at: desc }]
  ) {
    tours(
      where: $where
      order_by: $orderBy
      limit: $limit
      offset: $offset
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
      tour_dates(where: { date: { _gte: "now()" } }, limit: 5) {
        ...DateFields
      }
      tour_dates_aggregate {
        aggregate {
          count
          min {
            date
          }
          max {
            date
          }
        }
      }
      tour_inclusions {
        ...InclusionFields
      }
    }
    tours_aggregate(where: $where) {
      aggregate {
        count
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

// Query for filtered tours
export const GET_FILTERED_TOURS = gql`
  query GetFilteredTours(
    $where: tours_bool_exp!,
    $limit: Int = 10,
    $offset: Int = 0,
    $orderBy: [tours_order_by!] = [{ created_at: desc }]
  ) {
    tours(
      where: $where
      order_by: $orderBy
      limit: $limit
      offset: $offset
    ) {
      ...TourFields
      tour_pricing {
        ...PricingFields
      }
      tour_dates_aggregate {
        aggregate {
          count
        }
      }
    }
    tours_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
  ${TOUR_FIELDS}
  ${PRICING_FIELDS}
`;

// Query for tour categories/types aggregation
export const GET_TOUR_CATEGORIES = gql`
  query GetTourCategories {
    tours_aggregate(
      where: { status: { _eq: "active" } }
      distinct_on: tour_type
    ) {
      nodes {
        tour_type
      }
    }
  }
`;

// Query for upcoming tours
export const GET_UPCOMING_TOURS = gql`
  query GetUpcomingTours(
    $limit: Int = 5,
    $dateFrom: timestamptz = "now()"
  ) {
    tours(
      where: {
        status: { _eq: "active" },
        tour_dates: { date: { _gte: $dateFrom } }
      }
      order_by: { tour_dates_aggregate: { min: { date: asc } } }
      limit: $limit
    ) {
      ...TourFields
      tour_pricing {
        ...PricingFields
      }
      tour_dates(
        where: { date: { _gte: $dateFrom } }
        order_by: { date: asc }
        limit: 1
      ) {
        ...DateFields
      }
    }
  }
  ${TOUR_FIELDS}
  ${PRICING_FIELDS}
  ${DATE_FIELDS}
`;

// Query for tour statistics
export const GET_TOUR_STATS = gql`
  query GetTourStats {
    active_tours: tours_aggregate(where: { status: { _eq: "active" } }) {
      aggregate {
        count
      }
    }
    upcoming_dates: tour_dates_aggregate(
      where: { 
        date: { _gte: "now()" },
        status: { _eq: "active" }
      }
    ) {
      aggregate {
        count
      }
    }
    tour_types: tours_aggregate(distinct_on: tour_type) {
      aggregate {
        count
      }
    }
  }
`;



export const GET_TOUR_BY_ID = gql`
  query GetTourById($id: uuid!) {
    tours_by_pk(id: $id) {
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
      
      tour_pricing {
        price_per_person
        max_capacity
        early_bird_discount_percentage
        group_discount_percentage
        payment_details
        refund_policy
        deposit_requirements
      }
      
      tour_accessibility_feature {
        wheelchair_accessible
        mobility_aid
        visual_aid
        hearing_aid
        service_animals
        minimum_age
        fitness_level
        notes
      }
      
      tour_activities {
        id
        title
        duration
        description
        location
        sequence_order
      }
      
      tour_dates(
        where: { date: { _gte: "now()" } }
        order_by: { date: asc }
        limit: 10
      ) {
        id
        date
        end_date
        start_time
        status
        available_spots
      }
      
      tour_inclusions {
        id
        type
        description
      }
    }
  }
`;

// Separate query for similar tours
export const GET_SIMILAR_TOURS = gql`
  query GetSimilarTours($tourType: String!, $currentTourId: uuid!) {
    tours(
      where: {
        tour_type: { _eq: $tourType },
        id: { _neq: $currentTourId },
        status: { _eq: "active" }
      }
      limit: 3
    ) {
      id
      title
      main_image_url
      tour_type
      duration
      duration_type
      tour_pricing {
        price_per_person
      }
      tour_dates_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;




export const GET_ATTRACTIONS = gql`
  query GetAttractions($limit: Int, $where: attractions_bool_exp) {
    attractions(
      limit: $limit,
      where: $where,
      order_by: { created_at: desc }
    ) {
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
      attraction_images {
        id
        image_url
        display_order
      }
      attraction_categories {
        category {
          id
          name
        }
      }
    }
  }
`;

export const GET_FEATURED_BLOGS = gql`
  query GetFeaturedBlogs($limit: Int, $where: blogs_bool_exp) {
    blogs(
      limit: $limit,
      where: $where,
      order_by: { published_at: desc }
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
      published_at
      created_at
    }
  }
`;