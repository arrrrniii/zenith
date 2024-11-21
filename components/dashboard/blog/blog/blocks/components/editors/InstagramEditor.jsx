// components/admin/dashboard/service/blocks/components/editors/InstagramEditor.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const InstagramEditor = ({ content, onChange }) => {
  // Initialize default content from your config
  const instagramContent = {
    postUrl: '',
    ...content
  };

  const handleUrlChange = (e) => {
    const postUrl = e.target.value;
    onChange({ ...instagramContent, postUrl });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Instagram Post URL</Label>
        <Input
          type="url"
          value={instagramContent.postUrl}
          onChange={handleUrlChange}
          placeholder="Enter Instagram post URL"
        />
        <p className="text-sm text-gray-500 mt-1">
          Paste the URL of your Instagram post here
        </p>
      </div>
    </div>
  );
};