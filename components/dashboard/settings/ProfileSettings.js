// components/dashboard/settings/ProfileSettings.js
import React from 'react';
import Image from 'next/image';

const ProfileSettings = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative h-20 w-20">
            <Image
              src="/api/placeholder/80/80"
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Change Avatar
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time Zone</label>
            <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>America/Chicago</option>
              <option>America/New_York</option>
              <option>America/Los_Angeles</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileSettings;