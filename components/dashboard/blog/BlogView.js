// components/dashboard/blog/BlogView.js
import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  ArrowLeft,
  Calendar,
  User,
  Eye,
  MessageCircle,
  Edit,
  Share2,
  Bookmark,
  Clock,
  Tag
} from 'lucide-react';

const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div className="px-6 py-4">
      {children}
    </div>
  </div>
);

const BlogView = ({ post }) => {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Posts
        </button>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
          <button 
            onClick={() => router.push(`/dashboard/blog/edit/${post.id}`)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Post
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Post Content */}
        <div className="col-span-2 space-y-6">
          {/* Featured Image */}
          <div className="relative aspect-[2/1] rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Post Content */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.publishDate}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {post.views} views
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {post.commentsCount} comments
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.readTime} min read
                </div>
              </div>

              <div className="prose max-w-none">
                {post.content}
              </div>

              {/* Tags */}
              <div className="mt-6 flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-400" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Status */}
          <InfoCard title="Post Status">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Visibility</span>
                <span className="text-sm font-medium text-gray-900">Public</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Published</span>
                <span className="text-sm font-medium text-gray-900">{post.publishDate}</span>
              </div>
            </div>
          </InfoCard>

          {/* Categories */}
          <InfoCard title="Categories">
            <div className="space-y-2">
              {post.categories.map((category) => (
                <div 
                  key={category}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-sm text-gray-600">{category}</span>
                </div>
              ))}
            </div>
          </InfoCard>

          {/* SEO Preview */}
          <InfoCard title="SEO Preview">
            <div className="space-y-3">
              <h4 className="text-base text-blue-600 hover:underline">
                {post.seoTitle || post.title}
              </h4>
              <p className="text-sm text-gray-800">
                {post.seoDescription || post.excerpt}
              </p>
              <p className="text-xs text-green-600">
                example.com/blog/{post.slug}
              </p>
            </div>
          </InfoCard>

          {/* Analytics */}
          <InfoCard title="Analytics">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Views Today</span>
                <span className="text-sm font-medium text-gray-900">{post.viewsToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Views</span>
                <span className="text-sm font-medium text-gray-900">{post.views}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Comments</span>
                <span className="text-sm font-medium text-gray-900">{post.commentsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Shares</span>
                <span className="text-sm font-medium text-gray-900">{post.shares}</span>
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
