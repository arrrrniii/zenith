// components/dashboard/attractions/AttractionsPage.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Plus } from 'lucide-react';
import AttractionsFilter from './AttractionsFilter';
import AttractionsList from './AttractionsList';

const AttractionsPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });

  // Sample data - Replace with actual data fetch
  const attractions = [
    {
      id: 1,
      name: "Cloud Gate (The Bean)",
      rating: 4.8,
      reviewCount: 12453,
      location: "Millennium Park, Chicago",
      hours: "6:00 AM - 11:00 PM",
      lastUpdated: "2024-03-15",
      website: "millenniumpark.org",
      categories: ["Landmarks", "Art"],
      status: "open"
    },
    // ... more attractions
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleEdit = (attraction) => {
    router.push(`/dashboard/attractions/edit/${attraction.id}`);
  };

  const handleDelete = (attractionId) => {
    // Handle deletion
    console.log('Deleting attraction:', attractionId);
  };

  const handleView = (attraction) => {
    router.push(`/dashboard/attractions/view/${attraction.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Attractions</h1>
        <button
          onClick={() => router.push('/dashboard/attractions/new')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Attraction
        </button>
      </div>

      <AttractionsFilter onFilterChange={handleFilterChange} />
      
      <AttractionsList 
        attractions={attractions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
};

export default AttractionsPage;