// components/dashboard/settings/GeneralSettings.js
import React from 'react';

const GeneralSettings = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Site Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Site Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue="Your Travel Agency"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue="contact@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Support Phone</label>
          <input
            type="tel"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultValue="+1 (555) 123-4567"
          />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Opening Time</label>
            <input
              type="time"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue="09:00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Closing Time</label>
            <input
              type="time"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              defaultValue="17:00"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Days</label>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={day !== 'Sun'}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">{day}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default GeneralSettings;