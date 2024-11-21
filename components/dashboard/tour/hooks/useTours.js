// hooks/useTours.js
import { useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TOURS, DELETE_TOUR, UPDATE_TOUR } from '../graphql/queries';
import { Toast } from '@/components/ui/toast';

export const useTours = (filters, page, pageSize) => {
  // Build GraphQL where clause based on filters
  const where = useMemo(() => {
    const conditions = {};
    
    if (filters.search) {
      conditions._or = [
        { title: { _ilike: `%${filters.search}%` } },
        { description: { _ilike: `%${filters.search}%` } }
      ];
    }
    
    if (filters.status) {
      conditions.status = { _eq: filters.status };
    }
    
    if (filters.type) {
      conditions.tour_type = { _eq: filters.type };
    }
    
    return conditions;
  }, [filters]);

  // Query tours with filters and pagination
  const { data, loading, error } = useQuery(GET_TOURS, {
    variables: {
      where,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order_by: [{ created_at: 'desc' }]
    },
    fetchPolicy: 'network-only' // Ensures fresh data on refetch
  });

  // Delete tour mutation
  const [deleteTourMutation, { loading: isDeleting }] = useMutation(DELETE_TOUR, {
    update(cache, { data: { delete_tours_by_pk } }) {
      // Update cache after deletion
      const existingTours = cache.readQuery({
        query: GET_TOURS,
        variables: {
          where,
          limit: pageSize,
          offset: (page - 1) * pageSize,
          order_by: [{ created_at: 'desc' }]
        }
      });

      if (existingTours) {
        cache.writeQuery({
          query: GET_TOURS,
          variables: {
            where,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order_by: [{ created_at: 'desc' }]
          },
          data: {
            tours: existingTours.tours.filter(
              tour => tour.id !== delete_tours_by_pk.id
            ),
            tours_aggregate: {
              aggregate: {
                count: existingTours.tours_aggregate.aggregate.count - 1
              }
            }
          }
        });
      }
    },
    onCompleted: () => {
      Toast({
        title: "Success",
        description: "Tour deleted successfully",
      });
    },
    onError: (error) => {
      Toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update tour mutation
  const [updateTourMutation, { loading: isUpdating }] = useMutation(UPDATE_TOUR, {
    onCompleted: () => {
      Toast({
        title: "Success",
        description: "Tour updated successfully",
      });
    },
    onError: (error) => {
      Toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleDelete = async (ids) => {
    try {
      await Promise.all(
        ids.map(id => 
          deleteTourMutation({ 
            variables: { id },
            optimisticResponse: {
              delete_tours_by_pk: { id, __typename: 'tours' }
            }
          })
        )
      );
      return true;
    } catch (error) {
      console.error('Error deleting tours:', error);
      return false;
    }
  };

  const handleUpdate = async (id, tourData) => {
    try {
      await updateTourMutation({
        variables: {
          id,
          object: tourData
        },
        optimisticResponse: {
          update_tours_by_pk: {
            ...tourData,
            id,
            __typename: 'tours'
          }
        }
      });
      return true;
    } catch (error) {
      console.error('Error updating tour:', error);
      return false;
    }
  };

  return {
    tours: data?.tours || [],
    totalCount: data?.tours_aggregate.aggregate.count || 0,
    loading,
    error,
    isDeleting,
    isUpdating,
    handleDelete,
    handleUpdate
  };
};