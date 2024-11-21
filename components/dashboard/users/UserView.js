// components/dashboard/users/UserView.js
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { 
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Shield,
  Edit,
  Key,
  Lock,
  User,
  History
} from 'lucide-react';
import { UserRoleBadge, UserStatusBadge } from './UserBadges';

const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div className="px-6 py-4">
      {children}
    </div>
  </div>
);

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center text-sm">
    <Icon className="w-4 h-4 text-gray-400 mr-2" />
    <span className="text-gray-500 mr-2">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

const ActivityLog = ({ activities }) => (
  <div className="flow-root">
    <ul className="-mb-8">
      {activities.map((activity, index) => (
        <li key={activity.id}>
          <div className="relative pb-8">
            {index !== activities.length - 1 && (
              <span
                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              />
            )}
            <div className="relative flex space-x-3">
              <div>
                <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <activity.icon className="h-4 w-4 text-gray-500" />
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                <div>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <div className="text-sm text-gray-500">
                  <time dateTime={activity.date}>{activity.dateFormatted}</time>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const UserView = ({ user }) => {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Users
        </button>
        <button
          onClick={() => router.push(`/dashboard/users/edit/${user.id}`)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit User
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - User Profile */}
        <div className="col-span-2 space-y-6">
          {/* Basic Information */}
          <InfoCard title="Basic Information">
            <div className="flex items-start space-x-4">
              <div className="relative h-20 w-20">
                <Image
                  src={user.avatar || '/placeholder-avatar.jpg'}
                  alt=""
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.name}
                  </h2>
                  <div className="flex space-x-2">
                    <UserRoleBadge role={user.role} />
                    <UserStatusBadge status={user.status} />
                  </div>
                </div>
                <div className="mt-2 space-y-2">
                  <DetailItem icon={Mail} label="Email" value={user.email} />
                  <DetailItem icon={Phone} label="Phone" value={user.phone} />
                  <DetailItem icon={MapPin} label="Location" value={user.location} />
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Activity Timeline */}
          <InfoCard title="Recent Activity">
            <ActivityLog 
              activities={[
                {
                  id: 1,
                  description: 'Logged in from new device',
                  date: '2024-03-16T13:00',
                  dateFormatted: '2 hours ago',
                  icon: Lock
                },
                {
                  id: 2,
                  description: 'Updated profile information',
                  date: '2024-03-15T15:00',
                  dateFormatted: '1 day ago',
                  icon: User
                }
                // Add more activities
              ]} 
            />
          </InfoCard>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Account Details */}
          <InfoCard title="Account Details">
            <div className="space-y-3">
              <DetailItem 
                icon={Calendar} 
                label="Joined"
                value={user.joinedDate}
              />
              <DetailItem 
                icon={Clock} 
                label="Last Active"
                value={user.lastActive}
              />
              <DetailItem 
                icon={Shield} 
                label="Role"
                value={user.role}
              />
            </div>
          </InfoCard>

          {/* Permissions */}
          <InfoCard title="Permissions">
            <div className="space-y-2">
              {user.permissions?.map((permission, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="text-gray-600">{permission.name}</span>
                  <span className="text-green-600">✓</span>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default UserView;

