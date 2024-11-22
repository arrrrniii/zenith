// components/dashboard/bookings/BookingsFilter.js
import React from 'react';
import { Search, Filter } from 'lucide-react';

const BookingsFilter = ({ onFilterChange }) => (
  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search bookings..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => onFilterChange?.({ search: e.target.value })}
        />
      </div>
    </div>
    
    <div className="flex gap-3">
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onFilterChange?.({ status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="confirmed">Confirmed</option>
        <option value="pending">Pending</option>
        <option value="cancelled">Cancelled</option>
        <option value="completed">Completed</option>
      </select>
      
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onFilterChange?.({ tourType: e.target.value })}
      >
        <option value="">All Tours</option>
        <option value="city">City Tours</option>
        <option value="food">Food Tours</option>
        <option value="adventure">Adventure Tours</option>
      </select>

      <div className="relative">
        <input
          type="date"
          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => onFilterChange?.({ date: e.target.value })}
        />
      </div>
      
      <button className="flex items-center px-3 py-2 border rounded-lg text-sm hover:bg-gray-50">
        <Filter className="h-4 w-4 mr-2" />
        More Filters
      </button>
    </div>
  </div>
);

export default BookingsFilter;





