

// /tour/ToursFilter.jsx
import { Search, Filter } from 'lucide-react';

export const ToursFilter = ({ onFilterChange, isLoading }) => (
  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search tours..."
          disabled={isLoading}
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          onChange={(e) => onFilterChange?.({ search: e.target.value })}
        />
      </div>
    </div>
    
    <div className="flex gap-3">
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        onChange={(e) => onFilterChange?.({ status: e.target.value })}
        disabled={isLoading}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
      
      <select 
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        onChange={(e) => onFilterChange?.({ type: e.target.value })}
        disabled={isLoading}
      >
        <option value="">All Types</option>
        <option value="single_day">Single Day</option>
        <option value="multi_day">Multi Day</option>
        <option value="guided">Guided</option>
        <option value="self_guided">Self Guided</option>
      </select>
      
      <button 
        className="flex items-center px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:bg-gray-100"
        disabled={isLoading}
      >
        <Filter className="h-4 w-4 mr-2" />
        More Filters
      </button>
    </div>
  </div>
);