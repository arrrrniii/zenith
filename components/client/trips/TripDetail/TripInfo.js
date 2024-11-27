import React, { useState } from 'react';
import { 
  Clock, Users, MapPin, Globe, Check, X, 
  CalendarDays, Info, ShieldCheck, HelpCircle,
  ChevronDown, Sparkles, Star
} from 'lucide-react';

const TripInfo = ({
  description = '',
  highlights = [],
  included = {
    included: [],
    notIncluded: []
  },
  whatToExpect = {
    schedule: [],
    groupSize: 'Not specified'
  },
  departure = {
    duration: 'Not specified',
    point: 'Not specified',
    directions: '',
    startTimes: []
  },
  cancellation = {
    policy: '',
    refundPolicy: '',
    noRefundPolicy: ''
  },
  faq = []
}) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const InfoCard = ({ icon: Icon, label, value }) => (
    <div className="flex-1 backdrop-blur-sm bg-white/80 rounded-2xl p-6 transform transition-all duration-300 hover:scale-105">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-black/5 rounded-xl">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
    </div>
  );

  const ExpandableSection = ({ id, icon: Icon, title, children, condition = true }) => {
    if (!condition) return null;
    
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-6 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-50 rounded-xl">
              <Icon className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${
              expandedSection === id ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        {expandedSection === id && (
          <div 
            className="px-6 pb-6 animate-slideDown"
            style={{
              animation: 'slideDown 0.4s ease-out'
            }}
          >
            {children}
          </div>
        )}
      </div>
    );
  };

  // Ensure included arrays exist
  const includedItems = included?.included || [];
  const notIncludedItems = included?.notIncluded || [];
  const scheduleItems = whatToExpect?.schedule || [];
  const startTimes = departure?.startTimes || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard 
          icon={Clock} 
          label="Duration" 
          value={departure?.duration || 'Not specified'}
        />
        <InfoCard 
          icon={Users} 
          label="Group Size" 
          value={whatToExpect?.groupSize || 'Not specified'}
        />
        <InfoCard 
          icon={MapPin} 
          label="Starting Point" 
          value={departure?.point || 'Not specified'}
        />
      </div>

      {/* Key Features */}
      {highlights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.slice(0, 4).map((highlight, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-md"
            >
              <div className="p-2 bg-blue-50 rounded-xl">
                <Star className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-gray-700 font-medium">{highlight}</p>
            </div>
          ))}
        </div>
      )}

      {/* Expandable Sections */}
      <div className="space-y-4">
        <ExpandableSection 
          id="schedule" 
          icon={CalendarDays} 
          title="Tour Schedule"
          condition={scheduleItems.length > 0}
        >
          <div className="space-y-6">
            {scheduleItems.map((item, index) => (
              <div key={index} className="flex gap-6 relative">
                <div className="w-16 shrink-0 pt-1">
                  <span className="text-sm font-semibold text-blue-600">{item.time}</span>
                </div>
                <div className="flex-1 pb-6 border-l-2 border-blue-100 pl-6">
                  <h4 className="font-medium text-gray-900">{item.activity}</h4>
                  <p className="mt-2 text-gray-600 leading-relaxed">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </ExpandableSection>

        <ExpandableSection 
          id="included" 
          icon={Check} 
          title="What's Included"
          condition={includedItems.length > 0 || notIncludedItems.length > 0}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {includedItems.length > 0 && (
              <div className="space-y-4">
                {includedItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            )}
            {notIncludedItems.length > 0 && (
              <div className="space-y-4">
                {notIncludedItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ExpandableSection>

        <ExpandableSection 
          id="meeting" 
          icon={MapPin} 
          title="Meeting Point"
          condition={!!(departure?.point || departure?.directions || startTimes.length)}
        >
          <div className="space-y-6">
            {(departure?.point || departure?.directions) && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-2">{departure.point}</h4>
                <p className="text-gray-600 leading-relaxed">{departure.directions}</p>
              </div>
            )}
            {startTimes.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Available Start Times</h4>
                <div className="flex flex-wrap gap-2">
                  {startTimes.map((time, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium transition-colors duration-300 hover:bg-blue-100"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ExpandableSection>

        <ExpandableSection 
          id="cancellation" 
          icon={ShieldCheck} 
          title="Cancellation Policy"
          condition={!!(cancellation?.policy || cancellation?.refundPolicy || cancellation?.noRefundPolicy)}
        >
          <div className="space-y-4">
            {cancellation?.policy && (
              <p className="text-gray-600 leading-relaxed">{cancellation.policy}</p>
            )}
            {cancellation?.refundPolicy && (
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-green-800">{cancellation.refundPolicy}</p>
                </div>
              </div>
            )}
            {cancellation?.noRefundPolicy && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-500 mt-0.5" />
                  <p className="text-gray-600">{cancellation.noRefundPolicy}</p>
                </div>
              </div>
            )}
          </div>
        </ExpandableSection>

        <ExpandableSection 
          id="faq" 
          icon={HelpCircle} 
          title="FAQ"
          condition={faq.length > 0}
        >
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div 
                key={index} 
                className="p-4 bg-gray-50 rounded-xl last:mb-0"
              >
                <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </ExpandableSection>
      </div>
    </div>
  );
};

export default TripInfo;