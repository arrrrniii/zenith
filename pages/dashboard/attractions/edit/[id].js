// pages/dashboard/attractions/edit/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_ATTRACTION } from '@/components/dashboard/attractions/graphql/operations';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AttractionForm from '@/components/dashboard/attractions/AttractionForm';
import { Loader2 } from 'lucide-react';

const EditAttraction = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(GET_ATTRACTION, {
    variables: { id: parseInt(id) },
    skip: !id,
    fetchPolicy: 'network-only'
  });

  // Loading state
  if (loading) {
    return (
      <DashboardLayout pageTitle="Edit Attraction">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading attraction data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout pageTitle="Edit Attraction">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-red-600">Error loading attraction data.</p>
            <button
              onClick={() => router.reload()}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Not found state
  if (!loading && !data?.attractions_by_pk) {
    return (
      <DashboardLayout pageTitle="Edit Attraction">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <p className="text-gray-600">Attraction not found.</p>
            <button
              onClick={() => router.push('/dashboard/attractions')}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Attractions
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Format the data for the form
  const attraction = data?.attractions_by_pk;
  const attractionData = {
    id: attraction?.id,
    name: attraction?.name || '',
    description: attraction?.description || '',
    address: attraction?.address || '',
    directions: attraction?.directions || '',
    hours: attraction?.hours || '',
    website: attraction?.website || '',
    phone: attraction?.phone || '',
    price_range: attraction?.price_range || '',
    status: attraction?.status || 'open',
    rating: attraction?.rating || null,
    review_count: attraction?.review_count || 0,
    monthly_visitors: attraction?.monthly_visitors || 0,
    country: attraction?.country?.toString() || '',
    city: attraction?.city?.toString() || '',
    categories: attraction?.attraction_categories?.map(ac => ac.category_id) || [],
    images: attraction?.attraction_images?.map(img => img.image_url) || [],
    attraction_categories: attraction?.attraction_categories || [],
    attraction_images: attraction?.attraction_images || []
  };

  return (
    <DashboardLayout pageTitle="Edit Attraction">
      <AttractionForm 
        mode="edit"
        initialData={attractionData}
      />
    </DashboardLayout>
  );
};

export default EditAttraction;