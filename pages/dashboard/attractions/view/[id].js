// pages/dashboard/attractions/view/[id].js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AttractionView from '@/components/dashboard/attractions/AttractionView';
import { useRouter } from 'next/router';

const ViewAttraction = () => {
  const router = useRouter();
  const { id } = router.query;

  // Fetch attraction data based on ID
  const attractionData = {}; // Replace with actual data

  return (
    <DashboardLayout pageTitle="View Attraction">
      <AttractionView attraction={attractionData} />
    </DashboardLayout>
  );
};

export default ViewAttraction;