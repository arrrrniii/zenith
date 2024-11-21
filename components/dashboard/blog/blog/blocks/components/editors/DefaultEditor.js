// components/admin/dashboard/service/blocks/components/editors/DefaultEditor.js
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code } from 'lucide-react';

export const DefaultEditor = ({ content, blockType }) => {
  return (
    <div className="space-y-4">
      <Alert>
        <Code className="h-4 w-4" />
        <AlertDescription>
          Editor not implemented for {blockType} block type.
          Content preview:
        </AlertDescription>
      </Alert>
      <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto">
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  );
};