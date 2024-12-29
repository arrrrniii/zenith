import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TourFinancePage from '@/components/dashboard/finance/TourFinancePage';

const TourFinanceView = () => {
  return (
    <DashboardLayout pageTitle="Tour Finance">
      <TourFinancePage />
    </DashboardLayout>
  );
};

export default TourFinanceView;