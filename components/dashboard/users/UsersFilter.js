// components/dashboard/users/UsersFilter.js
import React from 'react';
import { Search, Filter, UserPlus } from 'lucide-react';

const UsersFilter = ({ onFilterChange }) => (
  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => onFilterChange?.({ search: e.target.value })}
        />
      </div>
    </div>
    
    <div className="flex gap-3">
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onFilterChange?.({ role: e.target.value })}
      >
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
        <option value="customer">Customer</option>
        <option value="guide">Guide</option>
      </select>
      
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onFilterChange?.({ status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  </div>
);

export default UsersFilter;


