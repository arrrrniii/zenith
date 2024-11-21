import React, { useState } from 'react';
import { 
  Clock, Users, MapPin, Globe, Check, X, 
  CalendarDays, Info, ShieldCheck, HelpCircle,
  ChevronRight, ChevronDown, Sparkles 
} from 'lucide-react';

const TripInfo = ({
  description,
  highlights = [],
  included = { included: [], notIncluded: [] },
  whatToExpect = { schedule: [], groupSize: '' },
  departure = { duration: '', point: '', directions: '', startTimes: [] },
  cancellation = { policy: '', refundPolicy: '', noRefundPolicy: '' },
  faq = []
}) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Stats */}
      <div className="flex gap-8 p-8 bg-black text-white rounded-3xl mb-8">
        <div className="flex-1 space-y-1">
          <p className="text-gray-400 text-sm">Duration</p>
          <p className="text-2xl font-medium">{departure.duration}</p>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-gray-400 text-sm">Group Size</p>
          <p className="text-2xl font-medium">{whatToExpect.groupSize}</p>
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-gray-400 text-sm">Starting Point</p>
          <p className="text-2xl font-medium truncate">{departure.point}</p>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {highlights.slice(0, 4).map((highlight, index) => (
          <div 
            key={index}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl"
          >
            <Sparkles className="w-5 h-5 text-blue-500" />
            <p className="text-sm">{highlight}</p>
          </div>
        ))}
      </div>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {/* Schedule Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('schedule')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="w-6 h-6" />
              <h3 className="text-lg font-medium">Tour Schedule</h3>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${
                expandedSection === 'schedule' ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedSection === 'schedule' && (
            <div className="px-6 pb-6">
              <div className="space-y-6">
                {whatToExpect.schedule.map((item, index) => (
                  <div key={index} className="flex gap-4 relative">
                    <div className="w-12 shrink-0 pt-1">
                      <span className="text-sm font-medium text-blue-500">{item.time}</span>
                    </div>
                    <div className="flex-1 pb-6 border-l-2 border-gray-100 pl-6">
                      <h4 className="font-medium">{item.activity}</h4>
                      <p className="mt-2 text-sm text-gray-600">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* What's Included Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('included')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6" />
              <h3 className="text-lg font-medium">What's Included</h3>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${
                expandedSection === 'included' ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedSection === 'included' && (
            <div className="px-6 pb-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {included.included.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {included.notIncluded.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Meeting Point Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('meeting')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6" />
              <h3 className="text-lg font-medium">Meeting Point</h3>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${
                expandedSection === 'meeting' ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedSection === 'meeting' && (
            <div className="px-6 pb-6 space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium">{departure.point}</h4>
                <p className="text-sm text-gray-600">{departure.directions}</p>
              </div>
              <div>
                <h4 className="font-medium mb-3">Available Start Times</h4>
                <div className="flex flex-wrap gap-2">
                  {departure.startTimes.map((time, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-50 rounded-full text-sm"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('cancellation')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-lg font-medium">Cancellation Policy</h3>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${
                expandedSection === 'cancellation' ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedSection === 'cancellation' && (
            <div className="px-6 pb-6 space-y-4">
              <p className="text-sm">{cancellation.policy}</p>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-600 mt-0.5" />
                  <p className="text-sm text-green-800">{cancellation.refundPolicy}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                <p className="text-sm text-gray-600">{cancellation.noRefundPolicy}</p>
              </div>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('faq')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-6 h-6" />
              <h3 className="text-lg font-medium">FAQ</h3>
            </div>
            <ChevronDown 
              className={`w-5 h-5 transition-transform ${
                expandedSection === 'faq' ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedSection === 'faq' && (
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <h4 className="font-medium mb-2">{item.question}</h4>
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripInfo;