// components/dashboard/users/UsersPage.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { UserPlus } from 'lucide-react';
import UsersFilter from './UsersFilter';
import UsersList from './UsersList';

const UsersPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  // Sample users data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      status: 'active',
      lastActive: '5 minutes ago',
      joinedDate: 'Jan 15, 2024',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'staff',
      status: 'active',
      lastActive: '2 hours ago',
      joinedDate: 'Feb 1, 2024',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      role: 'guide',
      status: 'inactive',
      lastActive: '1 day ago',
      joinedDate: 'Dec 10, 2023',
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      role: 'customer',
      status: 'pending',
      lastActive: 'Never',
      joinedDate: 'Mar 15, 2024',
      avatar: '/api/placeholder/32/32'
    }
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleViewUser = (user) => {
    router.push(`/dashboard/users/${user.id}`);
  };

  const handleEditUser = (user) => {
    router.push(`/dashboard/users/edit/${user.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/users/new')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <UsersFilter onFilterChange={handleFilterChange} />

      {/* Users List */}
      <UsersList 
        users={users}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
        <div className="flex flex-1 justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">10</span> of{' '}
              <span className="font-medium">20</span> users
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;