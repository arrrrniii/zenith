// components/BasicDetailsTab/blogTitle.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const ServiceTitle = ({ title, onChange, error }) => (
  <div className="space-y-2">
    <Label htmlFor="title" className="flex items-center gap-2">
      Blog Title
      <span className="text-xs text-gray-500">(Not used for SEO)</span>
    </Label>
    <Input
      id="title"
      value={title}
      onChange={(e) => onChange('title', e.target.value)}
      placeholder="e.g., Professional Web Development Services"
      className={error ? 'border-red-500' : ''}
    />
    <div className="mt-1 text-xs flex justify-between">
      <span className="text-gray-500">
        {title.length}/60 characters
      </span>
      {error && <span className="text-red-500">{error}</span>}
      {title.length > 60 && (
        <span className="text-red-500">
          (Exceeds recommended length)
        </span>
      )}
    </div>
  </div>
);
