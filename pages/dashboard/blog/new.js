// pages/dashboard/blog/new.js
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BlogEditor from '@/components/dashboard/blog/BlogEditor';

const NewBlogPost = () => {
  return (
    <DashboardLayout pageTitle="Create New Post">
      <BlogEditor />
    </DashboardLayout>
  );
};

export default NewBlogPost;
