import React from 'react';
import { Bell, Search } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Section */}
        <div className="flex items-center flex-1">
          <div className="relative w-64">
            <input 
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-700">Admin User</span>
              <span className="text-xs text-gray-500">admin@example.com</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">AU</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;