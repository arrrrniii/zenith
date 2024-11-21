// components/admin/dashboard/blog/blocks/components/SettingsTab/index.jsx
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings } from 'lucide-react';
import { PublishingStatus } from './PublishingStatus';
import { useFormValidation } from '../../hooks/useFormValidation';

export const SettingsTab = ({ formData, onChange, disabled = false }) => {
  const { errors, validateField } = useFormValidation();

  const handleStatusChange = (value) => {
    validateField('status', value);
    onChange('status', value);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <PublishingStatus
          status={formData.status}
          onChange={handleStatusChange}
          error={errors.status}
          disabled={disabled}
        />

        {/* <Alert className="mt-6">
          <Settings className="h-4 w-4" />
          <AlertDescription>
            <h4 className="font-medium mb-2">Advanced Settings Available</h4>
            <ul className="list-disc ml-4 space-y-1">
              <li>Schedule publication date</li>
              <li>Set access permissions</li>
              <li>Configure related blogs</li>
              <li>Enable analytics tracking</li>
            </ul>
          </AlertDescription>
        </Alert> */}
      </div>
    </div>
  );
};