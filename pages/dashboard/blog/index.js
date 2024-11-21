// pages/dashboard/blog/index.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BlogPage from '@/components/dashboard/blog/BlogPage';

const BlogIndex = () => {
  return (
    <DashboardLayout pageTitle="Blog">
      <BlogPage />
    </DashboardLayout>
  );
};

export default BlogIndex;