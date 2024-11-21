// components/dashboard/attractions/AttractionView.js
import React from 'react';
import { useRouter } from 'next/router';
import { 
  MapPin, 
  Globe, 
  Clock, 
  Star,
  Phone,
  Mail,
  Calendar,
  Users,
  DollarSign,
  Edit,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';


const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div className="px-6 py-4">
      {children}
    </div>
  </div>
);

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center text-sm">
    <Icon className="w-4 h-4 text-gray-400 mr-2" />
    <span className="text-gray-500 mr-2">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

const AttractionView = ({ attraction }) => {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Attractions
        </button>
        <button
          onClick={() => router.push(`/dashboard/attractions/edit/${attraction.id}`)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Attraction
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{attraction.name}</h1>
              <div className="mt-2 flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">{attraction.address}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-lg font-semibold">{attraction.rating}</span>
              <span className="text-gray-500">({attraction.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-6">
            {attraction.status && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                attraction.status === 'open' 
                  ? 'bg-green-100 text-green-800' 
                  : attraction.status === 'closed'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {attraction.status.charAt(0).toUpperCase() + attraction.status.slice(1)}
              </span>
            )}
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-3 gap-4">
                {attraction.images?.map((image, index) => (
                <div 
                    key={index}
                    className="aspect-video relative rounded-lg overflow-hidden bg-gray-100"
                >
                    <Image
                    src={image}
                    alt={`${attraction.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0} // Load the first image with priority
                    />
                </div>
                ))}
            </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <InfoCard title="Basic Information">
            <div className="space-y-3">
              <DetailItem 
                icon={Clock} 
                label="Hours"
                value={attraction.hours}
              />
              <DetailItem 
                icon={Phone} 
                label="Phone"
                value={attraction.phone || 'Not provided'}
              />
              <DetailItem 
                icon={Globe} 
                label="Website"
                value={
                  <a 
                    href={attraction.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    {attraction.website}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                }
              />
            </div>
          </InfoCard>

          {/* Categories and Tags */}
          <InfoCard title="Categories">
            <div className="flex flex-wrap gap-2">
              {attraction.categories?.map((category, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {category}
                </span>
              ))}
            </div>
          </InfoCard>

          {/* Description */}
          <InfoCard title="Description">
            <p className="text-gray-600 whitespace-pre-line">
              {attraction.description}
            </p>
          </InfoCard>

          {/* Location Details */}
          <InfoCard title="Location Details">
            <div className="space-y-3">
              <DetailItem 
                icon={MapPin} 
                label="Address"
                value={attraction.address}
              />
              {attraction.directions && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Getting There:</h4>
                  <p className="text-sm text-gray-600">{attraction.directions}</p>
                </div>
              )}
            </div>
          </InfoCard>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Monthly Visitors', value: attraction.monthlyVisitors || '0' },
            { icon: Star, label: 'Average Rating', value: attraction.rating || '0' },
            { icon: Calendar, label: 'Added Date', value: attraction.addedDate || 'Not available' },
            { icon: DollarSign, label: 'Price Range', value: attraction.priceRange || 'Not specified' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <stat.icon className="w-5 h-5 text-gray-400" />
              </div>
              <p className="mt-2 text-xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttractionView;