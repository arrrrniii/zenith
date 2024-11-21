// pages/dashboard/index.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardOverview from '@/components/dashboard/overview/DashboardOverview';

const Dashboard = () => {
  return (
    <DashboardLayout pageTitle="Dashboard">
      <DashboardOverview />
    </DashboardLayout>
  );
};

export default Dashboard;