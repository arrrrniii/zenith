// pages/dashboard/blog/media/index.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MediaLibraryPage from '@/components/dashboard/blog/media/MediaLibrary';

const MediaLibrary = () => {
  return (
    <DashboardLayout pageTitle="Media Library">
      <MediaLibraryPage />
    </DashboardLayout>
  );
};

export default MediaLibrary;