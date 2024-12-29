import BasicInformation from './create/BasicInformation';
import PricingDetails from './create/PricingDetails';
import MediaSection from './create/MediaSection';
import Activities from './create/Activities';
import Schedule from './create/Schedule';
import InclusionsExclusions from './create/InclusionsExclusions';
import Accessibility from './create/Accessibility';

export const steps = [
  { 
    id: 'basic', 
    title: 'Basic Information', 
    component: BasicInformation, 
    fields: [
      'title', 
      'description', 
      'tour_type', 
      'duration', 
      'duration_type', 
      'meeting_point',
      'status'
    ]
  },
  { 
    id: 'pricing', 
    title: 'Pricing & Capacity', 
    component: PricingDetails, 
    fields: [
      'pricing.pricePerPerson', 
      'pricing.maxCapacity', 
      'pricing.paymentDetails', 
      'pricing.refundPolicy',
      'pricing.earlyBirdDiscount',
      'pricing.groupDiscount'
    ] 
  },
  { 
    id: 'media', 
    title: 'Media', 
    component: MediaSection, 
    fields: ['mainImage', 'gallery'] 
  },
  { 
    id: 'schedule', 
    title: 'Schedule', 
    component: Schedule, 
    fields: ['default_start_time', 'tourDates', 'meeting_point'] 
  },
  { 
    id: 'activities', 
    title: 'Activities', 
    component: Activities, 
    fields: ['activities'] 
  },
  { 
    id: 'inclusions', 
    title: 'Inclusions & Exclusions', 
    component: InclusionsExclusions, 
    fields: ['included', 'notIncluded', 'providedEquipment', 'requiredEquipment'] 
  },
  { 
    id: 'accessibility', 
    title: 'Accessibility', 
    component: Accessibility, 
    fields: ['accessibility'] 
  }
];
