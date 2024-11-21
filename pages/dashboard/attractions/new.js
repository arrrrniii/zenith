// pages/dashboard/attractions/new.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AttractionForm from '@/components/dashboard/attractions/AttractionForm';

const NewAttraction = () => {
  return (
    <DashboardLayout pageTitle="Add New Attraction">
      <AttractionForm />
    </DashboardLayout>
  );
};

export default NewAttraction;