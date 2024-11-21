// components/BasicDetailsTab/UrlSlug.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { generateSlug } from './slugUtils';

export const UrlSlug = ({ slug, title, onChange, error }) => (
  <div className="space-y-2">
    <Label htmlFor="slug" className="flex items-center gap-2">
      URL Slug
      <span className="text-xs text-gray-500">(SEO-friendly URL)</span>
    </Label>
    <div className="flex gap-2">
      <Input
        id="slug"
        value={slug}
        onChange={(e) => onChange('slug', generateSlug(e.target.value))}
        placeholder="professional-web-development-services"
        className={error ? 'border-red-500' : ''}
      />
      <Button
        variant="outline"
        onClick={() => onChange('slug', generateSlug(title))}
      >
        Generate
      </Button>
    </div>
    <div className="flex justify-between text-xs">
      <span className="text-gray-500">
        yoursite.com/services/{slug}
      </span>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  </div>
);