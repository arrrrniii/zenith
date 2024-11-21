
// components/dashboard/blog/BlogPage.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { PenSquare } from 'lucide-react';
import BlogFilter from './BlogFilter';
import BlogList from './BlogList';

const BlogPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });

  // Sample data
  const posts = [
    {
      id: 1,
      title: "Top 10 Hidden Gems in Chicago",
      excerpt: "Discover the lesser-known attractions and secret spots that make Chicago truly special...",
      status: "published",
      author: "Jane Smith",
      publishDate: "2024-03-15",
      thumbnail: "/api/placeholder/400/300",
      commentsCount: 12
    },
    {
      id: 2,
      title: "Best Food Tours in the City",
      excerpt: "A comprehensive guide to experiencing Chicago's diverse culinary scene...",
      status: "draft",
      author: "Mike Johnson",
      publishDate: "2024-03-14",
      thumbnail: "/api/placeholder/400/300",
      commentsCount: 5
    },
    {
      id: 3,
      title: "Chicago Architecture: A Historical Guide",
      excerpt: "Explore the architectural marvels that define Chicago's skyline...",
      status: "published",
      author: "Sarah Wilson",
      publishDate: "2024-03-13",
      thumbnail: "/api/placeholder/400/300",
      commentsCount: 8
    }
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleEdit = (post) => {
    router.push(`/dashboard/blog/edit/${post.id}`);
  };

  const handleView = (post) => {
    router.push(`/dashboard/blog/view/${post.id}`);
  };

  const handleDelete = (post) => {
    // Handle post deletion
    console.log('Deleting post:', post.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your blog posts and content
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/blog/new')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PenSquare className="w-5 h-5 mr-2" />
          Create Post
        </button>
      </div>

      {/* Filters */}
      <BlogFilter onFilterChange={handleFilterChange} />

      {/* Blog List */}
      <BlogList 
        posts={posts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">10</span> of{' '}
              <span className="font-medium">20</span> posts
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                2
              </button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;