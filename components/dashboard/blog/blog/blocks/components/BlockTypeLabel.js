

// components/admin/dashboard/service/blocks/components/BlockTypeLabel.js
import React from 'react';
import { getBlockConfig } from '../config';

export const BlockTypeLabel = ({ block }) => {
const config = getBlockConfig(block.type);
if (!config) return null;

return (
<div className="flex items-center gap-2">
 <config.icon className="w-4 h-4 text-gray-500" />
 <span className="text-sm font-medium">{config.label}</span>
</div>
);
};