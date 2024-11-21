// components/dashboard/users/UsersList.js
import React from 'react';
import Image from 'next/image';
import { 
  MoreVertical,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock 
} from 'lucide-react';

const UserRoleBadge = ({ role }) => {
  const roleStyles = {
    admin: 'bg-purple-100 text-purple-800',
    staff: 'bg-blue-100 text-blue-800',
    guide: 'bg-green-100 text-green-800',
    customer: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyles[role]}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

const UserStatusBadge = ({ status }) => {
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

const UsersList = ({ users, onViewUser, onEditUser }) => (
  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            User
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Role
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Last Active
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Joined
          </th>
          <th className="relative px-6 py-3">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user) => (
          <tr 
            key={user.id}
            className="hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onViewUser(user)}
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 relative">
                  <Image
                    src={user.avatar || '/placeholder-avatar.jpg'}
                    alt=""
                    fill
                    className="rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.email}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <UserRoleBadge role={user.role} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <UserStatusBadge status={user.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.lastActive}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {user.joinedDate}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditUser(user);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UsersList;