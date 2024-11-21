// pages/dashboard/tours/index.js
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ToursPage from '@/components/dashboard/ToursPage';

const ToursPageWrapper = () => {
  return (
    <DashboardLayout activeSection="tours">
      <ToursPage />
    </DashboardLayout>
  );
};

export default ToursPageWrapper;