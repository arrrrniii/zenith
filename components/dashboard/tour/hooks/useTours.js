import { useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TOURS, DELETE_TOUR, UPDATE_TOUR_STATUS } from '../graphql/queries';
import { useToast } from "@/components/ui/use-toast";

export const useTours = (filters, page, pageSize) => {
  const { toast } = useToast();

  const where = useMemo(() => {
    const conditions = {};
    if (filters.search) {
      conditions._or = [
        { title: { _ilike: `%${filters.search}%` } },
        { description: { _ilike: `%${filters.search}%` } }
      ];
    }

    if (filters.status && filters.status !== 'all') {
      conditions.status = { _eq: filters.status };
    }

    if (filters.type && filters.type !== 'all') {
      conditions.tour_type = { _eq: filters.type };
    }

    return conditions;
  }, [filters]);

  const queryVariables = {
    where,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    order_by: [{ created_at: 'desc' }]
  };

  const { data, loading, error, refetch } = useQuery(GET_TOURS, {
    variables: queryVariables,
    fetchPolicy: 'cache-and-network'
  });

  const [updateTourStatus] = useMutation(UPDATE_TOUR_STATUS, {
    optimisticResponse: ({ id, _set }) => ({
      update_tours_by_pk: {
        __typename: 'tours',
        id: id,
        status: _set.status
      }
    }),
    update(cache, { data: { update_tours_by_pk } }) {
      const queryToUpdate = {
        query: GET_TOURS,
        variables: queryVariables
      };

      try {
        const existingData = cache.readQuery(queryToUpdate);
        if (!existingData) return;

        const updatedTours = existingData.tours.map(tour => 
          tour.id === update_tours_by_pk.id 
            ? { ...tour, status: update_tours_by_pk.status }
            : tour
        );

        cache.writeQuery({
          ...queryToUpdate,
          data: {
            ...existingData,
            tours: updatedTours
          }
        });
      } catch (error) {
        console.error('Error updating cache:', error);
      }
    },
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Tour status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const [deleteTourMutation, { loading: isDeleting }] = useMutation(DELETE_TOUR, {
    update(cache, { data: { delete_tours_by_pk } }) {
      try {
        const existingData = cache.readQuery({
          query: GET_TOURS,
          variables: queryVariables
        });

        if (!existingData) return;

        const updatedTours = existingData.tours.filter(
          tour => tour.id !== delete_tours_by_pk.id
        );

        const updatedCount = existingData.tours_aggregate.aggregate.count - 1;

        cache.writeQuery({
          query: GET_TOURS,
          variables: queryVariables,
          data: {
            tours: updatedTours,
            tours_aggregate: {
              __typename: 'tours_aggregate',
              aggregate: {
                __typename: 'tours_aggregate_fields',
                count: updatedCount
              }
            }
          }
        });

        cache.evict({ id: cache.identify({ __typename: 'tours', id: delete_tours_by_pk.id }) });
        cache.gc();

      } catch (error) {
        console.error('Error updating cache:', error);
      }
    },
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Tour deleted successfully",
      });

      const currentPageItemCount = data?.tours?.length || 0;
      if (currentPageItemCount === 1 && page > 1) {
        setPage(page - 1);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleDelete = async (ids) => {
    try {
      const results = await Promise.all(
        ids.map(id => 
          deleteTourMutation({ 
            variables: { id },
            optimisticResponse: {
              delete_tours_by_pk: { 
                id, 
                __typename: 'tours'
              }
            }
          })
        )
      );

      return results.every(result => result.data?.delete_tours_by_pk);
    } catch (error) {
      console.error('Error deleting tours:', error);
      return false;
    }
  };

  const handleStatusUpdate = async (tourId, newStatus) => {
    try {
      await updateTourStatus({
        variables: {
          id: tourId,
          _set: {
            status: newStatus
          }
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to update tour status:', error);
      return false;
    }
  };

  return {
    tours: data?.tours || [],
    totalCount: data?.tours_aggregate?.aggregate?.count || 0,
    loading,
    error,
    isDeleting,
    handleDelete,
    handleStatusUpdate,
    refetch
  };
};