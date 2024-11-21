// components/BasicDetailsTab/Keywords.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const Keywords = ({ keywords, onChange, error }) => (
  <div className="space-y-2">
    <Label htmlFor="keywords" className="flex items-center gap-2">
      Keywords
      <span className="text-xs text-gray-500">(Comma-separated)</span>
    </Label>
    <Input
      id="keywords"
      value={keywords}
      onChange={(e) => onChange('keywords', e.target.value)}
      placeholder="web development, responsive design, SEO optimization"
      className={error ? 'border-red-500' : ''}
    />
    <div className="flex justify-between text-xs">
      <span className="text-gray-500">
        Add 5-10 relevant keywords separated by commas
      </span>
      {error && <span className="text-red-500">{error}</span>}
    </div>
    {keywords && (
      <div className="flex flex-wrap gap-2">
        {keywords.split(',').map((keyword, index) => (
          keyword.trim() && (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 rounded-full text-xs"
            >
              {keyword.trim()}
            </span>
          )
        ))}
      </div>
    )}
  </div>
);