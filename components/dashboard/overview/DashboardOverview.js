// components/dashboard/overview/DashboardOverview.js
import React from 'react';
import { 
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  MapPin,
  FileText,
  ArrowUp,
  ArrowDown,

} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
 
} from 'recharts';

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-900 mt-2">{value}</h3>
        {change && (
          <p className={`text-sm mt-2 flex items-center ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <ArrowUp className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-1" />
            )}
            {change}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
    </div>
    <div className="divide-y divide-gray-200">
      {activities.map((activity, index) => (
        <div key={index} className="px-6 py-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${activity.iconBg}`}>
              <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
            </div>
            <span className="ml-auto text-sm text-gray-500">{activity.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PopularTours = ({ tours }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Popular Tours</h3>
    </div>
    <div className="divide-y divide-gray-200">
      {tours.map((tour, index) => (
        <div key={index} className="px-6 py-4">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{tour.name}</p>
              <div className="flex items-center mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm text-gray-500">{tour.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{tour.bookings} bookings</p>
              <p className="text-sm text-gray-500 mt-1">${tour.revenue}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BookingChart = ({ data }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-6">Booking Trends</h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="bookings" 
            stroke="#3B82F6" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const RevenueChart = ({ data }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-6">Revenue Overview</h3>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const DashboardOverview = () => {
  // Sample data
  const stats = [
    {
      title: 'Total Bookings',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Calendar
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Active Users',
      value: '892',
      change: '-3.1%',
      trend: 'down',
      icon: Users
    },
    {
      title: 'Page Views',
      value: '10.5k',
      change: '+5.7%',
      trend: 'up',
      icon: Eye
    }
  ];

  const activities = [
    {
      title: 'New Booking',
      description: 'John Doe booked Chicago Architecture Tour',
      time: '5 min ago',
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'New Review',
      description: 'Sarah left a 5-star review for Food Tour',
      time: '1 hour ago',
      icon: FileText,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Revenue Alert',
      description: 'Monthly revenue target achieved',
      time: '2 hours ago',
      icon: TrendingUp,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  const popularTours = [
    {
      name: 'Chicago Architecture Tour',
      location: 'Chicago, IL',
      bookings: 156,
      revenue: '15,600'
    },
    {
      name: 'Food Tasting Tour',
      location: 'Chicago, IL',
      bookings: 132,
      revenue: '13,200'
    },
    {
      name: 'Night Photography Tour',
      location: 'Chicago, IL',
      bookings: 89,
      revenue: '8,900'
    }
  ];

  const bookingData = [
    { name: 'Jan', bookings: 65 },
    { name: 'Feb', bookings: 85 },
    { name: 'Mar', bookings: 78 },
    { name: 'Apr', bookings: 99 },
    { name: 'May', bookings: 110 },
    { name: 'Jun', bookings: 125 }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 4500 },
    { name: 'Feb', revenue: 5200 },
    { name: 'Mar', revenue: 4800 },
    { name: 'Apr', revenue: 6300 },
    { name: 'May', revenue: 7100 },
    { name: 'Jun', revenue: 8500 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingChart data={bookingData} />
        <RevenueChart data={revenueData} />
      </div>

      {/* Activity and Popular Tours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={activities} />
        <PopularTours tours={popularTours} />
      </div>
    </div>
  );
};

export default DashboardOverview;
