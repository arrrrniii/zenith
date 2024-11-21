// types/tour.ts
export interface Tour {
    id: string;
    title: string;
    description: string;
    tour_type: 'single_day' | 'multi_day' | 'guided' | 'self_guided' | 'private' | 'group';
    duration: number;
    duration_type: 'hours' | 'days';
    base_price: number;
    max_capacity: number;
    minimum_age?: number;
    difficulty_level: 'easy' | 'moderate' | 'challenging' | 'difficult';
    meeting_point: string;
    status: 'draft' | 'published' | 'archived';
    created_at?: string;
    updated_at?: string;
  }
  
  export interface TourPricing {
    id?: string;
    tour_id?: string;
    price_per_person: number;
    early_bird_discount_percentage: number;
    group_discount_percentage: number;
    payment_details?: string;
    refund_policy?: string;
    deposit_requirements?: string;
  }
  
  export interface TourActivity {
    id?: string;
    tour_id?: string;
    name: string;
    start_time: string;
    duration: number;
    description?: string;
    sequence_order: number;
  }
  
  export interface TourDate {
    id?: string;
    tour_id?: string;
    date: string;
    start_time: string;
    available_spots: number;
    status: 'available' | 'fully_booked' | 'cancelled';
  }
  
  export interface TourInclusion {
    id?: string;
    tour_id?: string;
    type: 'included' | 'not_included' | 'provided_equipment' | 'required_equipment';
    description: string;
  }
  
  export interface TourAccessibility {
    wheelchair_accessible: boolean;
    mobility_aid: boolean;
    visual_aid: boolean;
    hearing_aid: boolean;
    service_animals: boolean;
    notes?: string;
  }
  
  export interface TourFormData extends Omit<Tour, 'id' | 'created_at' | 'updated_at'> {
    pricing: Omit<TourPricing, 'id' | 'tour_id'>;
    activities: Omit<TourActivity, 'id' | 'tour_id'>[];
    dates: Omit<TourDate, 'id' | 'tour_id'>[];
    inclusions: Omit<TourInclusion, 'id' | 'tour_id'>[];
    accessibility: TourAccessibility;
  }
  