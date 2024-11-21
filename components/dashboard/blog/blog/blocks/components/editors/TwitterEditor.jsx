// components/admin/dashboard/service/blocks/components/editors/TwitterEditor.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TwitterEditor = ({ content, onChange }) => {
  // Initialize default content
  const twitterContent = {
    tweetUrl: '',
    theme: 'light', // light or dark
    ...content
  };

  const handleUrlChange = (e) => {
    const tweetUrl = e.target.value;
    onChange({ ...twitterContent, tweetUrl });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Tweet URL</Label>
        <Input
          type="url"
          value={twitterContent.tweetUrl}
          onChange={handleUrlChange}
          placeholder="Enter Tweet URL"
        />
        <p className="text-sm text-gray-500 mt-1">
          Paste the URL of your Tweet here
        </p>
      </div>

      <div>
        <Label>Theme</Label>
        <Select
          value={twitterContent.theme}
          onValueChange={(value) => onChange({ ...twitterContent, theme: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

