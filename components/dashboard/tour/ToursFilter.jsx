//components/dashboard/tour/ToursFilter.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';

export const ToursFilter = ({ onFilterChange, isLoading, initialFilters = {} }) => {
  const [dateRange, setDateRange] = useState({
    from: initialFilters.startDate ? new Date(initialFilters.startDate) : null,
    to: initialFilters.endDate ? new Date(initialFilters.endDate) : null
  });

  const handleDateSelect = (range) => {
    if (!range) {
      setDateRange({ from: null, to: null });
      onFilterChange?.({ startDate: null, endDate: null });
      return;
    }

    setDateRange(range);
    
    onFilterChange?.({ 
      startDate: range.from ? format(range.from, 'yyyy-MM-dd') : null,
      endDate: range.to ? format(range.to, 'yyyy-MM-dd') : null
    });
  };

  const handleClearFilters = () => {
    setDateRange({ from: null, to: null });
    onFilterChange?.({ 
      search: '', 
      status: 'all', 
      type: 'all', 
      startDate: null, 
      endDate: null 
    });
  };

  const handleSelectChange = (key, value) => {
    if (value === 'all') {
      onFilterChange?.({ [key]: '' });
    } else {
      onFilterChange?.({ [key]: value });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tours..."
            disabled={isLoading}
            className="w-full pl-10"
            value={initialFilters.search || ''}
            onChange={(e) => onFilterChange?.({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          value={initialFilters.status || 'all'}
          onValueChange={(value) => handleSelectChange('status', value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={initialFilters.type || 'all'}
          onValueChange={(value) => handleSelectChange('type', value)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="single_day">Single Day</SelectItem>
            <SelectItem value="multi_day">Multi Day</SelectItem>
            <SelectItem value="guided">Guided</SelectItem>
            <SelectItem value="self_guided">Self Guided</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Calendar className="h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM d, yyyy")} -{" "}
                    {format(dateRange.to, "MMM d, yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "MMM d, yyyy")
                )
              ) : (
                "Select dates"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button 
          variant="outline"
          className="flex items-center gap-2"
          disabled={isLoading}
          onClick={handleClearFilters}
        >
          <Filter className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};