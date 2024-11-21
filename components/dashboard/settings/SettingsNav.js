// components/dashboard/settings/SettingsNav.js
import React from 'react';
import { 
  User,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Mail,
  Users,
  Settings as SettingsIcon
} from 'lucide-react';

const SettingsNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'general', label: 'General Settings', icon: SettingsIcon },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'team', label: 'Team Members', icon: Users },
    { id: 'emails', label: 'Email Templates', icon: Mail },
    { id: 'site', label: 'Site Settings', icon: Globe }
  ];

  return (
    <nav className="space-y-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center w-full px-4 py-2 text-sm rounded-lg
              ${activeTab === tab.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Icon className="w-5 h-5 mr-3" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

export default SettingsNav;