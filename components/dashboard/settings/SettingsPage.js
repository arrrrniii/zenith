

// components/dashboard/settings/SettingsPage.js
import React, { useState } from 'react';
import SettingsNav from './SettingsNav';
import GeneralSettings from './GeneralSettings';
import ProfileSettings from './ProfileSettings';
import SecuritySettings from './SecuritySettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      // Add other cases for remaining tabs
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="flex space-x-8">
      <div className="w-64 flex-shrink-0">
        <SettingsNav 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPage;