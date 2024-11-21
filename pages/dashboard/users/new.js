// pages/dashboard/users/new.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UserForm from '@/components/dashboard/users/UserForm';

const NewUserPage = () => {
  return (
    <DashboardLayout pageTitle="Create New User">
      <UserForm mode="create" />
    </DashboardLayout>
  );
};

export default NewUserPage;

