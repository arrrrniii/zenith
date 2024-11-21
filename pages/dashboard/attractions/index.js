// pages/dashboard/attractions/index.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AttractionsPage from '@/components/dashboard/attractions/AttractionsPage';

const AttractionsIndex = () => {
  return (
    <DashboardLayout pageTitle="Attractions">
      <AttractionsPage />
    </DashboardLayout>
  );
};

export default AttractionsIndex;