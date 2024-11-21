// components/dashboard/blog/BlogList.js
import React from 'react';
import Image from 'next/image';
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  User,
  MessageCircle
} from 'lucide-react';

const PostStatusBadge = ({ status }) => {
  const statusStyles = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    archived: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const BlogList = ({ posts, onEdit, onDelete, onView }) => (
  <div className="grid gap-6">
    {posts.map((post) => (
      <div 
        key={post.id}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="flex">
          {/* Thumbnail */}
          <div className="relative w-48 h-32">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
              <PostStatusBadge status={post.status} />
            </div>

            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {post.publishDate}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                {post.commentsCount} comments
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-l border-gray-200 p-4 flex flex-col justify-center space-y-2">
            <button 
              onClick={() => onView(post)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onEdit(post)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onDelete(post)}
              className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default BlogList;