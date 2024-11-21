import { useMutation } from '@apollo/client';
import { CREATE_TOUR, UPDATE_TOUR } from '../graphql/mutations';

export const useTourMutations = () => {
  const [createTour, { loading: createLoading }] = useMutation(CREATE_TOUR);
  const [updateTour, { loading: updateLoading }] = useMutation(UPDATE_TOUR);

  // Convert duration in minutes to display format HH:mm for UI if needed
  const formatDurationForDisplay = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const transformFormDataForApi = (formData) => {
    try {
      const tourData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tour_type: formData.tourType,
        duration: Number(formData.duration),
        duration_type: formData.durationType,
        meeting_point: formData.meetingPoint.trim(),
        difficulty_level: formData.difficultyLevel,
        status: formData.status,
        main_image_url: formData.mainImage?.trim() || null,
        video_url: formData.videoUrl?.trim() || null,
        default_start_time: formData.defaultStartTime,

        tour_pricing: {
          data: {
            price_per_person: Number(formData.pricing.pricePerPerson),
            max_capacity: Number(formData.pricing.maxCapacity),
            early_bird_discount_percentage: formData.pricing.earlyBirdDiscount 
              ? Number(formData.pricing.earlyBirdDiscount) 
              : null,
            group_discount_percentage: formData.pricing.groupDiscount 
              ? Number(formData.pricing.groupDiscount) 
              : null,
            payment_details: formData.pricing.paymentDetails?.trim(),
            refund_policy: formData.pricing.refundPolicy?.trim(),
            deposit_requirements: formData.pricing.depositRequirements?.trim()
          }
        },

        tour_accessibility_feature: {
          data: {
            wheelchair_accessible: Boolean(formData.accessibility.wheelchairAccessible),
            mobility_aid: Boolean(formData.accessibility.mobilityAid),
            visual_aid: Boolean(formData.accessibility.visualAid),
            hearing_aid: Boolean(formData.accessibility.hearingAid),
            service_animals: Boolean(formData.accessibility.serviceAnimals),
            minimum_age: formData.accessibility.minimumAge 
              ? Number(formData.accessibility.minimumAge) 
              : null,
            fitness_level: formData.accessibility.fitnessLevel,
            notes: formData.accessibility.notes?.trim()
          }
        },

        tour_activities: {
          data: formData.activities.map((activity, index) => ({
            title: activity.title.trim(),
            duration: Number(activity.duration), // Keep as minutes (integer)
            description: activity.description.trim(),
            location: activity.location.trim(),
            sequence_order: index + 1
          }))
        },

        tour_dates: {
          data: formData.tourDates.map(date => ({
            date: date.startDate,
            end_date: date.endDate,
            start_time: date.startTime || formData.defaultStartTime,
            status: date.status || 'active',
            available_spots: Number(formData.pricing.maxCapacity)
          }))
        },

        tour_inclusions: {
          data: [
            ...(formData.included || []).map(item => ({
              type: 'included',
              description: item.trim()
            })),
            ...(formData.notIncluded || []).map(item => ({
              type: 'not_included',
              description: item.trim()
            })),
            ...(formData.providedEquipment || []).map(item => ({
              type: 'provided_equipment',
              description: item.trim()
            })),
            ...(formData.requiredEquipment || []).map(item => ({
              type: 'required_equipment',
              description: item.trim()
            }))
          ]
        }
      };

      return tourData;
    } catch (error) {
      console.error('Error transforming form data:', error);
      throw new Error(`Failed to transform form data: ${error.message}`);
    }
  };

  const handleCreateTour = async (formData) => {
    try {
      const transformedData = transformFormDataForApi(formData);
      console.log('Create tour variables:', JSON.stringify(transformedData, null, 2));

      const { data } = await createTour({
        variables: { object: transformedData }
      });

      return {
        success: true,
        data: data.insert_tours_one,
        error: null
      };
    } catch (error) {
      console.error('Error creating tour:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to create tour'
      };
    }
  };

  const handleUpdateTour = async (id, formData) => {
    try {
      if (!id) throw new Error('Tour ID is required for update');
      
      const transformedData = transformFormDataForApi(formData);
      
      const variables = {
        id,
        object: {
          title: transformedData.title,
          description: transformedData.description,
          tour_type: transformedData.tour_type,
          duration: transformedData.duration,
          duration_type: transformedData.duration_type,
          meeting_point: transformedData.meeting_point,
          difficulty_level: transformedData.difficulty_level,
          status: transformedData.status,
          main_image_url: transformedData.main_image_url,
          video_url: transformedData.video_url,
          default_start_time: transformedData.default_start_time
        },
        pricing: transformedData.tour_pricing.data,
        accessibility: transformedData.tour_accessibility_feature.data,
        activities: transformedData.tour_activities.data.map(activity => ({
          ...activity,
          tour_id: id
        })),
        dates: transformedData.tour_dates.data.map(date => ({
          ...date,
          tour_id: id
        })),
        inclusions: transformedData.tour_inclusions.data.map(inclusion => ({
          ...inclusion,
          tour_id: id
        }))
      };

      console.log('Update tour variables:', JSON.stringify(variables, null, 2));

      const { data } = await updateTour({ variables });

      return {
        success: true,
        data: data.tour,
        error: null
      };
    } catch (error) {
      console.error('Error updating tour:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update tour'
      };
    }
  };

  return {
    handleCreateTour,
    handleUpdateTour,
    loading: createLoading || updateLoading
  };
};