// components/dashboard/blog/BlogFilter.js
import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';

const BlogFilter = ({ onFilterChange }) => (
  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => onFilterChange?.({ search: e.target.value })}
        />
      </div>
    </div>
    
    <div className="flex gap-3">
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onFilterChange?.({ category: e.target.value })}
      >
        <option value="">All Categories</option>
        <option value="travel-tips">Travel Tips</option>
        <option value="destinations">Destinations</option>
        <option value="guides">City Guides</option>
        <option value="culture">Culture & History</option>
      </select>
      
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onFilterChange?.({ status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  </div>
);

export default BlogFilter;


