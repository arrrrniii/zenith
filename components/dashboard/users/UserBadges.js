// components/dashboard/users/UserBadges.js
import React from 'react';
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react';

export const UserRoleBadge = ({ role }) => {
  const roleStyles = {
    admin: 'bg-purple-100 text-purple-800',
    staff: 'bg-blue-100 text-blue-800',
    guide: 'bg-green-100 text-green-800',
    customer: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyles[role]}`}>
      <Shield className="w-3 h-3 mr-1" />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

export const UserStatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    },
    inactive: {
      color: 'bg-red-100 text-red-800',
      icon: XCircle
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};