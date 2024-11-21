// pages/dashboard/users/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UserView from '@/components/dashboard/users/UserView';

const UserDetailsPage = () => {
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
    joinedDate: 'Jan 15, 2024',
    lastActive: '5 minutes ago',
    avatar: '/api/placeholder/80/80',
    permissions: [
      { name: 'Manage Tours', key: 'tours.manage' },
      { name: 'Manage Bookings', key: 'bookings.manage' },
      { name: 'Manage Users', key: 'users.manage' },
      { name: 'View Reports', key: 'reports.view' }
    ]
  };

  return (
    <DashboardLayout pageTitle="User Details">
      <UserView user={userData} />
    </DashboardLayout>
  );
};

export default UserDetailsPage;