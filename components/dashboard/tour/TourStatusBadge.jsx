// components/tours/TourStatusBadge.jsx
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export const TourStatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle2
    },
    draft: {
      color: 'bg-gray-100 text-gray-800',
      icon: AlertCircle
    },
    archived: {
      color: 'bg-red-100 text-red-800',
      icon: XCircle
    }
  };

  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};