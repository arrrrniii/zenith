import { useMutation } from '@apollo/client';
import { CREATE_TOUR, UPDATE_TOUR } from '../graphql/mutations';

export const useTourMutations = () => {
  const [createTour, { loading: createLoading }] = useMutation(CREATE_TOUR);
  const [updateTour, { loading: updateLoading }] = useMutation(UPDATE_TOUR);

  const transformFormDataForApi = (formData) => {
    console.log('Input formData:', formData);
    
    const tourData = {
      title: formData.title,
      description: formData.description,
      tour_type: formData.tourType,
      duration: Number(formData.duration),
      duration_type: formData.durationType,
      meeting_point: formData.meetingPoint,
      difficulty_level: formData.difficultyLevel,
      status: formData.status,
      main_image_url: formData.mainImage,
      video_url: formData.videoUrl,
      default_start_time: formData.defaultStartTime,
      tour_pricings: {
        data: [{
          price_per_person: Number(formData.pricing.pricePerPerson),
          max_capacity: Number(formData.pricing.maxCapacity),
          early_bird_discount_percentage: Number(formData.pricing.earlyBirdDiscount) || null,
          group_discount_percentage: Number(formData.pricing.groupDiscount) || null,
          payment_details: formData.pricing.paymentDetails,
          refund_policy: formData.pricing.refundPolicy,
          deposit_requirements: formData.pricing.depositRequirements
        }]
      },
      tour_accessibility_features: {
        data: [{
          wheelchair_accessible: formData.accessibility.wheelchairAccessible,
          mobility_aid: formData.accessibility.mobilityAid,
          visual_aid: formData.accessibility.visualAid,
          hearing_aid: formData.accessibility.hearingAid,
          service_animals: formData.accessibility.serviceAnimals,
          minimum_age: formData.accessibility.minimumAge ? Number(formData.accessibility.minimumAge) : null,
          fitness_level: formData.accessibility.fitnessLevel,
          notes: formData.accessibility.notes
        }]
      },
      tour_activities: {
        data: formData.activities.map((activity, index) => ({
          title: activity.title,
          duration: Number(activity.duration),
          description: activity.description,
          location: activity.location,
          sequence_order: index + 1
        }))
      },
      tour_dates: {
        data: formData.tourDates.map(date => ({
          date: date.startDate,
          end_date: date.endDate,
          start_time: date.startTime,
          status: 'active',
          available_spots: Number(formData.pricing.maxCapacity)
        }))
      },
      tour_inclusions: {
        data: [
          ...formData.included.map(item => ({ type: 'included', description: item })),
          ...formData.notIncluded.map(item => ({ type: 'not_included', description: item })),
          ...formData.providedEquipment.map(item => ({ type: 'provided_equipment', description: item })),
          ...formData.requiredEquipment.map(item => ({ type: 'required_equipment', description: item }))
        ]
      }
    };

    console.log('Transformed data:', tourData);
    return tourData;
  };

  const handleCreateTour = async (formData) => {
    try {
      const transformedData = transformFormDataForApi(formData);
      console.log('Create mutation variables:', JSON.stringify(transformedData, null, 2));
      
      const { data } = await createTour({
        variables: { 
          objects: transformedData 
        }
      });
      
      console.log('Create tour response:', data);
      return { success: true, data: data.insert_tours };
    } catch (error) {
      console.error('Error creating tour:', error);
      console.error('GraphQL Errors:', error.graphQLErrors);
      return { success: false, error };
    }
  };

  const handleUpdateTour = async (id, formData) => {
    try {
      const transformedData = transformFormDataForApi(formData);
      console.log('Update variables:', { id, set: transformedData });
      
      const { data } = await updateTour({
        variables: { 
          id,
          _set: transformedData 
        }
      });
      
      console.log('Update response:', data);
      return { success: true, data: data.update_tours_by_pk };
    } catch (error) {
      console.error('Error updating tour:', error);
      console.error('GraphQL Errors:', error.graphQLErrors);
      return { success: false, error };
    }
  };

  return {
    handleCreateTour,
    handleUpdateTour,
    loading: createLoading || updateLoading
  };
};