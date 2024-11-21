// pages/dashboard/users/edit/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UserForm from '@/components/dashboard/users/UserForm';

const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Sample user data - replace with actual data fetch
  const userData = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Chicago, IL',
    role: 'admin',
    status: 'active',
    avatar: '/api/placeholder/80/80',
    permissions: ['tours.manage', 'bookings.manage', 'users.manage', 'reports.view']
  };

  return (
    <DashboardLayout pageTitle="Edit User">
      <UserForm 
        mode="edit"
        initialData={userData}
      />
    </DashboardLayout>
  );
};

export default EditUserPage;