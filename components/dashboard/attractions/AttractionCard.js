// components/dashboard/attractions/AttractionCard.js
import React from 'react';
import { Star, MapPin, Clock, Calendar, Globe, Edit, Eye, Trash2 } from 'lucide-react';

const AttractionCard = ({ attraction, onEdit, onDelete, onView }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-900">{attraction.name}</h3>
          <span className="ml-2 flex items-center text-sm text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1">{attraction.rating}</span>
            <span className="ml-1 text-gray-500">({attraction.reviewCount})</span>
          </span>
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          {attraction.location}
        </div>
        
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {attraction.hours}
          </span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {attraction.lastUpdated}
          </span>
          <span className="flex items-center">
            <Globe className="w-4 h-4 mr-1" />
            {attraction.website}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onView(attraction)}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onEdit(attraction)}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onDelete(attraction.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {attraction.categories.map((category, index) => (
          <span 
            key={index}
            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {category}
          </span>
        ))}
      </div>
      <span className={`
        px-2.5 py-0.5 rounded-full text-xs font-medium
        ${attraction.status === 'open' ? 'bg-green-100 text-green-800' : 
          attraction.status === 'closed' ? 'bg-red-100 text-red-800' : 
          'bg-yellow-100 text-yellow-800'}
      `}>
        {attraction.status.charAt(0).toUpperCase() + attraction.status.slice(1)}
      </span>
    </div>
  </div>
);

export default AttractionCard;