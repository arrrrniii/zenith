import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ATTRACTIONS,
  GET_ATTRACTION,
  GET_CATEGORIES,
  CREATE_ATTRACTION,
  UPDATE_ATTRACTION,
  DELETE_ATTRACTION,
  ADD_ATTRACTION_IMAGES,
  DELETE_ATTRACTION_IMAGE,
  UPDATE_ATTRACTION_CATEGORIES,
  SEARCH_ATTRACTIONS
} from '../graphql/operations';

// Hook for fetching attractions with filters and pagination
export const useAttractions = (filters = {}, pagination = {}) => {
  const { search, category, status } = filters;
  const { limit = 10, offset = 0, orderBy = [{ created_at: 'desc' }] } = pagination;

  // Construct the where clause based on filters
  const where = {
    _and: [
      search ? { name: { _ilike: `%${search}%` } } : {},
      status ? { status: { _eq: status } } : {},
      category ? {
        attraction_categories: {
          category: {
            name: { _eq: category }
          }
        }
      } : {}
    ].filter(condition => Object.keys(condition).length > 0)
  };

  const { data, loading, error, refetch } = useQuery(GET_ATTRACTIONS, {
    variables: {
      where: where._and.length > 0 ? where : {},
      limit,
      offset,
      order_by: orderBy
    },
    fetchPolicy: 'cache-and-network'
  });

  return {
    attractions: data?.attractions || [],
    totalCount: data?.attractions_aggregate?.aggregate?.count || 0,
    loading,
    error,
    refetch
  };
};

// Hook for fetching a single attraction
export const useAttraction = (id) => {
  const { data, loading, error } = useQuery(GET_ATTRACTION, {
    variables: { id },
    skip: !id
  });

  return {
    attraction: data?.attractions_by_pk,
    loading,
    error
  };
};

// Hook for fetching categories
export const useCategories = () => {
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  return {
    categories: data?.categories || [],
    loading,
    error
  };
};

// Hook for creating a new attraction
export const useCreateAttraction = () => {
  const [createMutation, { loading }] = useMutation(CREATE_ATTRACTION);

  const createAttraction = async (attractionData) => {
    const { categories, images, ...attractionDetails } = attractionData;

    try {
      // Create the attraction first
      const { data } = await createMutation({
        variables: {
          object: {
            ...attractionDetails,
            attraction_categories: {
              data: categories.map(categoryId => ({
                category_id: categoryId
              }))
            },
            attraction_images: images?.length ? {
              data: images.map((url, index) => ({
                image_url: url,
                display_order: index
              }))
            } : undefined
          }
        }
      });

      return data.insert_attractions_one;
    } catch (error) {
      console.error('Error creating attraction:', error);
      throw error;
    }
  };

  return {
    createAttraction,
    loading
  };
};

// Hook for updating an attraction
export const useUpdateAttraction = () => {
  const [updateMutation, { loading: updateLoading }] = useMutation(UPDATE_ATTRACTION);
  const [updateCategoriesMutation, { loading: categoriesLoading }] = useMutation(UPDATE_ATTRACTION_CATEGORIES);
  const [addImagesMutation, { loading: imagesLoading }] = useMutation(ADD_ATTRACTION_IMAGES);

  const updateAttraction = async (id, attractionData) => {
    const { categories, images, ...changes } = attractionData;

    try {
      // Update basic attraction details
      const { data } = await updateMutation({
        variables: { id, changes }
      });

      // Update categories if provided
      if (categories) {
        await updateCategoriesMutation({
          variables: {
            attraction_id: id,
            categories: categories.map(categoryId => ({
              attraction_id: id,
              category_id: categoryId
            }))
          }
        });
      }

      // Add new images if provided
      if (images?.length) {
        await addImagesMutation({
          variables: {
            objects: images.map((url, index) => ({
              attraction_id: id,
              image_url: url,
              display_order: index
            }))
          }
        });
      }

      return data.update_attractions_by_pk;
    } catch (error) {
      console.error('Error updating attraction:', error);
      throw error;
    }
  };

  return {
    updateAttraction,
    loading: updateLoading || categoriesLoading || imagesLoading
  };
};

// Hook for deleting an attraction
export const useDeleteAttraction = () => {
  const [deleteMutation, { loading }] = useMutation(DELETE_ATTRACTION, {
    refetchQueries: [GET_ATTRACTIONS]
  });

  const deleteAttraction = async (id) => {
    try {
      const { data } = await deleteMutation({
        variables: { id }
      });
      return data.delete_attractions_by_pk;
    } catch (error) {
      console.error('Error deleting attraction:', error);
      throw error;
    }
  };

  return {
    deleteAttraction,
    loading
  };
};

// Hook for deleting an attraction image
export const useDeleteAttractionImage = () => {
  const [deleteMutation, { loading }] = useMutation(DELETE_ATTRACTION_IMAGE);

  const deleteImage = async (imageId) => {
    try {
      const { data } = await deleteMutation({
        variables: { id: imageId }
      });
      return data.delete_attraction_images_by_pk;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  return {
    deleteImage,
    loading
  };
};

// Hook for searching attractions
export const useSearchAttractions = () => {
  const [searchParams, setSearchParams] = useState({
    search: '',
    category: '',
    status: '',
    limit: 10,
    offset: 0
  });

  const { data, loading, error, refetch } = useQuery(SEARCH_ATTRACTIONS, {
    variables: {
      search: searchParams.search ? `%${searchParams.search}%` : null,
      category: searchParams.category || null,
      status: searchParams.status || null,
      limit: searchParams.limit,
      offset: searchParams.offset
    },
    fetchPolicy: 'cache-and-network'
  });

  return {
    attractions: data?.attractions || [],
    totalCount: data?.attractions_aggregate?.aggregate?.count || 0,
    loading,
    error,
    searchParams,
    setSearchParams,
    refetch
  };
};