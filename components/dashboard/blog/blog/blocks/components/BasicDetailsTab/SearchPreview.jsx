// components/BasicDetailsTab/SearchPreview.jsx
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe } from 'lucide-react';

export const SearchPreview = ({ formData }) => (
  <div className="space-y-4">
    <Alert>
      <Globe className="h-4 w-4" />
      <AlertDescription>
        Search Engine Preview
      </AlertDescription>
    </Alert>

    <div className="border rounded-lg p-4 space-y-1 bg-white">
      <div className="text-blue-600 text-xl hover:underline cursor-pointer">
        {formData.title || "Your blog Title"}
      </div>
      <div className="text-green-700 text-sm">
       creativespehere.co/{formData.slug || "blog-url"}
      </div>
      <div className="text-sm text-gray-600">
        {formData.description || "Your service description will appear here..."}
      </div>
    </div>
  </div>
);
