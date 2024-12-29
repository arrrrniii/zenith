// constants/tourData.js
export const defaultFormData = {
    title: '',
    description: '',
    tourType: 'single_day',
    duration: '',
    durationType: 'hours',
    status: 'draft',
    difficultyLevel: 'easy',
    pricing: {
      pricePerPerson: '',
      maxCapacity: '',
      earlyBirdDiscount: '',
      groupDiscount: '',
      paymentDetails: '',
      refundPolicy: '',
      depositRequirements: ''
    },
    mainImage: null,
    gallery: [],
    videoUrl: '',
    meetingPoint: '',
    defaultStartTime: '09:00',
    tourDates: [],
    activities: [],
    included: [],
    notIncluded: [],
    providedEquipment: [],
    requiredEquipment: [],
    accessibility: {
      wheelchairAccessible: false,
      mobilityAid: false,
      visualAid: false,
      hearingAid: false,
      serviceAnimals: false,
      minimumAge: '',
      fitnessLevel: 'low',
      restrictions: [],
      notes: ''
    }
  };
  
  export const testTourData = {
    title: "City Walking Tour",
    description: "Explore the historic downtown area with our expert guides. Perfect for history buffs and casual tourists alike.",
    tourType: "single_day",
    duration: "4",
    durationType: "hours",
    status: "draft",
    difficultyLevel: "easy",
    pricing: {
      pricePerPerson: "50",
      maxCapacity: "15",
      earlyBirdDiscount: "10",
      groupDiscount: "15",
      paymentDetails: "Payment required 48 hours before tour",
      refundPolicy: "Full refund if cancelled 24 hours before",
      depositRequirements: "20% deposit required"
    },
    mainImage: "https://example.com/tour-image.jpg",
    gallery: ["https://example.com/gallery1.jpg", "https://example.com/gallery2.jpg"],
    videoUrl: "https://youtube.com/watch?v=abc123",
    meetingPoint: "Central Station Main Entrance",
    defaultStartTime: "09:00",
    tourDates: [
      {
        startDate: "2024-12-01",
        endDate: "2024-12-01",
        startTime: "09:00",
        status: "active"
      }
    ],
    activities: [
      {
        title: "Historical Walking Tour",
        duration: 120,
        description: "Walk through historic district with expert commentary",
        location: "Downtown",
        sequence_order: 1
      },
      {
        title: "Local Market Visit",
        duration: 60,
        description: "Experience local culture and foods",
        location: "City Market",
        sequence_order: 2
      }
    ],
    included: ["Professional guide", "Water bottle", "Snacks"],
    notIncluded: ["Lunch", "Transportation", "Personal expenses"],
    providedEquipment: ["Umbrella", "Audio guide", "Map"],
    requiredEquipment: ["Comfortable shoes", "Camera", "Light jacket"],
    accessibility: {
      wheelchairAccessible: true,
      mobilityAid: true,
      visualAid: false,
      hearingAid: true,
      serviceAnimals: true,
      minimumAge: "12",
      fitnessLevel: "low",
      notes: "Please inform us of any specific requirements in advance"
    }
  };
  
  export const validateForm = (formData) => {
    const errors = {};
  
    if (!formData.title?.trim()) errors.title = 'Title is required';
    if (!formData.description?.trim()) errors.description = 'Description is required';
    if (!formData.duration) errors.duration = 'Duration is required';
    if (!formData.pricing?.pricePerPerson) {
      errors.pricing = errors.pricing || {};
      errors.pricing.pricePerPerson = 'Price per person is required';
    }
    if (!formData.pricing?.maxCapacity) {
      errors.pricing = errors.pricing || {};
      errors.pricing.maxCapacity = 'Maximum capacity is required';
    }
    if (!formData.meetingPoint?.trim()) errors.meetingPoint = 'Meeting point is required';
    if (!formData.tourDates?.length) errors.tourDates = 'At least one tour date is required';
    if (!formData.activities?.length) errors.activities = 'At least one activity is required';
    if (!formData.included?.length) errors.included = 'At least one inclusion is required';
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };