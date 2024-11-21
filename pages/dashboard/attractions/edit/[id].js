// pages/dashboard/attractions/edit/[id].js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AttractionForm from '@/components/dashboard/attractions/AttractionForm';
import { useRouter } from 'next/router';

const EditAttraction = () => {
  const router = useRouter();
  const { id } = router.query;

  // Fetch attraction data based on ID
  const attractionData = {}; // Replace with actual data

  return (
    <DashboardLayout pageTitle="Edit Attraction">
      <AttractionForm initialData={attractionData} />
    </DashboardLayout>
  );
};

export default EditAttraction;