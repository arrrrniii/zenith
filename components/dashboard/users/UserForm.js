// components/dashboard/users/UserForm.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { 
  ArrowLeft,
  Upload,
  X,
  Plus
} from 'lucide-react';

const FormSection = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div className="px-6 py-4">
      {children}
    </div>
  </div>
);

const UserForm = ({ initialData, mode = 'create' }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    location: '',
    avatar: null,
    permissions: [],
    ...initialData
  });

  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'staff', label: 'Staff Member' },
    { value: 'guide', label: 'Tour Guide' },
    { value: 'customer', label: 'Customer' }
  ];

  const availablePermissions = [
    { id: 1, name: 'Manage Tours', key: 'tours.manage' },
    { id: 2, name: 'Manage Bookings', key: 'bookings.manage' },
    { id: 3, name: 'Manage Users', key: 'users.manage' },
    { id: 4, name: 'View Reports', key: 'reports.view' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Handle form submission
      console.log('Form data:', formData);
      router.push('/dashboard/users');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          type="button"
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Users
        </button>
      </div>

      {/* Profile Information */}
      <FormSection title="Profile Information">
        <div className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-center space-x-4">
            <div className="relative h-20 w-20">
              <Image
                src={formData.avatar || '/placeholder-avatar.jpg'}
                alt=""
                fill
                className="rounded-full object-cover"
              />
            </div>
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              Change Photo
            </button>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Role & Status */}
      <FormSection title="Role & Permissions">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="space-y-2">
              {availablePermissions.map((permission) => (
                <label key={permission.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.key)}
                    onChange={(e) => {
                      const newPermissions = e.target.checked
                        ? [...formData.permissions, permission.key]
                        : formData.permissions.filter(p => p !== permission.key);
                      setFormData({ ...formData, permissions: newPermissions });
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{permission.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </FormSection>

      {/* Password Section - Only for create mode or password reset */}
      {mode === 'create' && (
        <FormSection title="Set Password">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
          </p>
        </FormSection>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {mode === 'create' ? 'Create User' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
