// components/BasicDetailsTab/Description.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const Description = ({ description, onChange, error }) => (
  <div className="space-y-2">
    <Label htmlFor="description" className="flex items-center gap-2">
      Blog Description
      <span className="text-xs text-gray-500">(Used for meta description TOO)</span>
    </Label>
    <Textarea
      id="description"
      value={description}
      onChange={(e) => onChange('description', e.target.value)}
      placeholder="Provide a compelling description of your service (150-160 characters for optimal SEO)"
      rows={3}
      className={error ? 'border-red-500' : ''}
    />
    <div className="mt-1 text-xs flex justify-between">
      <span className="text-gray-500">
        {description.length}/160 characters
      </span>
      {error && <span className="text-red-500">{error}</span>}
      {description.length > 160 && (
        <span className="text-red-500">
          (Exceeds recommended length)
        </span>
      )}
    </div>
  </div>
);
