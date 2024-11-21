// utils/mockData.js
import { CARD_TYPES } from '@/types';

// Tour types enum
export const TOUR_TYPES = {
  SINGLE_DAY: 'single_day',
  MULTI_DAY: 'multi_day',
  GUIDED: 'guided',
  SELF_GUIDED: 'self_guided',
  PRIVATE: 'private',
  GROUP: 'group'
};

export const tripData = {
  id: "chicago-architecture-experience",
  title: "Chicago 3-Day Architecture & Culture Experience",
  rating: 4.5,
  reviews: 1917,
  providedBy: "Wendella",
  tourType: TOUR_TYPES.MULTI_DAY,
  price: {
    amount: 599.00,
    currency: "USD",
    unit: "per person",
    originalPrice: 699.00,
    savings: "15% off",
    priceDetails: "Price varies by group size",
    deposit: {
      amount: 99.00,
      required: true,
      refundable: true,
      deadline: "30 days before tour"
    }
  },
  badges: [
    { type: "bestseller", text: "BEST SELLER" },
    { type: "limited", text: "LIKELY TO SELL OUT" }
  ],
  images: [
    "/caption.jpg",
    "/caption.jpg",
    "/caption.jpg",
    "/caption.jpg",
    "/caption.jpg",
    "/caption.jpg"
  ],
  description: "Immerse yourself in Chicago's architectural heritage with this comprehensive 3-day experience. From river cruises to walking tours, explore the city's most iconic buildings and hidden gems, guided by expert architectural historians.",
  highlights: [
    "Exclusive access to 5 architectural landmarks",
    "Guided river cruise with expert commentary",
    "Behind-the-scenes tour of historic skyscrapers",
    "Rooftop photography sessions at sunset",
    "Cultural food experiences at historic locations",
    "Private tours of normally restricted areas"
  ],
  included: {
    included: [
      "3 days of guided tours",
      "All entrance fees",
      "Professional architectural guide",
      "River cruise tickets",
      "2 group dinners",
      "Photography permit",
      "Transportation between sites",
      "Welcome package"
    ],
    notIncluded: [
      "Hotel accommodation",
      "Airport transfers",
      "Personal expenses",
      "Lunches",
      "Gratuities"
    ]
  },
  tourSchedule: {
    duration: "3 days",
    startDates: [
      "2024-06-15",
      "2024-07-01",
      "2024-07-15",
      "2024-08-01",
      "2024-08-15"
    ],
    dailySchedules: [
      {
        day: 1,
        date: null, // Set dynamically based on start date
        title: "Chicago River & Downtown Landmarks",
        description: "Begin your architectural journey with our signature river cruise followed by an afternoon exploring downtown landmarks.",
        schedule: [
          {
            time: "09:00",
            activity: "Welcome Meeting",
            details: "Meet your guide at the historic Wrigley Building",
            location: "400 N Michigan Ave"
          },
          {
            time: "09:30",
            activity: "Architecture River Cruise",
            details: "90-minute cruise covering all three branches of the Chicago River",
            duration: "1h 30m"
          },
          {
            time: "11:30",
            activity: "Lunch Break",
            details: "Free time for lunch at Riverside Plaza",
            duration: "1h"
          },
          {
            time: "13:00",
            activity: "Walking Tour: Loop Landmarks",
            details: "Explore iconic buildings including Rookery Building and Monadnock Building",
            duration: "3h"
          },
          {
            time: "16:00",
            activity: "Rooftop Photography Session",
            details: "Sunset photo opportunity from exclusive rooftop location",
            duration: "1h 30m"
          },
          {
            time: "18:00",
            activity: "Welcome Dinner",
            details: "Group dinner at historic Berghoff Restaurant",
            duration: "2h"
          }
        ]
      },
      {
        day: 2,
        date: null,
        title: "Modern Architecture & Innovation",
        description: "Focus on Chicago's modern architectural masterpieces and contemporary design.",
        schedule: [
          {
            time: "09:00",
            activity: "Modern Architecture Tour",
            details: "Exploring Mies van der Rohe's legacy",
            duration: "3h"
          },
          {
            time: "12:00",
            activity: "Lunch Break",
            details: "Independent lunch",
            duration: "1h"
          },
          {
            time: "13:30",
            activity: "Behind-the-Scenes Tour",
            details: "Special access to contemporary architectural sites",
            duration: "2h 30m"
          },
          {
            time: "16:30",
            activity: "Frank Lloyd Wright Tour",
            details: "Visit to significant Wright-designed buildings",
            duration: "2h"
          },
          {
            time: "19:00",
            activity: "Free Evening",
            details: "Evening at leisure",
            duration: "3h"
          }
        ]
      },
      {
        day: 3,
        date: null,
        title: "Historic Neighborhoods & Cultural Heritage",
        description: "Discover the architectural diversity of Chicago's historic neighborhoods.",
        schedule: [
          {
            time: "09:30",
            activity: "Historic Districts Tour",
            details: "Exploring Gold Coast and Old Town architecture",
            duration: "2h 30m"
          },
          {
            time: "12:00",
            activity: "Cultural Lunch Experience",
            details: "Group lunch in historic building",
            duration: "1h 30m"
          },
          {
            time: "14:00",
            activity: "Prairie Avenue Tour",
            details: "Visit to historic mansions district",
            duration: "2h"
          },
          {
            time: "16:30",
            activity: "Final Photography Session",
            details: "Capturing architectural details",
            duration: "1h"
          },
          {
            time: "18:00",
            activity: "Farewell Dinner",
            details: "Group dinner with presentation of tour highlights",
            duration: "2h"
          }
        ]
      }
    ]
  },
  departure: {
    point: "400 N Michigan Ave, Chicago, IL 60611",
    directions: "Meet at the Wrigley Building main entrance",
    startTimes: ["09:00 AM"],
    timesToKnow: [
      "Tour starts promptly at 9:00 AM each day",
      "Check in 15 minutes before departure",
      "Daily schedule may adjust based on weather and availability"
    ]
  },
  accessibility: {
    wheelchairAccessible: "Partially - some venues have limited access",
    serviceAnimalsAllowed: true,
    infantSeatsAvailable: false,
    physicalDemand: "Moderate - involves walking and standing",
    restrictions: [
      "Participants must be able to walk for up to 3 hours",
      "Some buildings do not have elevator access",
      "Not recommended for travelers with severe mobility impairments"
    ]
  },
  additionalInfo: {
    confirmation: "You'll receive confirmation within 24 hours of booking",
    useGuidelines: [
      "Face masks recommended indoors",
      "Hand sanitizer available",
      "Some venues require proof of vaccination"
    ],
    whatToBring: [
      "Comfortable walking shoes",
      "Camera",
      "Weather-appropriate clothing",
      "Water bottle",
      "Sun protection",
      "Light jacket (for river cruise)"
    ],
    weatherPolicy: "Tours operate in most weather conditions, indoor alternatives available for extreme weather"
  },
  cancellation: {
    policy: "Free cancellation up to 30 days before tour start",
    refundPolicy: "Full refund with 30-day notice; 50% refund up to 14 days before start",
    noRefundPolicy: "No refund for cancellations made less than 14 days before start",
    changePolicy: "One free date change allowed up to 30 days before tour"
  },
  faq: [
    {
      question: "How physically demanding is the tour?",
      answer: "The tour involves daily walking tours of 2-3 hours and standing for extended periods. While we maintain a comfortable pace, participants should be comfortable with urban walking."
    },
    {
      question: "What happens in case of bad weather?",
      answer: "We have indoor alternative activities planned for extreme weather. Light rain or snow doesn't affect most activities as many sites are indoors."
    },
    {
      question: "Can I join for just one day of the tour?",
      answer: "This is a comprehensive experience designed to be taken in full. Single-day tours are available as separate bookings."
    },
    {
      question: "Are hotel accommodations included?",
      answer: "Hotel accommodations are not included but we can recommend partner hotels nearby at preferred rates."
    }
  ],
  details: {
    duration: "3 days",
    groupSize: "6-12 participants",
    startTime: "9:00 AM daily",
    ticketType: "Mobile ticket",
    languages: {
      live: ["English"],
      written: ["Chinese", "English", "Spanish"]
    },
    features: [
      "Small group guarantee",
      "Expert architectural guides",
      "Flexible booking",
      "Free cancellation"
    ],
    accessibility: "Partially wheelchair accessible"
  },
  location: {
    city: "Chicago",
    state: "IL",
    country: "USA",
    region: "Midwest",
    coordinates: {
      latitude: 41.8881,
      longitude: -87.6298
    },
    landmarks: [
      "Chicago River",
      "Wrigley Building",
      "Michigan Avenue",
      "Frank Lloyd Wright Home",
      "Robie House"
    ]
  },
  category: {
    primary: "Architecture Tours",
    secondary: "Cultural Experience",
    tags: [
      "Architecture",
      "History",
      "Photography",
      "Walking Tour",
      "River Cruise",
      "Cultural"
    ],
    themeColor: "blue"
  },
  tripStyle: {
    duration: "3 days",
    type: "Multi-day Tour",
    physicalLevel: "Moderate",
    groupType: "Small Group",
    bestSeason: ["Spring", "Summer", "Fall"],
    idealFor: [
      "Architecture Enthusiasts",
      "Photographers",
      "History Buffs",
      "Urban Explorers"
    ]
  },
  similarTrips: [
    {
      id: "1",
      href:"/chicago-night-architecture",
      title: "Chicago Night Architecture Tour",
      image: "/caption.jpg"
    },
    {
      id: "2",
      href:"/frank-lloyd-wright",
      title: "Frank Lloyd Wright Heritage Tour",
      image: "/caption.jpg"
    },
    {
      id: "3",
      href:"/chicago-photo-tour",
      title: "Chicago Architecture Photography Tour",
      image: "/caption.jpg"
    },
    {
      id: "4",
      href:"/modernist-chicago",
      title: "Modernist Chicago Walking Tour",
      image: "/caption.jpg"
    }
  ]
};