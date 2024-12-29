// components/dashboard/tour/hooks/useTourMutations.js
import { useMutation } from '@apollo/client';
import { CREATE_TOUR, UPDATE_TOUR } from '../graphql/mutations';

export const useTourMutations = () => {
  const [createTourMutation, { loading: createLoading }] = useMutation(CREATE_TOUR);
  const [updateTourMutation, { loading: updateLoading }] = useMutation(UPDATE_TOUR);

  const transformFormDataForCreate = (formData) => {
    const newTourId = crypto.randomUUID();

    const {
      title,
      description,
      tour_type,
      duration,
      duration_type,
      meetingPoint,
      status,
      mainImage,
      videoUrl,
      defaultStartTime,
      pricing,
      accessibility,
      activities,
      tourDates,
      gallery,
      included,
      notIncluded,
      providedEquipment,
      requiredEquipment
    } = formData;

    const data = {
      tour: {
        id: newTourId,
        title,
        description,
        tour_type,
        duration: parseInt(duration),
        duration_type,
        meeting_point: meetingPoint,
        status: status || 'draft',
        main_image_url: mainImage,
        video_url: videoUrl,
        default_start_time: defaultStartTime
      },
      tour_pricing: {
        tour_id: newTourId,
        price_per_person: parseFloat(pricing.pricePerPerson),
        max_capacity: parseInt(pricing.maxCapacity),
        payment_details: pricing.paymentDetails,
        refund_policy: pricing.refundPolicy,
        early_bird_discount_percentage: parseFloat(pricing.earlyBirdDiscount),
        group_discount_percentage: parseFloat(pricing.groupDiscount),
        deposit_requirements: pricing.depositRequirements
      },
      accessibility: {
        tour_id: newTourId,
        wheelchair_accessible: !!accessibility?.wheelchairAccessible,
        mobility_aid: !!accessibility?.mobilityAid,
        visual_aid: !!accessibility?.visualAid,
        hearing_aid: !!accessibility?.hearingAid,
        service_animals: !!accessibility?.serviceAnimals,
        minimum_age: accessibility?.minimumAge ? parseInt(accessibility.minimumAge) : null,
        fitness_level: accessibility?.fitnessLevel || 'moderate',
        notes: accessibility?.notes
      },
      activities: activities.map((activity, index) => ({
        tour_id: newTourId,
        title: activity.title,
        duration: parseInt(activity.duration),
        description: activity.description,
        location: activity.location,
        sequence_order: index
      })),
      dates: tourDates.map(date => ({
        tour_id: newTourId,
        date: date.startDate,
        end_date: date.endDate,
        start_time: date.startTime,
        status: date.status || 'active',
        available_spots: parseInt(date.availableSpots) || 0
      })),
      gallery: (gallery || [])
        .filter(item => item && (typeof item === 'string' || item.image_url))
        .map((item, index) => ({
          tour_id: newTourId,
          image_url: typeof item === 'string' ? item : item.image_url,
          sequence_order: index
        })),
      inclusions: [
        ...((included || []).map(desc => ({
          tour_id: newTourId,
          type: 'included',
          description: desc
        }))),
        ...((notIncluded || []).map(desc => ({
          tour_id: newTourId,
          type: 'not_included',
          description: desc
        }))),
        ...((providedEquipment || []).map(desc => ({
          tour_id: newTourId,
          type: 'provided_equipment',
          description: desc
        }))),
        ...((requiredEquipment || []).map(desc => ({
          tour_id: newTourId,
          type: 'required_equipment',
          description: desc
        })))
      ]
    };

    return data;
  };

  const transformFormDataForUpdate = (formData, removedGalleryIds = []) => {
    const {
      id,
      title,
      description,
      tour_type,
      duration,
      duration_type,
      meetingPoint,
      status,
      mainImage,
      videoUrl,
      defaultStartTime,
      pricing,
      accessibility,
      activities,
      tourDates,
      gallery,
      included,
      notIncluded,
      providedEquipment,
      requiredEquipment
    } = formData;

    const updatedData = {
      id,
      tour: {
        title,
        description,
        tour_type,
        duration: parseInt(duration),
        duration_type,
        meeting_point: meetingPoint,
        status,
        main_image_url: mainImage,
        video_url: videoUrl,
        default_start_time: defaultStartTime,
        updated_at: new Date().toISOString()
      },
      tour_pricing: {
        price_per_person: parseFloat(pricing.pricePerPerson),
        max_capacity: parseInt(pricing.maxCapacity),
        payment_details: pricing.paymentDetails,
        refund_policy: pricing.refundPolicy,
        early_bird_discount_percentage: parseFloat(pricing.earlyBirdDiscount),
        group_discount_percentage: parseFloat(pricing.groupDiscount),
        deposit_requirements: pricing.depositRequirements
      },
      accessibility: {
        wheelchair_accessible: !!accessibility?.wheelchairAccessible,
        mobility_aid: !!accessibility?.mobilityAid,
        visual_aid: !!accessibility?.visualAid,
        hearing_aid: !!accessibility?.hearingAid,
        service_animals: !!accessibility?.serviceAnimals,
        minimum_age: accessibility?.minimumAge ? parseInt(accessibility.minimumAge) : null,
        fitness_level: accessibility?.fitnessLevel || 'moderate',
        notes: accessibility?.notes
      },
      activities: (activities || []).map((activity, index) => ({
        tour_id: id,
        title: activity.title,
        duration: parseInt(activity.duration),
        description: activity.description,
        location: activity.location,
        sequence_order: index
      })),
      dates: (tourDates || []).map(date => ({
        tour_id: id,
        date: date.startDate,
        end_date: date.endDate,
        start_time: date.startTime,
        status: date.status || 'active',
        available_spots: parseInt(date.availableSpots) || 0
      })),
      gallery: (gallery || [])
        .filter(item => item && (typeof item === 'string' || item.image_url))
        .map((item, index) => ({
          tour_id: id,
          image_url: typeof item === 'string' ? item : item.image_url,
          sequence_order: index
        })),
      inclusions: [
        ...((included || []).map(desc => ({
          tour_id: id,
          type: 'included',
          description: desc
        }))),
        ...((notIncluded || []).map(desc => ({
          tour_id: id,
          type: 'not_included',
          description: desc
        }))),
        ...((providedEquipment || []).map(desc => ({
          tour_id: id,
          type: 'provided_equipment',
          description: desc
        }))),
        ...((requiredEquipment || []).map(desc => ({
          tour_id: id,
          type: 'required_equipment',
          description: desc
        })))
      ],
      removedGalleryIds
    };

    console.log("Transformed Update Data:", JSON.stringify(updatedData, null, 2));
    return updatedData;
  };

  const handleSubmit = async (formData, removedGalleryIds = []) => {
    try {
      if (!formData.id) {
        // Create new tour
        const variables = transformFormDataForCreate(formData);
        console.log('Create variables:', JSON.stringify(variables, null, 2));
        const { data } = await createTourMutation({ variables });
        return {
          success: true,
          data: data.insert_tours_one
        };
      } else {
        // Update existing tour
        const variables = transformFormDataForUpdate(formData, removedGalleryIds);
        console.log('Update variables:', JSON.stringify(variables, null, 2));
        const { data } = await updateTourMutation({ variables });
        return {
          success: true,
          data: data.update_tours_by_pk
        };
      }
    } catch (error) {
      console.error('Error submitting tour:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  return {
    handleSubmit,
    loading: createLoading || updateLoading
  };
};
