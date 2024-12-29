export function convertNumberFields(data) {
    const converted = { ...data };
  
    if (converted.duration === '') {
      converted.duration = 0;
    } else if (converted.duration !== undefined) {
      converted.duration = Number(converted.duration);
    }
  
    if (converted.pricing) {
      if (converted.pricing.pricePerPerson === '') {
        converted.pricing.pricePerPerson = 0;
      } else if (converted.pricing.pricePerPerson !== undefined) {
        converted.pricing.pricePerPerson = Number(converted.pricing.pricePerPerson);
      }
  
      if (converted.pricing.maxCapacity === '') {
        converted.pricing.maxCapacity = 0;
      } else if (converted.pricing.maxCapacity !== undefined) {
        converted.pricing.maxCapacity = Number(converted.pricing.maxCapacity);
      }
  
      if (converted.pricing.earlyBirdDiscount !== undefined && converted.pricing.earlyBirdDiscount !== '') {
        converted.pricing.earlyBirdDiscount = Number(converted.pricing.earlyBirdDiscount);
      }
  
      if (converted.pricing.groupDiscount !== undefined && converted.pricing.groupDiscount !== '') {
        converted.pricing.groupDiscount = Number(converted.pricing.groupDiscount);
      }
    }
  
    if (converted.accessibility && converted.accessibility.minimumAge !== null && converted.accessibility.minimumAge !== '') {
      converted.accessibility.minimumAge = Number(converted.accessibility.minimumAge);
    }
  
    return converted;
  }
  
  export function prepareCreateData(formData) {
    const data = { ...formData };
    data.status = data.status || 'draft';
  
    if (data.id === null) {
      delete data.id;
    }
  
    // mainImage -> main_image_url
    if (data.mainImage) {
      data.main_image_url = data.mainImage;
    } else {
      data.main_image_url = null;
    }
    delete data.mainImage;
  
    // videoUrl -> video_url
    if (data.videoUrl) {
      data.video_url = data.videoUrl;
    } else {
      data.video_url = null;
    }
    delete data.videoUrl;
  
    // Gallery
    if (data.gallery && data.gallery.length > 0) {
      data.tour_galleries = {
        data: data.gallery.map((img, index) => ({
          image_url: typeof img === 'string' ? img : img.image_url,
          sequence_order: index + 1
        }))
      };
    }
    delete data.gallery;
  
    // Pricing
    if (data.pricing) {
      data.tour_pricing = {
        data: {
          price_per_person: data.pricing.pricePerPerson,
          max_capacity: data.pricing.maxCapacity,
          payment_details: data.pricing.paymentDetails,
          refund_policy: data.pricing.refundPolicy,
          early_bird_discount_percentage: data.pricing.earlyBirdDiscount,
          group_discount_percentage: data.pricing.groupDiscount,
          deposit_requirements: data.pricing.depositRequirements || ""
        }
      };
    }
    delete data.pricing;
  
    // Accessibility
    if (data.accessibility) {
      data.tour_accessibility_feature = {
        data: {
          wheelchair_accessible: data.accessibility.wheelchairAccessible,
          mobility_aid: data.accessibility.mobilityAid,
          visual_aid: data.accessibility.visualAid,
          hearing_aid: data.accessibility.hearingAid,
          service_animals: data.accessibility.serviceAnimals,
          minimum_age: data.accessibility.minimumAge,
          fitness_level: data.accessibility.fitnessLevel || null,
          notes: data.accessibility.notes || ""
        }
      };
    }
    delete data.accessibility;
  
    // Tour Dates
    if (data.tourDates && data.tourDates.length > 0) {
      data.tour_dates = {
        data: data.tourDates.map(d => ({
          date: d.startDate,
          end_date: d.endDate || null,
          start_time: d.startTime,
          status: d.status || 'active',
          available_spots: 20
        }))
      };
    }
    delete data.tourDates;
  
    // Activities
    if (data.activities && data.activities.length > 0) {
      data.tour_activities = {
        data: data.activities.map((a, index) => ({
          title: a.title,
          duration: parseInt(a.duration, 10) || 1,
          description: a.description,
          location: a.location,
          sequence_order: index + 1
        }))
      };
    }
    delete data.activities;
  
    // Inclusions
    const inclusionItems = [];
    if (data.included) {
      inclusionItems.push(...data.included.map(desc => ({ type: 'included', description: desc })));
    }
    if (data.notIncluded) {
      inclusionItems.push(...data.notIncluded.map(desc => ({ type: 'not_included', description: desc })));
    }
    if (data.providedEquipment) {
      inclusionItems.push(...data.providedEquipment.map(desc => ({ type: 'provided_equipment', description: desc })));
    }
    if (data.requiredEquipment) {
      inclusionItems.push(...data.requiredEquipment.map(desc => ({ type: 'required_equipment', description: desc })));
    }
  
    if (inclusionItems.length > 0) {
      data.tour_inclusions = { data: inclusionItems };
    }
  
    delete data.included;
    delete data.notIncluded;
    delete data.providedEquipment;
    delete data.requiredEquipment;
  
    return data;
  }
  
  export function prepareUpdateData(formData) {
    const data = { ...formData };
  
    if (data.id === null) {
      delete data.id;
    }
  
    if (data.mainImage) {
      data.main_image_url = data.mainImage;
    } else {
      data.main_image_url = null;
    }
    delete data.mainImage;
  
    if (data.videoUrl) {
      data.video_url = data.videoUrl;
    } else {
      data.video_url = null;
    }
    delete data.videoUrl;
  
    delete data.gallery;
    delete data.tourDates;
    delete data.activities;
    delete data.included;
    delete data.notIncluded;
    delete data.providedEquipment;
    delete data.requiredEquipment;
    delete data.pricing;
    delete data.accessibility;
  
    return data;
  }
  