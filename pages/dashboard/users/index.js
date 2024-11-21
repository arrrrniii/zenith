// pages/dashboard/users/index.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UsersPage from '@/components/dashboard/users/UsersPage';

const UsersIndex = () => {
  return (
    <DashboardLayout pageTitle="Users">
      <UsersPage />
    </DashboardLayout>
  );
};

export default UsersIndex;