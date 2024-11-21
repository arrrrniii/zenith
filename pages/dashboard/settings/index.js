// pages/dashboard/settings/index.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SettingsPage from '@/components/dashboard/settings/SettingsPage';

const Settings = () => {
  return (
    <DashboardLayout pageTitle="Settings">
      <SettingsPage />
    </DashboardLayout>
  );
};

export default Settings;