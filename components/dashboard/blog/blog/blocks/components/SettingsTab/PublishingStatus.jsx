//components/admin/dashboard/blog/blocks/components/SettingsTab/PublishingStatus.jsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SERVICE_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

const STATUS_DESCRIPTIONS = {
  [SERVICE_STATUS.DRAFT]: 'Draft - Save and edit later',
  [SERVICE_STATUS.PUBLISHED]: 'Published - Visible to public',
  [SERVICE_STATUS.ARCHIVED]: 'Archived - Hidden from public'
};

export const PublishingStatus = ({ status, onChange, disabled = false }) => {
  // Convert to uppercase for consistency
  const currentStatus = (status || SERVICE_STATUS.DRAFT).toUpperCase();

  return (
    <div className="space-y-2">
      <Label htmlFor="status">Publishing Status</Label>
      <Select
        value={currentStatus}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full" id="status">
          <SelectValue placeholder="Select status">
            {STATUS_DESCRIPTIONS[currentStatus]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.values(SERVICE_STATUS).map((value) => (
            <SelectItem key={value} value={value}>
              {STATUS_DESCRIPTIONS[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-1 text-xs text-gray-500">
        Control the visibility of your blog page
      </div>
    </div>
  );
};

export default PublishingStatus;