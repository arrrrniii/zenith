
// components/checkout/elements/TrustBadges.js
import { Shield, Clock, Lock, Award, Star } from 'lucide-react';

const TrustBadge = ({ icon: Icon, title, description }) => (
  <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50">
      <Icon className="w-4 h-4 text-gray-600" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <p className="text-xs text-gray-600 mt-0.5">{description}</p>
    </div>
  </div>
);

const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your data is protected with SSL encryption'
    },
    {
      icon: Clock,
      title: 'Instant Confirmation',
      description: 'Receive confirmation immediately after booking'
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'We use industry-leading security standards'
    },
    {
      icon: Award,
      title: 'Best Price Guarantee',
      description: 'Find a better price and well match it'
    }
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((badge, index) => (
          <TrustBadge key={index} {...badge} />
        ))}
      </div>
      
      {/* Additional trust indicators */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900">Trusted by 100,000+ travelers</span>
        </div>
        <div className="flex gap-3">
          <img 
            src="/api/placeholder/80/40"
            alt="Trust badge 1"
            className="h-8 w-auto object-contain grayscale opacity-75 hover:opacity-100 transition-opacity"
          />
          <img 
            src="/api/placeholder/80/40"
            alt="Trust badge 2"
            className="h-8 w-auto object-contain grayscale opacity-75 hover:opacity-100 transition-opacity"
          />
          <img 
            src="/api/placeholder/80/40"
            alt="Trust badge 3"
            className="h-8 w-auto object-contain grayscale opacity-75 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;