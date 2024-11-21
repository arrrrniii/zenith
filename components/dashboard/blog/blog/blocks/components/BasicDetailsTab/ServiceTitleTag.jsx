// components/BasicDetailsTab/ServiceTitle.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'

export const ServiceTitleTag = ({ titletag, onChange, error }) => (
  <div className="space-y-2">
    <Label htmlFor="titletag" className="flex items-center gap-2">
        Meta Title Tag
      <span className="text-xs text-gray-500">(Used only for SEO. Keep in mind it has a default setting | Creative Sphere)</span>
    </Label>
    <Input
      id="titletag"
      value={titletag}
      onChange={(e) => onChange('titletag', e.target.value)}
      placeholder="e.g., Professional Web Development Services"
      className={error ? 'border-red-500' : ''}
    />
    <div className="mt-1 text-xs flex justify-between">
      <span className="text-gray-500">
        {titletag.length}/60 characters
      </span>
      {error && <span className="text-red-500">{error}</span>}
      {titletag.length > 60 && (
        <span className="text-red-500">
          (Exceeds recommended length)
        </span>
      )}
    </div>
  </div>
);
