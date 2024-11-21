import React from 'react';
import { Plus } from 'lucide-react';

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
  </div>
);

const ActionButton = ({ label, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center p-6 ${color} text-white rounded-lg hover:bg-opacity-90 transition-colors`}
  >
    <Plus className="w-5 h-5 mr-2" />
    {label}
  </button>
);

const StatsSection = () => {
  const stats = [
    { label: 'Total Tours', value: '124' },
    { label: 'Active Tours', value: '89' },
    { label: 'Total Attractions', value: '256' },
    { label: 'Total Blog Posts', value: '45' }
  ];

  const quickActions = [
    { label: 'Add New Tour', color: 'bg-blue-600', onClick: () => console.log('Add tour clicked') },
    { label: 'Add Attraction', color: 'bg-green-600', onClick: () => console.log('Add attraction clicked') },
    { label: 'Create Blog Post', color: 'bg-purple-600', onClick: () => console.log('Add blog clicked') }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard 
            key={index}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <ActionButton
            key={index}
            label={action.label}
            color={action.color}
            onClick={action.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsSection;