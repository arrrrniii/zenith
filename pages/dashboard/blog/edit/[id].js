// pages/dashboard/blog/edit/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BlogEditor from '@/components/dashboard/blog/BlogEditor';

const EditBlogPost = () => {
  const router = useRouter();
  const { id } = router.query;

  // Sample data - replace with actual data fetch
  const postData = {
    title: "Sample Post",
    content: "Sample content...",
    excerpt: "Sample excerpt...",
    // ... other fields
  };

  return (
    <DashboardLayout pageTitle="Edit Post">
      <BlogEditor initialData={postData} />
    </DashboardLayout>
  );
};

export default EditBlogPost;
