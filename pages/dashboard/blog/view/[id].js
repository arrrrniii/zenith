// pages/dashboard/blog/view/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BlogView from '@/components/dashboard/blog/BlogView';

const ViewBlogPost = () => {
  const router = useRouter();
  const { id } = router.query;

  // Sample data - replace with actual data fetch
  const postData = {
    id: 1,
    title: "Top 10 Hidden Gems in Chicago",
    content: "Lorem ipsum dolor sit amet...",
    excerpt: "Discover the lesser-known attractions...",
    author: "Jane Smith",
    publishDate: "March 15, 2024",
    status: "published",
    featuredImage: "/api/placeholder/1200/600",
    views: 1234,
    viewsToday: 56,
    shares: 23,
    commentsCount: 12,
    readTime: "5",
    categories: ["Travel Tips", "City Guides"],
    tags: ["Chicago", "Hidden Gems", "Travel", "Local Tips"],
    seoTitle: "Discover Chicago's Hidden Gems: Local's Guide to Secret Spots",
    seoDescription: "Explore Chicago's best-kept secrets...",
    slug: "top-10-hidden-gems-chicago"
  };

  return (
    <DashboardLayout pageTitle="View Post">
      <BlogView post={postData} />
    </DashboardLayout>
  );
};

export default ViewBlogPost;